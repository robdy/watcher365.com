"use client";

import React, { PureComponent } from "react";
import ReactDiffViewer from "react-diff-viewer";

interface DiffViewerProps {
  old: string;
  new: string;
  split: boolean;
}

class DiffViewer extends PureComponent<DiffViewerProps> {
  render = () => {
    return (
      <div className="text-xs md:text-sm overflow-auto rounded-md border ">
        <ReactDiffViewer
          oldValue={this.props.old}
          newValue={this.props.new}
          splitView={this.props.split}
          leftTitle={this.props.split ? "Previous" : ""}
          rightTitle={"Current"}
          extraLinesSurroundingDiff={5}
          hideLineNumbers={!this.props.split}
        />
      </div>
    );
  };
}
export default DiffViewer;
