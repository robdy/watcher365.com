"use client";

import React from "react";
import DiffViewer from "./DiffViewer";
import useDeviceSize from "@/hook/useDevice";
interface Props {
  previous: any;
  current: any;
}

const DiffContainer: React.FC<Props> = ({ previous, current }) => {
  const [width] = useDeviceSize();

  return (
    <DiffViewer
      old={previous}
      new={current}
      split={width >= 768 ? true : false}
    />
  );
};

export default DiffContainer;
