import React from "react";
import Link from "next/link";
const fs = require("fs");
import { IoIosArrowForward } from "react-icons/io";
import { FiFile } from "react-icons/fi";
import { repo, owner, octokit } from "@/config/octokit";

interface RoadmapEntry {
  guid: number;
  link: string;
  category: Array<string>;
  title: string;
  description: string;
  pubDate: string;
  updated: string;
  publicDisclosureAvailabilityDate: string;
  publicPreviewDate: string;
}

const releaseStatusesList: string[] = [
  "Launched",
  "In development",
  "Rolling out",
];

const releasePhasesList: string[] = [
  "General Availability",
  "Preview",
];

const cloudInstancesList: string[] = ["Worldwide (Standard Multi-Tenant)"];

const platformsList: string[] = ["Web"];

const tagList: string[] = releaseStatusesList.concat(
  releasePhasesList,
  cloudInstancesList,
  platformsList
);

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
      `\\+ *"(${tagList.join("|")})"`,
      "g"
    );
    const removedTagsRegex: RegExp = new RegExp(
      `- *"(${tagList.join("|")})"`,
      "g"
    );
    const addedTagsMatches: any = [
      ...patch.matchAll(addedTagsRegex),
    ];
    const removedTagsMatches: any = [
      ...data.commitData.patch.matchAll(removedTagsRegex),
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
    let tagsString: any = [];
    for (let t = 0; t < tagsArray.length; t++) {
      let badgeClasses: string = "bg-gray-50 text-gray-600 ring-gray-500/10";
      if (modifiedTags.added.includes(tagsArray[t])) {
        badgeClasses = "bg-green-50 text-green-700 ring-green-600/20";
      }
      if (modifiedTags.removed.includes(tagsArray[t])) {
        badgeClasses = "bg-red-50 text-red-700 ring-red-600/10";
      }
      tagsString.push(
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset ${badgeClasses} mx-1`}
        >
          {tagsArray[t]}
        </span>
      );
    }
    return <React.Fragment>{tagsString}</React.Fragment>;
  };

  return (
    <Link href={data.entryID} className="w-full flex justify-between">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <div className="w-full max-w-3xl flex md:items-center">
          <span className="pr-2 py-1 text-xl">
            <IoIosArrowForward />
          </span>
          <span>
            <p className="hover:text-green-700 py-1 font-bold">
              {remoteFileObj.title}
              {data.commitData.status === "added" ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-1 py-1 ml-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  New
                </span>
              ) : null}
            </p>
            <p className="py-">{data.commitData.description}</p>
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
              <ColoredTags tagsList={remoteFileObj.category} modifiedTags={modifiedTags} />
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
