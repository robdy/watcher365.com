import { Octokit } from "octokit";
export const owner = 'robdy';
export const repo = 'm365roadmap-history';
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});
