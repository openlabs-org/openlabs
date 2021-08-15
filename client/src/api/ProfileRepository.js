import { formatDistance, formatRelative, parseISO } from "date-fns";
import globals from "../global.json";
import { fetchAll as fetchAllGroups } from "./GroupRepository";

const scID = 2 ** 256 - 1;

export const fetch = async (
  { idx, ceramic, desiloContract, groupDict },
  did
) => {
  let profile = await idx.get("basicProfile", did);
  let cryptoAccounts = await idx.get("cryptoAccounts", did);
  cryptoAccounts = Object.keys(cryptoAccounts).map((acc) => acc.split("@")[0]);
  cryptoAccounts = [...new Set(cryptoAccounts)];
  if (cryptoAccounts.length != 0) {
    if (!groupDict)
      groupDict = await fetchAllGroups({ ceramic, desiloContract });

    const account = cryptoAccounts[0];
    let socialCreditsAll = await desiloContract.methods
      .getAllSocialCredits(account)
      .call();
    let socialCredits = socialCreditsAll[0];
    let lifetimeSocialCredits = socialCreditsAll[1];

    profile.socialCredits = socialCredits.map((amount, index) => {
      if (index < socialCredits.length - 1)
        return Object.assign({}, groupDict[index], {
          amount: amount,
          amountLifetime: lifetimeSocialCredits[index],
        });

      return {
        id: scID,
        name: "Platform",
        token: "SC",
        color: "#303f9f",
        amount,
        amountLifetime: lifetimeSocialCredits[lifetimeSocialCredits.length - 1],
      };
    });
  }
  return profile;
};

export const fetchAll = async ({ idx, ceramic, desiloContract, groupId }) => {
  if (groupId) {
  }
};
