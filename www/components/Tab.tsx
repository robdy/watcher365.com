import Link from "next/link";
import React from "react";

interface Props {
  filtered: string | null;
}

const Tab: React.FC<Props> = ({ filtered }) => {
  return (
    <div className="flex gap-2 items-center mt-5 text-sm ">
      <p>Filter </p>
      <ul className="flex gap-2 items-center ">
        <li
          className={`bg-white rounded-full border text-green-700 py-1 px-4 hover:bg-green-100 ${
            !filtered ? "active" : ""
          }`}
        >
          <Link href={"/"}>All</Link>
        </li>
        <li
          className={`bg-white rounded-full border text-green-700 py-1 px-4 hover:bg-green-100 ${
            filtered === "updated" ? "active" : ""
          }`}
        >
          <Link href={"/?filter=updated"}>Updated</Link>
        </li>
        <li
          className={`bg-white rounded-full border text-green-700 py-1 px-4 hover:bg-green-100 ${
            filtered === "pubDate" ? "active" : ""
          }`}
        >
          <Link href={"/?filter=pubDate"}>Published</Link>
        </li>
      </ul>
    </div>
  );
};

export default Tab;
