import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInHours } from 'date-fns';
import type { Post } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currencyDisplay: 'symbol'
  }).format(amount);
}

export function generateCatchyTitle(post: Partial<Post>): string {
  if (!post.details?.restaurant || !post.order?.totalAmount) {
    return post.details?.title?.trim() || "Group Order";
  }

  const restaurant = post.details.restaurant;
  const remaining = Math.max(
    0,
    (post.order.totalAmount || 0) - (post.order.contributionAmount || 0)
  );

  const deadlineHours = post.timestamps?.deadline
    ? differenceInHours(new Date(post.timestamps.deadline), new Date())
    : null;

  // --- Phrase Pools ---
  const invitePhrases = [
    `Who\'s in for ${restaurant}?`,
    `Group order at ${restaurant}!`,
    `Let’s team up on ${restaurant}`,
    `Anyone up for ${restaurant}?`,
    `Craving ${restaurant}? Join in!`,
    `Don’t miss the ${restaurant} order!`,
    `Hop on this ${restaurant} deal`,
  ];

  const dealPhrases: string[] = [];
  if (post.details.title && /free delivery/i.test(post.details.title)) {
    dealPhrases.push("Free Delivery 🚚");
  } else if (post.details.title && /₹\d+\s*off/i.test(post.details.title)) {
    const match = post.details.title.match(/₹\d+\s*off/i);
    if (match) dealPhrases.push(`${match[0].trim()} 🔥`);
  }

  if (remaining > 0) {
    dealPhrases.push(`₹${remaining} more needed!`);
    dealPhrases.push(`Still short by ₹${remaining}`);
    dealPhrases.push(`Only ₹${remaining} left to hit target`);
  } else {
    dealPhrases.push("Deal unlocked! 🎉");
    dealPhrases.push("Target met ✅");
  }

  const urgencyPhrases: string[] = [];
  if (deadlineHours !== null && deadlineHours > 0 && deadlineHours <= 6) {
    urgencyPhrases.push(`Ends in ${deadlineHours}h ⏳`);
    urgencyPhrases.push(`Hurry, ${deadlineHours}h left!`);
  } else if (deadlineHours !== null && deadlineHours <= 0) {
    urgencyPhrases.push("Closing now!");
    urgencyPhrases.push("Last call 🚨");
  }

  const extraFlair = [
    "🔥",
    "🍔",
    "🍟",
    "🚀",
    "💥",
    "✨",
    "Don’t miss it!",
    "Grab your spot!",
    "Limited slots!",
    "",
  ];

  // --- Random selection ---
  const invite = invitePhrases[Math.floor(Math.random() * invitePhrases.length)];
  const deal = dealPhrases[Math.floor(Math.random() * dealPhrases.length)];
  const urgency =
    urgencyPhrases.length > 0
      ? urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)]
      : "";
  const flair = extraFlair[Math.floor(Math.random() * extraFlair.length)];

  // --- Shuffle order of parts ---
  const parts = [invite, deal, urgency, flair].filter(Boolean);
  const shuffled = parts.sort(() => Math.random() - 0.5);

  let title = shuffled.join(" • ");

  // Limit length
  const maxLength = 100;
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + "...";
  }

  return title;
}
