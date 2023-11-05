import { repo, owner, octokit } from "@/config/octokit";
import ListContainer from "@/components/ListContainer";
import Link from "next/link";

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
  // Workaround from Next.JS GitHub
  // https://github.com/vercel/next.js/issues/42292#issuecomment-1464048350
  const listContainer: JSX.Element = await ListContainer({ commitList })

  return (
    <section className="container max-w-5xl mx-auto ">
      <div className="my-10 flex justify-center">
        <Link className={`font-bold py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700`} href="/weekly">Weekly summaries</Link>
      </div>
      <div className="my-10">
        {listContainer}
      </div>
    </section>
  );
};
export default Home;
