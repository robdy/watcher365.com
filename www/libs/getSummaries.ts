import util from "node:util";
const exec = util.promisify(require("node:child_process").exec);

export const getSummaries = async (type: "weekly" | "daily") => {
  const { stdout } = await exec(`ls data/${type}`);
  const filesArr: string[] = stdout.split("\n");

  return filesArr.filter(file => file !== '').map((file) => ({
    id: file.replace(/\.json$/, ""),
  }));
};
