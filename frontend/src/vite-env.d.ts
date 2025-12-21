/// <reference types="vite/client" />

declare global {
  const __BUILD_INFO__: {
    buildAt: string;
    gitSha: string | null;
    gitRef: string | null;
    gitRepo: string | null;
    gitOwner: string | null;
    gitCommitMessage: string | null;
    gitCommitAuthor: string | null;
    gitPullRequestId: string | null;
    gitPullRequestTitle: string | null;
    vercelEnv: string | null;
    vercelRegion: string | null;
    vercelUrl: string | null;
    deploymentId: string | null;
    projectId: string | null;
  };
}

export {};
