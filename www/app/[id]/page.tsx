import React from "react";
import { repo, owner, octokit } from "@/config/octokit";
import DiffContainer from "@/components/DiffContainer";
import ContentCard from "@/components/ContentCard";
import FileHistory from "@/components/FileHistory";

const getDateByFileName = async (filePath: string) => {
  try {
    // get all commit sha specific file
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      path: filePath,
    });

    const resData = response.data;
    const shasArray = [] as any;

    // create array commit sha for comparison previous and current
    resData.forEach((item: any, index: number) => {
      const firstElement = resData[index].sha;
      const secondElement =
        index < resData.length - 1 ? resData[index + 1].sha : undefined;
      shasArray.push({
        firstElement,
        secondElement,
        author: item.author,
        committer: item.commit,
      });
    });

    const currentVersionSha = response.data[0]?.sha;
    const previousVersionSha = response.data[1]?.sha;

    // get file content by comment reference
    const currentVersionFileResponse: any = await octokit.rest.repos.getContent(
      {
        owner,
        repo,
        path: filePath,
        ref: currentVersionSha,
      }
    );

    // convert it as string
    const currentVersionFileContent = Buffer.from(
      currentVersionFileResponse.data?.content,
      "base64"
    ).toString();
    let previousVersionsFileContent = "";
    if (previousVersionSha) {
      // get file content by comment reference
      const previousVersionsFileResponse: any =
        await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: previousVersionSha,
        });
      // convert it as string
      previousVersionsFileContent = Buffer.from(
        previousVersionsFileResponse.data?.content,
        "base64"
      ).toString();
    }
    return {
      currentVersionFileContent,
      previousVersionsFileContent,
      totalComments: response.data.length,
      commentsShaArray: shasArray,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const FileChange = async ({
  params,
}: {
  params: { data: string; id: string };
}) => {
  const path = `data/${params.id}.json`;
  const {
    currentVersionFileContent,
    previousVersionsFileContent,
    totalComments,
    commentsShaArray,
  }: any = await getDateByFileName(path);
  const {
    title,
    description,
    updated,
    category,
    publicDisclosureAvailabilityDate,
    publicPreviewDate,
  } = JSON.parse(currentVersionFileContent);

  return (
    <section className="container max-w-5xl mx-auto   ">
      <div className="  mt-5 mb-2 rounded   text-sm md:text-base">
        {/* showing content card */}
        <ContentCard
          category={category}
          description={description}
          title={title}
          updateDate={updated}
          publicDisclosureAvailabilityDate={publicDisclosureAvailabilityDate}
          publicPreviewDate={publicPreviewDate}
        />
      </div>
      {/* Compare previous and  content */}

      <DiffContainer
        current={currentVersionFileContent}
        previous={previousVersionsFileContent}
      />

      {/* file history */}
      <FileHistory
        path={path}
        totalComments={totalComments}
        commentsShaArray={commentsShaArray}
      />
    </section>
  );
};

export default FileChange;
