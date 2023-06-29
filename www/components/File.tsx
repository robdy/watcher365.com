"use client";
import React, { useEffect, useState } from "react";
import { repo, owner, octokit } from "@/config/octokit";
import DiffContainer from "./DiffContainer";
import { format } from "date-fns";

interface Commit {
  firstElement: string
  secondElement: string
  author: Object
  committer: Object
}

interface Props {
  commits: any;
  path: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const File: React.FC<Props> = ({ commits, path, setLoading }) => {
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    const getUniqueCommits = (commits: Commit[]) => {
      let uniqueCommits: Array<string> = [];
      for (const commit of commits) {
        if (uniqueCommits.includes(commit.firstElement) || !commit.firstElement) {
          continue;
        } else {
          uniqueCommits.push(commit.firstElement);
        }

        if (
          uniqueCommits.includes(commit.secondElement) ||
          !commit.secondElement
        ) {
          continue;
        } else {
          uniqueCommits.push(commit.secondElement);
        }
      }
      return uniqueCommits;
    };

    const getCommitData = async (commitRef: string) => await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: commitRef,
    });

    const getAllCommitsData = async (uniqueCommits: Array<string>) => {
      const uniqueCommitsData: Array<Object> = [{}];
      for (const uniqueCommit of uniqueCommits) {
        const uniqueCommitData = await getCommitData(uniqueCommit);
        uniqueCommitsData.push(uniqueCommitData);
      }
      return uniqueCommitsData;
    };

    const getChangesData = async (commits: Commit[], allCommitsRes: any) => {
      let allChangesData: Object[] = []
      for (const commit of commits) {
        const relatedFirstCommit = allCommitsRes.find(
          (res: { data: { url: string } }) => {
            return res?.data?.url.includes(commit.firstElement);
          }
        );
        const firstCommitContent = Buffer.from(
          relatedFirstCommit.data?.content,
          "base64"
        ).toString();

        let secondCommitContent : string = '';
        if (commit.secondElement) {
          const relatedSecondCommit = allCommitsRes.find(
            (res: { data: { url: string } }) => {
              return res?.data?.url.includes(commit.secondElement);
            }
          );
          secondCommitContent = Buffer.from(
            relatedSecondCommit.data?.content,
            "base64"
          ).toString();
        }
      
        allChangesData.push({
          current: firstCommitContent,
          previous: secondCommitContent,
          commits: commit
        });
      }
      return allChangesData;
    }

    (async () => {
      setLoading(true);
      // Last commit is not necessary as it's displayed by default
      const allButLastCommit = commits.slice(1)
      const uniqueCommits = getUniqueCommits(allButLastCommit);
      const allCommitsRes = await getAllCommitsData(uniqueCommits);
      const allChangesData = await getChangesData(
        allButLastCommit,
        allCommitsRes
      );

      setContent(allChangesData);
      setLoading(false);
    })().catch((e) => {
      // Deal with the fact the chain failed
    });
    
  }, []);
  return (
    <div>
      {content.map((item: any, i: any) => {
        const commitDate = item.commits.committer.committer.date;
        return (
          <div
            key={i}
            className="flex justify-center flex-col items-center text-center"
          >
             <div className="text-sm px-1 my-2 ">
               <p className=" font-bold">
                 Changes on {format(new Date(commitDate), "MMM dd, yyyy")}
               </p>
             </div>

            <DiffContainer
              key={i}
              current={item.current}
              previous={item.previous}
            />
          </div>
        );
      })}
    </div>
  );
};

export default File;
