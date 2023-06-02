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

    // filtered today changes file from all commits
    const todayChangedFiles = getChangeFiles(response.data, today);
    // filtered yesterday changes file from all commits
    const yesterdayChangedFiles = getChangeFiles(response.data, yesterday);

    // get today commit data
    if (todayChangedFiles.length > 0) {
      const latestCommitSHA = todayChangedFiles[0].sha;
      const commitResponse = await octokit.rest.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: latestCommitSHA,
      });
      // get today necessary data for show list
      todayData = getLastChangeFile(commitResponse.data, paramsFilter);
    }

    // get yesterday commit data
    if (yesterdayChangedFiles.length > 0) {
      const latestCommitSHA = yesterdayChangedFiles[0].sha;
      const commitResponse: any = await octokit.rest.repos.getCommit({
        owner: owner,
        repo: repo,
        ref: latestCommitSHA,
      });

      // get yesterday necessary data for show list
      yesterdayData = getLastChangeFile(commitResponse.data, paramsFilter);
    }
    return { todayData, yesterdayData };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const Home = async ({ searchParams }: { searchParams: { filter: string } }) => {
  const { todayData, yesterdayData }: any = await getData(searchParams.filter);
  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10 ">
        {/* filter Buttons  */}
        <Tab filtered={searchParams.filter} />
        {/* showing today changes  */}
        <ListContainer title="Today" data={todayData} />
        {/* showing yesterday changes  */}
        <ListContainer title="Yesterday" data={yesterdayData} />
      </div>
    </section>
  );
};
export default Home;
