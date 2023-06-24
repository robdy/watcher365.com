import { Octokit } from "octokit";
export const owner = 'robdy';
export const repo = 'watcher365.com';
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
