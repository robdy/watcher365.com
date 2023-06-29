import React from "react";
import Link from "next/link";
const fs = require("fs");
import { IoIosArrowForward } from "react-icons/io";
import { FiFile } from "react-icons/fi";
import { repo, owner, octokit } from "@/config/octokit";
import * as Diff from "diff";
import { RoadmapEntry } from "@/types/RoadmapEntry";

const releaseStatusesList: string[] = [
  "Launched",
  "In development",
  "Rolling out",
];

const releasePhasesList: string[] = [
  "Preview",
  "General Availability",
  "Targeted Release",
  "Targeted Release (Entire Organization)",
  "Targeted Release (Select People)",
  "Limited Availability",
  "Semi-Annual Enterprise Channel",
  "Current Channel (Preview)",
  "Current Channel"
];

const cloudInstancesList: string[] = [
  "Worldwide (Standard Multi-Tenant)",
  "DoD",
  "GCC",
  "GCC High",
];

const platformsList: string[] = [
  "Android",
  "Desktop",
  "Developer",
  "Education",
  "iOS",
  "Linux",
  "Mac",
  "Mobile",
  "Teams and Surface Devices",
  "Web",
];

const productsList: string[] = [
  "Access",
  "Azure Active Directory",
  "Azure Information Protection",
  "Bookings",
  "Excel",
  "Exchange",
  "Forms",
  "Microsoft 365",
  "Microsoft 365 admin center",
  "Microsoft 365 app",
  "Microsoft 365 Defender",
  "Microsoft Defender for Cloud Apps",
  "Microsoft Defender for Endpoint",
  "Microsoft Defender for Identity",
  "Microsoft Defender for Office 365",
  "Microsoft Edge",
  "Microsoft Graph",
  "Microsoft Information Protection",
  "Microsoft Intune",
  "Microsoft Power Apps",
  "Microsoft Purview compliance portal",
  "Microsoft Search",
  "Microsoft Stream",
  "Microsoft Syntex",
  "Microsoft Teams",
  "Microsoft To Do",
  "Microsoft Viva",
  "Minecraft Education",
  "Office 365",
  "Office app",
  "OneDrive",
  "OneNote",
  "Outlook",
  "Planner",
  "Power Automate",
  "Power BI",
  "PowerPoint",
  "Project",
  "SharePoint",
  "SharePoint Syntex",
  "Universal Print",
  "Visio",
  "Whiteboard",
  "Windows",
  "Windows 365",
  "Word",
  "Yammer",
];

const tagList: string[] = releaseStatusesList.concat(
  releasePhasesList,
  cloudInstancesList,
  platformsList,
  productsList
);

const normalizeText = (text: string): string => {
  return text.replaceAll("\\n", " ")
    .replaceAll("<br>", " ")
    .replaceAll(/^,/g, "")
    .replaceAll('\"', '"')
}

