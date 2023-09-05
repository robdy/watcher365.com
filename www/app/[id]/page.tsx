import React from "react";
import { repo, owner, octokit } from "@/config/octokit";
import EntryTile from "@/components/EntryTile";
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('git show 76522f74563225fbc8df53ec137d349ffdc55457:data/131169.json');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}



const EntryPage = async ({params}: {params: {id: string}}) => {

  lsExample();
  const commitList = await octokit.rest.repos.listCommits({
    owner,
    repo,
    path: `data/${params.id}.json`,
  });

  return (
    <section className="container max-w-5xl mx-auto">
      {commitList.data.map((item: any) => {
        console.log(item.sha)
        return (
        <EntryTile entryID={params.id} commitSha={item.sha} key={item.sha} />
        )
      }
      )}

    </section>
  );
};

export default EntryPage;
