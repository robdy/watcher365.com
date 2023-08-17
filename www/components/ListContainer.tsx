import React, { useEffect } from "react";
import { RecentData } from "@/types/RecentData";
import EntryTile from "./EntryTile";
import { repo, owner, octokit } from "@/config/octokit";
import { OctokitResponse } from "@octokit/types"

interface Props {
  commitList: string[];
}

const ListContainer = async ({ commitList } : {commitList: string[]}) => {
  const getCommitData = async (sha: string) => await octokit.rest.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: sha,
  });

  let commitsData: any = [];
  for (let i = 0; i < commitList.length; i++) {
    const commitData = await getCommitData(commitList[i])
    commitsData = commitsData.concat(commitData)
  }

  let filesData: any = [];
  for (let i = 0; i < commitsData.length; i++) {
    const commitFiles : any = commitsData[i].data.files
    const commitData = commitsData[i].data
    const commitFilesData = commitFiles.map((commitFile: { filename: string; status: string; patch: string; }) => (
      {
        commitSha: commitData.sha,
        date: commitData.commit.author.date.substring(0, 10),
        entryID: commitFile.filename.replace(/^data\/|.json$/g, ''),
        status: commitFile.status,
        patch: commitFile.patch
      }
      ))
    filesData = filesData.concat(commitFilesData);
  }

  // Filter out irrelevant changes
  // Changes to pubDate or updated are irrelevant
  // unless there are other changes in the same commit
  const isRelevant = (patch: string): boolean => {
    const relevantData = patch.replaceAll(/[-+]\s*"(pubDate|updated)": .*/g, '');
    return (/[-+]\s*"/g).test(relevantData);
  }
  const relevantFilesData = filesData.filter((fileData: { patch: string; }) => isRelevant(fileData.patch))

  // Group by https://stackoverflow.com/a/40774906/9902555
  const groupedData = relevantFilesData.reduce(function (r: any, a: any) {
    const shortTimestamp: string = a.date.substring(0, 10)
    r[shortTimestamp] = r[shortTimestamp] || [];
    r[shortTimestamp].push(a);
    return r;
  }, Object.create(null));

  return (
    <div className="mt-4">
    </div>
  );
};

export default ListContainer;
