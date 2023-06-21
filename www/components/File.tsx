"use client";
import React, { useEffect, useState } from "react";
import { repo, owner, octokit } from "@/config/octokit";
import DiffContainer from "./DiffContainer";
import { FaBeer } from "react-icons/fa";
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

  const getCommitData = async (commitRef: any) => {
    // Do not send a request if the data exists
    if (commitData[commitRef]) {
      console.log(`Cache found for ${commitRef}`)
      console.log(commitData);
      return Promise.resolve(commitData[commitRef]);
    }
    console.log(`Cache NOT found for ${commitRef}`);

    const commitRes: any = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: commitRef,
    });
    setCommitData({
      ...commitData,
      [commitRef]: commitRes
    })
    console.log(commitData)
    return Promise.resolve(commitRes);
  };

  useEffect(() => {
    const makeReq = async (commit: any) => {
      setLoading(true);
      const firstVersion: any = await getCommitData(commit.firstElement);

      const firstVersionContent = Buffer.from(
        firstVersion.data?.content,
        "base64"
      ).toString();

      let secondVersionContent = "";
      if (commit.secondElement) {
        const secondVersion: any = await getCommitData(commit.secondElement);

        secondVersionContent = Buffer.from(
          secondVersion.data?.content,
          "base64"
        ).toString();
      }

      return {
        current: firstVersionContent,
        previous: secondVersionContent,
        commits: commit,
      };
    };
    const fetchData = async () => {
      for (const commit of commits) {
        const data = await makeReq(commit);
        setContent((content: any) => {
          return [...content, data];
        });
      }
      setLoading(false);
    };
    fetchData();
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
