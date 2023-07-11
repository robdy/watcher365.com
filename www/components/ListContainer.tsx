import React, { useEffect } from "react";
import { RecentData } from "@/types/RecentData";
import EntryTile from "./EntryTile";

interface Props {
  data: any;
}

const ListContainer: React.FC<Props> = ({ data }) => {

  // Group by https://stackoverflow.com/a/40774906/9902555
  const groupedData = data.reduce(function (r: any, a: RecentData) {
    const shortTimestamp: string = a.timestamp.substring(0, 10)
    r[shortTimestamp] = r[shortTimestamp] || [];
    r[shortTimestamp].push(a);
    return r;
  }, Object.create(null));

  return (
    <div className="mt-4">
      {Object.keys(groupedData).length > 0 ? (
        Object.keys(groupedData).map((item: any, i: number) => (
          <React.Fragment key={`fragment-${item}`}>
            <h2 className="text-green-700 font-bold text-sm md:text-base" key={`header-${item}`}>
              {item}
            </h2>
            <ul className="my-3 divide-y-2 text-sm md:text-base" key={`list-${item}`}>
              {groupedData[item].map((entry: any, j: number) => {
                // Filter out irrelevant changes
                // Changes to pubDate or updated are irrelevant
                // unless there are other changes in the same commit
                const isRelevant = (patch: string): boolean => {
                  const relevantData = patch.replaceAll(/[-+]\s*"(pubDate|updated)": .*/g, '');
                  return (/[-+]\s*"/g).test(relevantData);
                }
                const isEntryRelevant = isRelevant(entry.patch);
                return isEntryRelevant
                  ? <EntryTile entryID={entry.filePath} commitData={entry} date={item} />
                  : null
              })}
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
