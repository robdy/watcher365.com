import React from "react";
import { repo, owner, octokit } from "@/config/octokit";

const EntryTile2: any = async ({ entryID, commitSha }: any) => {
  const entryFilePath = `data/${entryID}.json`;
  const allCommits = await octokit.rest.repos.listCommits({
    owner,
    repo,
    path: entryFilePath,
  });
  const allCommitIDs = allCommits.data.map(item => item.sha)
  // Get content from selected commit and before

  // If commit not provided, take the most recent one
  const afterCommit = commitSha || allCommits.data[0].sha;
  const afterIndex = allCommitIDs.findIndex(item => item === afterCommit);
  const afterData = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: entryFilePath,
    ref: afterCommit
  })
  // If commitSha points to last commit, return -1
  const beforeIndex = afterIndex + 1 < allCommitIDs.length
    ? afterIndex + 1
    : -1
  const beforeCommit = allCommitIDs[beforeIndex];
  const beforeData = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: entryFilePath,
    ref: beforeCommit
  })

  console.log(beforeData)
  
  return (
    <div>{entryID}</div>
  )
};
export default EntryTile2;
