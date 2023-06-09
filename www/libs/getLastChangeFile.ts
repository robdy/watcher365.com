import { RecentData } from "@/types/RecentData";

export const getLastChangeFile = (responseData: any, paramsFilter: any) => {
  let changeData = [] as RecentData[];
  const responseDataFiles = responseData.files?.filter((file: any) => {
    const fileName = file.filename as string;
    return fileName.startsWith('data');
  })
  responseDataFiles.map((file: any) => {
    const titleRegex = /"title":\s*"([^"]+)"/;
    const match = file?.patch?.match(titleRegex);
    const title = match ? match[1] : "";
    const patchLines = file?.patch?.split("\n");
    const fileName = file.filename as string;
    const fileExt = fileName.split("/");
    const path = fileExt[1].split(".");

    if (paramsFilter && paramsFilter != "all") {
      for (const line of patchLines) {
        if (line.startsWith(`-  "${paramsFilter}":`)) {
          changeData.push({
            title,
            fileName: file.filename.split("/")[1],
            filePath: path[0],
            filter: paramsFilter,
            timestamp: responseData.commit.author.date,
          });
        }
      }
    } else {
      changeData.push({
        title,
        fileName: file.filename.split("/")[1],
        filePath: path[0],
        filter: "all",
        timestamp: responseData.commit.author.date,
      });
    }
  });
  return changeData as RecentData[];
};
