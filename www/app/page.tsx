import { repo, owner, octokit } from "@/config/octokit";
import { RecentData } from "@/types/RecentData";
import ListContainer from "@/components/ListContainer";
import { getLastChangeFile } from "@/libs/getLastChangeFile";
import Tab from "@/components/Tab";
var fs = require("fs");

export const revalidate = 3600 / 6;

// Fetch data from github
const getData = async (
  paramsFilter?: string
): Promise<
  { commitData: RecentData[] } | undefined
> => {
  try {
    // gat all commits from repo
    const response = await octokit.rest.repos.listCommits({ 
      owner, 
      repo,
      path: "data",
    });

    let commitData = [] as RecentData[];
    for (const commit of response.data.slice(0,5)) {
      const latestCommitSHA = commit.sha;
      const commitResponse = await octokit.rest.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: latestCommitSHA,
      });
      commitData = commitData.concat(getLastChangeFile(commitResponse.data, paramsFilter));
      
      // Get entries data from local files
      for (const file of commitResponse.data.files) {
        console.log(file.filename)
        fs.readFile(
          `../file.filename`,
          "utf8",
          function (err: any, data: string) {
            if (err) throw err;
            // console.log(data);
          }
        );
      }

    }


    return { commitData };
  } catch (error: any) {
    throw new Error(error.message);
  }
  
};

const Home = async ({ searchParams }: { searchParams: { filter: string } }) => {
  const { commitData }: any = await getData(searchParams.filter);
  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10 ">
        {/* filter Buttons  */}
        {/* <Tab filtered={searchParams.filter} /> */}
        <ListContainer data={commitData} />
      </div>
    </section>
  );
};
export default Home;
