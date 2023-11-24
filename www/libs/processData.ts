import { Version } from '@/types/Version';

export const getLatestVersionFromVersions = (versions: Version[]): Version => {
  return versions.reduce((prev, curr) => {
    return parseInt(prev) > parseInt(curr) ? prev : curr;
  });
};
