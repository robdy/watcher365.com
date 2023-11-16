import React from "react";
import EntryTileVew from "./EntryTileView";
const fs = require('fs');

const EntryTile: any = async ({ entryID, version }: any) => {
  if (version.match(/v\d{4}\.json/) === null) return (<div>Invalid version</div>)
  // List files in data/versions/{entryID} folder
  const versionsFolderPath = `../data/versions/${entryID}`;
  
  const afterData = await fs.promises.readFile(`${versionsFolderPath}/${version}`);
  const afterObj = JSON.parse(afterData)

  const getBeforeVersion = (afterVersion: string) => {
    if (afterVersion === 'v0001.json') return ''
    const afterVersionNum: number = parseInt(afterVersion.replace(/^v/,'').replace(/\.json$/, ''))
    const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')
    return zeroPad(afterVersionNum - 1, 4)
  }
  const beforeVersion = getBeforeVersion(version);
  const beforeFile = `v${beforeVersion}.json`
  const beforeObj = beforeVersion === '' ? {
    category: [],
    title: '',
    description: ''
  } : JSON.parse(await fs.promises.readFile(`${versionsFolderPath}/${beforeFile}`));

  return (
    <EntryTileVew beforeObj={beforeObj} afterObj={afterObj} />
  )
};
export default EntryTile;
