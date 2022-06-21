import fs from "fs";
import path from "path";
import { TokenList } from "@uniswap/token-lists";
import { version as plexswapDefaultVersion } from "../lists/plexswap-default.json";
import { version as plexswapExtendedVersion } from "../lists/plexswap-extended.json";
import { version as plexswapTop15Version } from "../lists/plexswap-top-15.json";
import { version as plexswapTop100Version } from "../lists/plexswap-top-100.json";
import { version as coingeckoVersion } from "../lists/coingecko.json";
import { version as cmcVersion } from "../lists/cmc.json";
import { version as plexswapMiniVersion } from "../lists/plexswap-mini.json";
import { version as plexswapMiniExtendedVersion } from "../lists/plexswap-mini-extended.json";
import plexswapDefault from "./tokens/plexswap-default.json";
import plexswapExtended from "./tokens/plexswap-extended.json";
import plexswapTop100 from "./tokens/plexswap-top-100.json";
import plexswapTop15 from "./tokens/plexswap-top-15.json";
import coingecko from "./tokens/coingecko.json";
import cmc from "./tokens/cmc.json";
import plexswapMini from "./tokens/plexswap-mini.json";
import plexswapMiniExtended from "./tokens/plexswap-mini-extended.json";

export enum VersionBump {
  "major" = "major",
  "minor" = "minor",
  "patch" = "patch",
}

type Version = {
  major: number;
  minor: number;
  patch: number;
};

const lists = {
  "plexswap-default": {
    list: plexswapDefault,
    name: "PlexSwap Default",
    keywords: ["plexswap", "default"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: false,
    currentVersion: plexswapDefaultVersion,
  },
  "plexswap-extended": {
    list: plexswapExtended,
    name: "PlexSwap Extended",
    keywords: ["plexswap", "extended"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: true,
    currentVersion: plexswapExtendedVersion,
  },
  "plexswap-top-100": {
    list: plexswapTop100,
    name: "PlexSwap Top 100",
    keywords: ["plexswap", "top 100"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: true,
    currentVersion: plexswapTop100Version,
  },
  "plexswap-top-15": {
    list: plexswapTop15,
    name: "PlexSwap Top 15",
    keywords: ["plexswap", "top 15"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: true,
    currentVersion: plexswapTop15Version,
  },
  coingecko: {
    list: coingecko,
    name: "CoinGecko",
    keywords: ["defi"],
    logoURI:
      "https://www.coingecko.com/assets/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
    sort: true,
    currentVersion: coingeckoVersion,
  },
  cmc: {
    list: cmc,
    name: "CoinMarketCap",
    keywords: ["defi"],
    logoURI: "https://ipfs.io/ipfs/QmQAGtNJ2rSGpnP6dh6PPKNSmZL8RTZXmgFwgTdy5Nz5mx",
    sort: true,
    currentVersion: cmcVersion,
  },
  "plexswap-mini": {
    list: plexswapMini,
    name: "PlexSwap Mini",
    keywords: ["plexswap", "binance", "mini program", "mini"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: true,
    currentVersion: plexswapMiniVersion,
  },
  "plexswap-mini-extended": {
    list: plexswapMiniExtended,
    name: "PlexSwap Mini Ext",
    keywords: ["plexswap", "binance", "mini program", "mini", "extended"],
    logoURI: "https://plexswap.finance/logo.png",
    sort: true,
    currentVersion: plexswapMiniExtendedVersion,
  },
};

const getNextVersion = (currentVersion: Version, versionBump?: VersionBump) => {
  const { major, minor, patch } = currentVersion;
  switch (versionBump) {
    case VersionBump.major:
      return { major: major + 1, minor, patch };
    case VersionBump.minor:
      return { major, minor: minor + 1, patch };
    case VersionBump.patch:
    default:
      return { major, minor, patch: patch + 1 };
  }
};

export const buildList = (listName: string, versionBump?: VersionBump): TokenList => {
  const { list, name, keywords, logoURI, sort, currentVersion } = lists[listName];
  const version = getNextVersion(currentVersion, versionBump);
  return {
    name,
    timestamp: new Date().toISOString(),
    version,
    logoURI,
    keywords,
    // sort them by symbol for easy readability (not applied to default list)
    tokens: sort
      ? list.sort((t1, t2) => {
          if (t1.chainId === t2.chainId) {
            // CAKE first in extended list
            if ((t1.symbol === "CAKE") !== (t2.symbol === "CAKE")) {
              return t1.symbol === "CAKE" ? -1 : 1;
            }
            return t1.symbol.toLowerCase() < t2.symbol.toLowerCase() ? -1 : 1;
          }
          return t1.chainId < t2.chainId ? -1 : 1;
        })
      : list,
  };
};

export const saveList = (tokenList: TokenList, listName: string): void => {
  const tokenListPath = `${path.resolve()}/lists/${listName}.json`;
  const stringifiedList = JSON.stringify(tokenList, null, 2);
  fs.writeFileSync(tokenListPath, stringifiedList);
  console.info("Token list saved to ", tokenListPath);
};
