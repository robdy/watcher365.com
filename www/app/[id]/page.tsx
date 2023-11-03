import React from "react";
import EntryTile from "@/components/EntryTile";
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

export async function generateStaticParams() {
  const { stdout } = await exec('ls ../data')
  let filesArr: string[] = stdout.split('\n')

  if (process.env.CODESPACES) {
    const lastCommitsOnly = await exec(`git log -n 5 --pretty=format:'' --name-only -- '../data/' | sort -u`)
    filesArr = lastCommitsOnly.stdout.split('\n')
  }

  return filesArr.map((file) => ({
    id: file.replace(/\.json$/, '').replace(/^data\//, ''),
  }))
}

const EntryPage = async ({ params }: {params: {id: string}}) => {
  const { id } = params
  const { stdout } = await exec(`git log --format=format:"%H;%cs" ../data/${id}.json`)
  const commitDataArr: string[] = stdout.split('\n');

  return (
    <section className="container max-w-5xl mx-auto pb-10">
      {commitDataArr.map((item: any) => {
        const [sha, date] = item.split(';')
        return (
          <React.Fragment key={item}>
            <h2 className="text-green-700 font-bold text-sm md:text-base pb-3 pt-10">
              {item === commitDataArr[0] ? `Changelog of ${id}` : date}
            </h2>
            <EntryTile entryID={id} commitSha={sha} />
          </React.Fragment>
        )
      }
      )}

    </section>
  );
};

export default EntryPage;
