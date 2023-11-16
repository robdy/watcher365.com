import React from "react";
import EntryTile from "@/components/EntryTile";
const fs = require('fs'); 
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export async function generateStaticParams() {
  const { stdout } = await exec('find ../data/versions/ -mindepth 1 -type d')
  let filesArr: string[] = stdout.split('\n')

  return filesArr.map((file) => ({
    id: file.split('/')[3]
  }))
}

const EntryPage = async ({ params }: {params: {id: string}}) => {
  const { id } = params
  const versionsArr: string[] = await fs.promises.readdir(`../data/versions/${id}`);

  return (
    <section className="container max-w-5xl mx-auto pb-10">
      {versionsArr.reverse().map((item: any) => {
        return (
          <React.Fragment key={item}>
            <h2 className="text-green-700 font-bold text-sm md:text-base pb-3 pt-10">
              {item === versionsArr[0] ? `Changelog of ${id}` : item}
            </h2>
            <EntryTile entryID={id} version={item} />
          </React.Fragment>
        )
      }
      )}

    </section>
  );
};

export default EntryPage;