const EntryTile: any = async (data: any) => {
  // To be commented until I figure out how to provide data folder for server
  // or during build time (SSG)
  // const localFileContent = fs.readFileSync(
  //   `../data/${data.entryID}.json`,
  //   "utf8",
  //   function (err: any, data: string) {
  //     if (err) throw err;
  //     return data;
  //   }
  // );
  // const localFileObj: any = localFileContent && JSON.parse(localFileContent);
  const remotePath = `data/${data.entryID}.json`;
  const remoteFileRes: any = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: remotePath,
  });
  const remoteFileContent = Buffer.from(
    remoteFileRes.data?.content,
    "base64"
  ).toString();
  const remoteFileObj: RoadmapEntry =
    remoteFileContent && JSON.parse(remoteFileContent);

  const getModifiedTags: any = (patch: any, tagList: string[]) => {
    let addedTags: string[] = [];
    let removedTags: string[] = [];
    const addedTagsRegex: RegExp = new RegExp(
      // https://stackoverflow.com/a/6969486/9902555
      `\\+ *"(${tagList.join("|").replaceAll(/[())]/g, "\\$&")})"`,
      // `\\+ *"(${tagList.join("|")})"`,
      "g"
    );
    const removedTagsRegex: RegExp = new RegExp(
      `- *"(${tagList.join("|").replaceAll(/[())]/g, "\\$&")})"`,
      "g"
    );
    const addedTagsMatches: any = [
      ...patch.matchAll(addedTagsRegex),
    ];
    const removedTagsMatches: any = [
      ...patch.matchAll(removedTagsRegex),
    ];

    if (addedTagsMatches.length > 0) {
      for (const match of addedTagsMatches) {
        addedTags.push(match[1]);
      }
    }
    if (removedTagsMatches.length > 0) {
      for (const match of removedTagsMatches) {
        removedTags.push(match[1]);
      }
    }
    return {
      added: addedTags,
      removed: removedTags,
    };
  };

  const modifiedTags = getModifiedTags(data.commitData.patch, tagList);

  const ColoredTags: any = ({ tagsList: tagsArray, modifiedTags }: any) => {
    let tagsElements: any = [];
    if (modifiedTags.removed) {
      tagsArray.push(...modifiedTags.removed);
    }
    for (let t = 0; t < tagsArray.length; t++) {
      let badgeClasses: string = "bg-gray-50 text-gray-600 ring-gray-500/10";
      const isAdded = modifiedTags.added.includes(tagsArray[t]);
      const isRemoved = modifiedTags.removed.includes(tagsArray[t]);
      if (isAdded && !isRemoved) {
        badgeClasses = "bg-green-50 text-green-700 ring-green-600/20";
      }
      if (isRemoved && !isAdded) {
        badgeClasses = "bg-red-50 text-red-700 ring-red-600/10";
      }
      tagsElements.push(
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset ${badgeClasses} mx-1 my-1`}
        >
          {tagsArray[t]}
        </span>
      );
    }
    return <React.Fragment>{tagsElements}</React.Fragment>;
  };

  const DiffedDate: any = ({
    propertyName,
  }: {
    propertyName: "publicDisclosureAvailabilityDate" | "publicPreviewDate";
  }) => {
    // If the property hasn't changed in last commit
    if (
      !data.commitData.patch.match(
        new RegExp(`-\\s*"${propertyName}":\\s*"(.+)`)
      )
    ) {
      return (
        <span className={`text-gray-600`}>{remoteFileObj[propertyName]}</span>
      );
    }
    // If there was a change, it'll be in commitData
    let diffedDateObject: any = [];
    let dateDiff = Diff.diffWords(data.commitData[propertyName], remoteFileObj[propertyName]);
    dateDiff.forEach((part) => {
      const color = part.added
        ? "green-700 bg-green-200"
        : part.removed
          ? "red-700 bg-red-200"
          : "gray-600";
      diffedDateObject.push(
        <span className={`text-${color}`}>{part.value}</span>
      );
    });
    return diffedDateObject;
  };

  const DiffedText: any = ({ type, }: { type: "title" | "description" }) => {
    let diffedTextObject: any = []
    const textDiff = Diff.diffWords(
      normalizeText(data.commitData[type])
      , normalizeText(remoteFileObj[type])
    )
    textDiff.forEach((part) => {
      const color = part.added
        ? "green-700 bg-green-200"
        : part.removed
          ? "red-700 bg-red-200"
          : "gray-600";
      diffedTextObject.push(
        <span className={`text-${color}`}>{part.value}</span>
      );
    });
    return diffedTextObject;
  };

  return (
    <Link href={data.entryID} className="w-full flex justify-between">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0" id={`${data.entryID}-containter`}>
        <div className="w-full max-w-3xl flex md:items-center">
          <span className="pr-2 py-1 text-xl">
            <IoIosArrowForward />
          </span>
          <span>
            <p className="hover:text-green-700 py-1 font-bold">
              <DiffedText type="title" />
              {data.commitData.status === "added" ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-1 py-1 ml-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  New
                </span>
              ) : null}
            </p>
            <DiffedText type="description" />
            <p>
              <span className="font-bold">Feature ID:</span>{" "}
              {remoteFileObj.guid}
            </p>
            <p>
              <span className="font-bold">Added to roadmap:</span>{" "}
              {new Date(Date.parse(remoteFileObj.pubDate)).toDateString()}
            </p>
            <p>
              <span className="font-bold">Last modified:</span>{" "}
              {new Date(remoteFileObj.updated).toDateString()}
            </p>
            <p>
              <span className="font-bold">Tags:</span>{" "}
              <ColoredTags
                tagsList={remoteFileObj.category}
                modifiedTags={modifiedTags}
              />
            </p>
            <p>
              <span className="font-bold">Preview Available:</span>{" "}
              {remoteFileObj.publicPreviewDate ? (
                <DiffedDate propertyName="publicPreviewDate" />
              ) : null}
            </p>
            <p>
              <span className="font-bold">Rollout Start:</span>{" "}
              {remoteFileObj.publicDisclosureAvailabilityDate ? (
                <DiffedDate propertyName="publicDisclosureAvailabilityDate" />
              ) : null}
            </p>
          </span>
        </div>
        <div className=" md:text-sm text-xs min-w-[100px] text-gray-600">
          <p className="flex items-center gap-1">
            <FiFile className="p-1 text-2xl" />
            {`${data.entryID}.json`}
          </p>
        </div>
      </div>
    </Link>
  );
};
export default EntryTile;
