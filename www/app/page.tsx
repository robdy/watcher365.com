import { repo, owner, octokit } from "@/config/octokit";
import { RecentData } from "@/types/RecentData";
import ListContainer from "@/components/ListContainer";
import { getLastChangeFile } from "@/libs/getLastChangeFile";
var fs = require("fs");

export const revalidate = 3600 / 6;

// Fetch data from GitHub
const getData = async (
): Promise<
  { commitList: any } | undefined
> => {
  try {
    // gat all commits from repo
    const response = await octokit.rest.repos.listCommits({ 
      owner, 
      repo,
      path: "data",
    });

    let commitList : any = [];
    for (const commit of response.data.slice(0, 5)) {
      commitList = commitList.concat(commit.sha)
    }
    return { commitList };
  } catch (error: any) {
    throw new Error(error.message);
  }
  
};

const Home = async () => {
  const { commitList }: any = await getData();
  console.log(commitList)
  // Workaround from Next.JS GitHub
  // https://github.com/vercel/next.js/issues/42292#issuecomment-1464048350
  const listContainer: JSX.Element = await ListContainer({data: commitList})
  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10 ">
        {listContainer}
      </div>
    </section>
  );
};
export default Home;
