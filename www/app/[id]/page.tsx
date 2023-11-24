import React from "react";
import EntryTile from "@/components/EntryTile";
import {  pullAllEntryIDs, pullAllVersionsFromEntryID } from "@/libs/pullData";

export async function generateStaticParams() {
  return await pullAllEntryIDs()
}

const EntryPage = async ({ params }: {params: {id: string}}) => {
  const { id } = params
  const versionsArr: string[] = await pullAllVersionsFromEntryID(id)

  return (
    <section className="container max-w-5xl mx-auto pb-10">
      {versionsArr.reverse().map((item: any) => {
        return (
          <React.Fragment key={item}>
            <h2 className="text-green-700 font-bold text-sm md:text-base pb-3 pt-10">
              {item === versionsArr[0] ? `Changelog of ${id}` : item}
            </h2>
            <EntryTile entryID={id} version={`v${item}.json`} />
          </React.Fragment>
        )
      }
      )}

    </section>
  );
};

export default EntryPage;
