import React from "react";
import EntryTileVew from "./EntryTileView";
import util from 'node:util';
const exec = util.promisify(require('node:child_process').exec);


const EntryTile: any = async ({ entryID, commitSha }: any) => {
  const entryFilePath = `data/${entryID}.json`;
  const { stdout } = await exec(`git log --format=format:%H ../${entryFilePath}`)
  const allCommitIDs: string[] = stdout.split('\n');
  // Get content from selected commit and before

  // If commit not provided, take the most recent one
  const afterCommit = commitSha || allCommitIDs[0];
  const afterIndex = allCommitIDs.findIndex(item => item === afterCommit);
  const { stdout: afterData } = await exec(`git show ${afterCommit}:${entryFilePath}`);
  const afterObj = JSON.parse(afterData)

  // If commitSha points to last commit, return -1
  const beforeIndex = afterIndex + 1 < allCommitIDs.length
    ? afterIndex + 1
    : -1
  let beforeObj: any
  if (beforeIndex === -1) {
    beforeObj = {
      category: [],
      title: '',
      description: ''
    }
  } else {
    const beforeCommit = allCommitIDs[beforeIndex];
    const { stdout: beforeData } = await exec(`git show ${beforeCommit}:${entryFilePath}`);
    beforeObj = JSON.parse(beforeData)
  }

  return (
    <EntryTileVew beforeObj={beforeObj} afterObj={afterObj} />
  )
};
export default EntryTile;
