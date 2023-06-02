import { Octokit } from "octokit";
export const owner = process.env.GITHUB_USER as string;
export const repo = process.env.GITHUB_REPO as string;
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
