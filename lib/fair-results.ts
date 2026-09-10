import type { FairResults } from "./types";

export const GUSTO_2026_FINAL_RESULTS: FairResults = {
  status: "READY",
  topStallsByRevenue: [
    { rank: 1, stallName: "SPICY BITE 🌶🔥", revenue: 94_500 },
    { rank: 2, stallName: "Theora Tarot", revenue: 85_000 },
    { rank: 3, stallName: "Chompy", revenue: 78_300 },
  ],
  topStallsByItemsSold: [
    { rank: 1, stallName: "Chompy", itemsSold: 16 },
    { rank: 2, stallName: "ဘိုဘိုဖက်ထုပ်", itemsSold: 13 },
    { rank: 3, stallName: "72 Pancakes", itemsSold: 11 },
  ],
  bestSellingItems: [
    {
      rank: 1,
      itemName: "Chocolate, Banana, Chocolates balls Mini Pancake",
      stallName: "72 Pancakes",
    },
    {
      rank: 2,
      itemName: "ကြက်ခြေထောက် မာလာအရိုးလွတ်",
      stallName: "Chompy",
    },
    {
      rank: 2,
      itemName: "Tarot Package 1",
      stallName: "Theora Tarot",
    },
    {
      rank: 2,
      itemName: "ဖက်ထုပ်အိုးကပ် (Pan-Fried / Potstickers)",
      stallName: "ဘိုဘိုဖက်ထုပ်",
    },
  ],
};
