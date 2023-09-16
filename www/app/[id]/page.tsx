import React from "react";
import EntryTile from "@/components/EntryTile";
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export async function generateStaticParams() {
  const { stdout, stderr } = await exec('ls ../data')
  console.error('stderr:', stderr)
  const filesArr: string[] = stdout.split('\n')

  return filesArr.map((file) => ({
    id: file.replace(/\.json$/, ''),
  }))
}

const EntryPage = async ({ params }: {params: {id: string}}) => {
  const { id } = params
  const { stdout } = await exec(`git log --format=format:%H ../data/${id}.json`)
  const commitList: string[] = stdout.split('\n');

  return (
    <section className="container max-w-5xl mx-auto">
      {commitList.map((item: any) => {
        return (
        <EntryTile entryID={id} commitSha={item} key={item} />
        )
      }
      )}

    </section>
  );
};

export default EntryPage;
