"use client";
import React, { useEffect, useState } from "react";
import { repo, owner, octokit } from "@/config/octokit";
import DiffContainer from "./DiffContainer";
import { format } from "date-fns";

interface Sha {
  firstElement: string;
  secondElement: string;
}

interface Shas {
  Shas: Sha[];
}

interface Props {
  commits: any;
  path: string;
  commentCount: number;
  setLoading: any;
}

const File: React.FC<Props> = ({ commits, path, commentCount, setLoading }) => {
  const [commitData, setCommitData] = useState<any>({});
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    const getUniqueCommits = (commits: any) => {
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

    const getCommitData = async (commitRef: any) => await octokit.rest.repos.getContent({
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

    const getChangesData = async (commits: any, allCommitsRes: any) => {
      for (const commit of commits) {
        const relatedCommit = allCommitsRes.find(
          (res: { data: { url: string } }) => {
            return res?.data?.url.includes(commit.firstElement);
          }
        );
        console.log(relatedCommit);
      }

        // const firstVersionContent = Buffer.from(
        //   firstVersion.data?.content,
        //   "base64"
        // ).toString();

        // let secondVersionContent = "";
        // if (commits[commentCount].secondElement) {
        //   const secondVersion: any = await octokit.rest.repos.getContent({
        //     owner,
        //     repo,
        //     path,
        //     ref: commits[commentCount].secondElement,
        //   });

        //   secondVersionContent = Buffer.from(
        //     secondVersion.data?.content,
        //     "base64"
        //   ).toString();
        // }

        // return {
        //   current: firstVersionContent,
        //   previous: secondVersionContent,
        //   commits: commits[commentCount],
        // };
        return
    }

    (async () => {
      setLoading(true);
      const uniqueCommits = getUniqueCommits(commits);
      const allCommitsRes = await getAllCommitsData(uniqueCommits);
      const allCommitsData = await getChangesData(commits, allCommitsRes);

      setCommitData(allCommitsData);
      setLoading(false);
    })().catch((e) => {
      // Deal with the fact the chain failed
    });
    
  }, [commentCount]);
  return (
    <div>
      {content.map((item: any, i: any) => {
        const commitDate = item.commits.committer.committer.date;
        const message = item.commits.committer.message;
        return (
          <div
            key={i}
            className="flex justify-center flex-col items-center text-center"
          >
            <div className="text-sm px-1 my-2 ">
              <p className=" font-bold">
                Commits on {format(new Date(commitDate), "MMM dd, yyyy")}
              </p>
              <p>{message}</p>
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
