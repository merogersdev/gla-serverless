/* ------------------------------------------------- */
/* --- --- --- Application Configuration --- --- --- */
/* ------------------------------------------------- */

export const config = {
  app: {
    appName: "GLAS",
    stageName: "Prod",
    subDomain: "glas",
  },
  ssm: {
    // Manual Add in both ca-central-1 and us-east-1
    domain: "/glas/domain",
    zoneId: "/glas/hostedzoneid",
    // Manual Add in ca-central-1
    githubToken: "/glas/github/token",
    githubAccount: "/glas/github/account",
    githubRepo: "/glas/github/repo",
  },
};
