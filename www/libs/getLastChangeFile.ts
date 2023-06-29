import { RecentData } from "@/types/RecentData";

export const getLastChangeFile = (responseData: any, paramsFilter: any) => {
  let changeData = [] as RecentData[];
  responseData.files?.map((file: any) => {
    const match = file?.patch?.match(/"title":\s*"([^"]+)"/);
    const title: string = match ? match[1] : "";
    const description: string = file?.patch?.match(/"description":\s*"(.+)",/)[1] || ""
    const publicDisclosureAvailabilityDateMatch: string = file?.patch?.match(
      /"publicDisclosureAvailabilityDate":\s*"(.+)",/
    );
    const publicDisclosureAvailabilityDate: string =
      publicDisclosureAvailabilityDateMatch ? publicDisclosureAvailabilityDateMatch[1] : "";
    const publicPreviewDateMatch: string =
      file?.patch?.match(/"publicPreviewDate":\s*"(.+)",/);
    const publicPreviewDate: string = publicPreviewDateMatch
      ? publicPreviewDateMatch[1]
      : "";
    const patch = file?.patch as string;
    const patchLines = file?.patch?.split("\n");
    const status = file?.status as string;
    const fileName = file.filename as string;
    const fileExt = fileName.split("/");
    const path = fileExt[1].split(".");

    if (paramsFilter && paramsFilter != "all") {
      for (const line of patchLines) {
        if (line.startsWith(`-  "${paramsFilter}":`)) {
          changeData.push({
            title,
            description,
            publicDisclosureAvailabilityDate,
            publicPreviewDate,
            patch,
            status,
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
        description,
        publicDisclosureAvailabilityDate,
        publicPreviewDate,
        patch,
        status,
        fileName: file.filename.split("/")[1],
        filePath: path[0],
        filter: "all",
        timestamp: responseData.commit.author.date,
      });
    }
  });
  return changeData as RecentData[];
};
