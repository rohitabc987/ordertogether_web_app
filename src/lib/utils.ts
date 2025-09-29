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
  if (!post.restaurant || !post.totalAmount) {
    return post.title || "Group Order";
  }

  const remainingAmount = Math.max(0, (post.totalAmount || 0) - (post.contributionAmount || 0));
  const deadlineHours = post.deadline ? differenceInHours(new Date(post.deadline), new Date()) : 0;

  const phrases = [
    `Join our ${post.restaurant} order!`,
    `Let's order from ${post.restaurant}!`,
    `Group order for ${post.restaurant} 🎉`,
    `${post.restaurant} run! Who's in?`,
  ];
  let title = phrases[Math.floor(Math.random() * phrases.length)];
  
  let details = [];

  // 1. User's explicit title/discount is highest priority
  if (post.title && post.title.trim() !== '') {
    details.push(`${post.title.trim()} 🔥`);
  }

  // 2. Remaining amount
  if (remainingAmount > 0) {
    details.push(`Just ${formatCurrency(remainingAmount)} needed!`);
  } else {
    details.push(`Goal reached!`);
  }

  // 3. Urgency
  if (deadlineHours > 0 && deadlineHours < 24) {
    details.push(`Closes in ${deadlineHours}h ⏳`);
  }
  
  if (details.length > 0) {
    title = `${title} ${details.join(' ')}`;
  }

  return title.slice(0, 100); // Cap length
}
