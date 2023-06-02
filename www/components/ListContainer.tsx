import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FiFile } from "react-icons/fi";

interface Props {
  data: any;
  title: string;
}

const ListContainer: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="mt-4">
      <h2 className="text-green-700 font-bold  text-sm md:text-base  ">
        {title}
      </h2>
      <ul className="my-3 divide-y-2 text-sm md:text-base">
        {data.length > 0 ? (
          data.map((item: any, i: number) => (
            <li className="flex  py-2 px-4 bg-white" key={i}>
              <Link
                href={item.filePath}
                className="w-full flex justify-between  "
              >
                <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                  <div className="w-full max-w-3xl flex md:items-center">
                    <span className="pr-2 py-1 text-xl">
                      <IoIosArrowForward />
                    </span>
                    <p className="hover:text-green-700 py-1">{item.title}</p>
                  </div>
                  <div className=" md:text-sm text-xs min-w-[100px] text-gray-600">
                    <p className="flex items-center gap-1">
                      <FiFile className="p-1 text-2xl" />
                      {item.fileName}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="flex  p-2 bg-white mb-3">No changed found</li>
        )}
      </ul>
    </div>
  );
};

export default ListContainer;
