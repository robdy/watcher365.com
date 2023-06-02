"use client";

import Loading from "@/app/loading";

import React, { useState } from "react";
import File from "./File";

interface Props {
  path: string;
  totalComments: number;
  commentsShaArray: any;
}

const FileHistory: React.FC<Props> = ({ path, commentsShaArray }) => {
  const [showChange, setShowChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommitCount] = useState(0);

  const loadDetailsHandler = async () => {
    if (commentCount < 1) {
      setShowChange(true);
    }
    setCommitCount((num) => num + 1);
  };

  return (
    <section>
      {showChange && (
        <div>
          <h1 className="text-green-600 font-bold  mt-4">File History</h1>
          <File
            commits={commentsShaArray}
            path={path}
            commentCount={commentCount}
            setLoading={setLoading}
          />
        </div>
      )}

      {loading && <Loading />}

      <div className="flex justify-center  my-4 ">
        {commentsShaArray.length < commentCount + 2 ? null : (
          <button
            className="py-2 px-8 border text-sm border-green-600 font-bold text-green-600 rounded-md bg-white"
            onClick={loadDetailsHandler}
          >
            Load Details
          </button>
        )}
      </div>
    </section>
  );
};

export default FileHistory;
