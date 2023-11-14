import React from "react";
import { repo, owner, octokit } from "@/config/octokit";
import EntryTile from "@/components/EntryTile";

interface Props {
  commitList: string[];
}

const ListContainer = async ({ commitList } : {commitList: string[]}) => {
  const getCommitData = async (sha: string) => await octokit.rest.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: sha,
  });

  let commitsData: any = [];
  for (let i = 0; i < commitList.length; i++) {
    const commitData = await getCommitData(commitList[i])
    commitsData = commitsData.concat(commitData)
  }

  let filesData: any = [];
  for (let i = 0; i < commitsData.length; i++) {
    const commitFiles : any = commitsData[i].data.files
    const commitData = commitsData[i].data
    const commitVersionFiles = commitFiles.filter((commitFile: { filename: string; }) => commitFile.filename.match(/^data\/versions\/.*\.json$/g))
    const commitFilesData = commitVersionFiles.map((commitFile: { filename: string }) => (
      {
        date: commitData.commit.author.date,
        version: commitFile.filename.split('/')[3],
        entryID: commitFile.filename.split('/')[2]}
      ))
    filesData = filesData.concat(commitFilesData);
  }

  // Group by https://stackoverflow.com/a/40774906/9902555
  const groupedData = filesData.reduce(function (r: any, a: any) {
    const shortTimestamp: string = a.date.substring(0, 10)
    r[shortTimestamp] = r[shortTimestamp] || [];
    r[shortTimestamp].push(a);
    return r;
  }, Object.create(null));

  return (
    <div className="mt-4">
      {Object.keys(groupedData).map((item: any) => (
      <React.Fragment key={`fragment-${item}`}>
        <h2 className="text-green-700 font-bold text-sm md:text-base" key={`header-${item}`}>
          {item}
        </h2>
        <ul className="my-3 divide-y-2 text-sm md:text-base" key={`list-${item}`}>
          {groupedData[item].map((entry: any) => {
            return (
              <EntryTile entryID={entry.entryID} version={entry.version} key={`tile-${entry.entryID}-${entry.version}`}/>
            )
          })}
        </ul>
      </React.Fragment>
      ))}
    </div>
  );
};

export default ListContainer;
