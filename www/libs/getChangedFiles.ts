export const getChangeFiles = (data: any, date: any) => {
  const changedFiles = data.filter((item: any) => {
    const commitDate = item.commit.author?.date as any;
    const todayFiles = new Date(commitDate)
      .toISOString()
      .split("T")[0]
      .toString();

    return date === todayFiles;
  });
  return changedFiles;
};
