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
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    const makeReq = async () => {
      setLoading(true);
      const firstVersion: any = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: commits[commentCount].firstElement,
      });

      const firstVersionContent = Buffer.from(
        firstVersion.data?.content,
        "base64"
      ).toString();

      let secondVersionContent = "";
      if (commits[commentCount].secondElement) {
        const secondVersion: any = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: commits[commentCount].secondElement,
        });

        secondVersionContent = Buffer.from(
          secondVersion.data?.content,
          "base64"
        ).toString();
      }

      return {
        current: firstVersionContent,
        previous: secondVersionContent,
        commits: commits[commentCount],
      };
    };
    const fetchData = async () => {
      const data = await makeReq();
      setContent([...content, data]);
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
