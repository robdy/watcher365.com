const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const fs = require("fs");

type EntryID = string;
type Version = string;

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
