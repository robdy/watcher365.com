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
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <section>
      {showHistory && (
        <div>
          <h1 className="text-green-600 font-bold  mt-4">File History</h1>
          <File
            commits={commentsShaArray}
            path={path}
            setLoading={setLoading}
          />
        </div>
      )}

      {loading && <Loading />}

      <div className="flex justify-center  my-4 ">
        {commentsShaArray.length > 1 && !showHistory ? (
          <button
            className="py-2 px-8 border text-sm border-green-600 font-bold text-green-600 rounded-md bg-white"
            onClick={() => setShowHistory(true)}
          >
            Load entry history
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default FileHistory;
