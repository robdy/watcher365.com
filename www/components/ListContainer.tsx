import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FiFile } from "react-icons/fi";
import { RecentData } from "@/types/RecentData";

interface Props {
  data: any;
}

const ListContainer: React.FC<Props> = ({ data }) => {

  // Group by https://stackoverflow.com/a/40774906/9902555
  const groupedData = data.reduce(function (r: any, a: RecentData) {
    const shortTimestamp : string = a.timestamp.substring(0,10)
    r[shortTimestamp] = r[shortTimestamp] || [];
    r[shortTimestamp].push(a);
    return r;
    }, Object.create(null));
  return (
    <div className="mt-4">
      {Object.keys(groupedData).length > 0 ? (
        Object.keys(groupedData).map((item: any, i: number) => (
          <React.Fragment>
            <h2 className="text-green-700 font-bold text-sm md:text-base">
              {item}
            </h2>
            <ul className="my-3 divide-y-2 text-sm md:text-base">
              {groupedData[item].map((entry: any, j: number) => (
                  <li className="flex  py-2 px-4 bg-white" key={`i-j`}>
                    <Link
                      href={entry.filePath}
                      className="w-full flex justify-between"
                    >
                      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                        <div className="w-full max-w-3xl flex md:items-center">
                          <span className="pr-2 py-1 text-xl">
                            <IoIosArrowForward />
                          </span>
                          <p className="hover:text-green-700 py-1">{entry.title}</p>
                        </div>
                        <div className=" md:text-sm text-xs min-w-[100px] text-gray-600">
                          <p className="flex items-center gap-1">
                            <FiFile className="p-1 text-2xl" />
                            {entry.fileName}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </React.Fragment>
        ))
      ) : (
        <li className="flex p-2 bg-white mb-3">No changes found</li>
      )}
    </div>
  );
};

export default ListContainer;
