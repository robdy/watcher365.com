const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const fs = require("fs");
import { Version } from "../types/Version";
import { repo, owner, octokit } from "@/config/octokit";

type EntryID = string;

export const pullAllEntryIDs = async (): Promise<EntryID[]> => {
  const { stdout } = await exec("find ../data/versions/ -mindepth 1 -type d");
  let foldersArr: string[] = stdout.split("\n");
  // Remove last empty item
  foldersArr.pop();
  return foldersArr
    .map((folder) => folder.split("/").pop() as string);
};

export const pullAllVersionsFromEntryID = async (
  entryID: EntryID
): Promise<Version[]> => {
  const allVersionFiles = await fs.promises.readdir(
    `../data/versions/${entryID}`
  );
  return allVersionFiles.map((file: string) => file.split(".")[0].slice(1));
};

export const pullAllSummaries = async (type: "weekly" | "daily") => {
  const { stdout } = await exec(`ls data/${type}`);
  const filesArr: string[] = stdout.split("\n");

  return filesArr
    .filter((file) => file !== "")
    .map((file) => ({
      id: file.replace(/\.json$/, ""),
    }));
};

export const pullSummaryData = async (type: "weekly" | "daily", id: string) => {
  const data = await fs.promises.readFile(`data/${type}/${id}.json`, 'utf-8')
  return JSON.parse(data);
}

export const pullLatestNChanges = async (n: number) => {
  // gat all commits from repo
  const response = await octokit.rest.repos.listCommits({
    owner,
    repo,
    path: "data/versions",
  });

  let commitList: any = [];
  for (const commit of response.data.slice(0, n)) {
    commitList = commitList.concat(commit.sha);
  }
  return { commitList };
}
