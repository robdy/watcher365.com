import ListContainer from "@/components/ListContainer";
import Search from "@/components/Search";
import { pullLatestNChanges } from "@/libs/pullData";

export const revalidate = 3600 / 6;

// Fetch data from GitHub
const getData = async (
): Promise<
  { commitList: any } | undefined
> => {
  try {
    return pullLatestNChanges(1);
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
      <Search />
      <div className="my-10">
        {listContainer}
      </div>
    </section>
  );
};
export default Home;
