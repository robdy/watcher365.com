import { repo, owner, octokit } from "@/config/octokit";
import { RecentData } from "@/types/RecentData";
import { getChangeFiles } from "@/libs/getChangedFiles";
import ListContainer from "@/components/ListContainer";
import { getLastChangeFile } from "@/libs/getLastChangeFile";
import Tab from "@/components/Tab";

export const revalidate = 3600 / 6;

// Fetch data from github
const getData = async (
  paramsFilter?: string
): Promise<
  { todayData: RecentData[]; yesterdayData: RecentData[] } | undefined
> => {
  try {
    let todayData = [] as RecentData[];
    let yesterdayData = [] as RecentData[];
    // Today date
    const today = new Date().toISOString().split("T")[0].toString();
    // Yesterday date
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0]
      .toString();
    // gat all commits from repo
    const response = await octokit.rest.repos.listCommits({ owner, repo });

    let commitData = [] as RecentData[];
    for (const commit of response.data.slice(0,5)) {
      const latestCommitSHA = commit.sha;
      const commitResponse = await octokit.rest.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: latestCommitSHA,
      });
      commitData = commitData.concat(getLastChangeFile(commitResponse.data, paramsFilter));
    }

    return { todayData: commitData };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const Home = async ({ searchParams }: { searchParams: { filter: string } }) => {
  const { todayData }: any = await getData(searchParams.filter);
  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10 ">
        {/* filter Buttons  */}
        <Tab filtered={searchParams.filter} />
        {/* showing today changes  */}
        <ListContainer title="Today" data={todayData} />
      </div>
    </section>
  );
};
export default Home;
