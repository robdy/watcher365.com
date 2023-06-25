import React from "react";
import Link from "next/link";
const fs = require("fs");
import { IoIosArrowForward } from "react-icons/io";
import { FiFile } from "react-icons/fi";

const EntryTile: any = (data: any) => {
  const localFileContent = fs.readFileSync(
    `../data/${data.entryID}.json`,
    "utf8",
    function (err: any, data: string) {
      if (err) throw err;
      return data;
    }
  );
  const localFileObj: any = localFileContent && JSON.parse(localFileContent);
  return (
    <Link href={data.entryID} className="w-full flex justify-between">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
        <div className="w-full max-w-3xl flex md:items-center">
          <span className="pr-2 py-1 text-xl">
            <IoIosArrowForward />
          </span>
          <span>
            <p className="hover:text-green-700 py-1 font-bold">
              {localFileObj.title}
              {data.commitData.status === "added" ? (
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 ml-2 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  New
                </span>
              ) : null}
            </p>
            <p className="py-">{localFileObj.description}</p>
            <p>
              <span className="font-bold">Feature ID:</span> {localFileObj.guid}
            </p>
            <p>
              <span className="font-bold">Added to roadmap:</span>{" "}
              {localFileObj.pubDate}
            </p>
            <p>
              <span className="font-bold">Last modified:</span>{" "}
              {localFileObj.updated}
            </p>
            <p>
              <span className="font-bold">Tags:</span>{" "}
              {localFileObj.category.join(", ")}
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
