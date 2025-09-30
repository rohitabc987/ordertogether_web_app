
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
  // If core fields are missing, fallback to the user's title or a generic one.
  if (!post.details?.restaurant || !post.order?.totalAmount) {
    return post.details?.title?.trim() || "Group Order";
  }

  const remaining = Math.max(0, (post.order.totalAmount || 0) - (post.order.contributionAmount || 0));
  const deadlineHours = post.timestamps?.deadline ? differenceInHours(new Date(post.timestamps.deadline), new Date()) : null;

  // --- Phrase Pools for Variation ---
  const invitePhrases = [
    `Join our ${post.details.restaurant} order`,
    `Group order for ${post.details.restaurant}`,
    `Who's in for ${post.details.restaurant}?`,
    `Let's order ${post.details.restaurant} together`,
  ];

  const dealPhrases: string[] = [];
  // Prioritize user-mentioned deals
  if (post.details.title && /free delivery/i.test(post.details.title)) {
    dealPhrases.push("Free Delivery 🚚");
  } else if (post.details.title && /₹\d+\s*off/i.test(post.details.title)) {
    // Extract and use the specific discount mentioned
    const match = post.details.title.match(/₹\d+\s*off/i);
    if(match) dealPhrases.push(`${match[0].trim()} 🔥`);
  }
  
  if (remaining > 0) {
    dealPhrases.push(`${formatCurrency(remaining)} more needed!`);
  } else {
    // Only add this if no other deal is mentioned to avoid clutter
    if (dealPhrases.length === 0) {
      dealPhrases.push("Deal reached!");
    }
  }

  const urgencyPhrases: string[] = [];
  if (deadlineHours !== null && deadlineHours > 0 && deadlineHours <= 6) {
    urgencyPhrases.push(`Ends in ${deadlineHours}h ⏳`);
  } else if (deadlineHours !== null && deadlineHours <= 0) {
    urgencyPhrases.push('Closing now!');
  }

  const emojis = ["🎉", "🔥", "🍕", "🚀"];
  
  // --- Assemble the Title ---

  // 1. Start with a random invitation phrase
  const invite = invitePhrases[Math.floor(Math.random() * invitePhrases.length)];
  
  // 2. Add the most relevant deal phrase if available
  const deal = dealPhrases.length > 0 ? dealPhrases[0] : "";
  
  // 3. Add an urgency phrase if relevant
  const urgency = urgencyPhrases.length > 0 ? urgencyPhrases[0] : "";

  // 4. Occasionally add a random emoji for flavor, but not if one is already in a phrase
  let randomEmoji = '';
  if (Math.random() > 0.5 && !deal.includes('🚚') && !deal.includes('🔥') && !urgency.includes('⏳')) {
    randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  }

  // Combine the parts, filtering out any empty strings
  const segments = [invite, deal, urgency, randomEmoji].filter(s => s && s.trim() !== '');
  let title = segments.join(" • ");

  // Trim the title if it's too long
  const maxLength = 100;
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + "...";
  }

  return title;
}
