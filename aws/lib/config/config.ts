import * as dotenv from "dotenv";
import path = require("path");

// 1. Configure dotenv to read from our `.env` file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export type ConfigProps = {
  DOMAIN: string;
  SUBDOMAIN: string;
  ZONE_ID: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GITHUB_ACCOUNT: string;
  GITHUB_REPO: string;
};

export const getConfig = (): ConfigProps => ({
  DOMAIN: process.env.DOMAIN || "",
  SUBDOMAIN: process.env.SUBDOMAIN || "",
  ZONE_ID: process.env.ZONE_ID || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GITHUB_ACCOUNT: process.env.GITHUB_ACCOUNT || "",
  GITHUB_REPO: process.env.GITHUB_REPO || "",
});
