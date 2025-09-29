
'use server';
/**
 * @fileOverview An AI copywriter to generate catchy post titles.
 *
 * - generatePostTitle - A function that handles the title generation.
 * - GeneratePostTitleInput - The input type for the generatePostTitle function.
 * - GeneratePostTitleOutput - The return type for the generatePostTitle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostTitleInputSchema = z.object({
  userInputTitle: z.string().optional().describe('The original title the user entered, if any.'),
  restaurantName: z.string().describe('The name of the delivery app or restaurant.'),
  remainingAmount: z.number().describe('The remaining amount in INR needed to complete the order.'),
  deadlineHours: z.number().describe('The number of hours left until the order deadline.'),
  discountInfo: z.string().optional().describe('Information about any discounts or coupons available.'),
});
export type GeneratePostTitleInput = z.infer<typeof GeneratePostTitleInputSchema>;

const GeneratePostTitleOutputSchema = z.object({
  catchyTitle: z.string().describe('The generated catchy and engaging title for the post.'),
});
export type GeneratePostTitleOutput = z.infer<typeof GeneratePostTitleOutputSchema>;

export async function generatePostTitle(input: GeneratePostTitleInput): Promise<GeneratePostTitleOutput> {
  return generatePostTitleFlow(input);
}

const generatePostTitlePrompt = ai.definePrompt({
  name: 'generatePostTitlePrompt',
  input: { schema: GeneratePostTitleInputSchema },
  output: { schema: GeneratePostTitleOutputSchema },
  prompt: `You are an expert copywriter for a group ordering app. 
Your task is to generate a catchy and engaging title for a group order post based on the provided details.

Follow these rules:
- If the user's input title is good, rewrite it in a short, catchy way.
- If the input is weak, empty, or not provided, auto-generate a title from the other post details.
- Always highlight a discount (like "₹100 off") or "Free delivery" if present in the discount info. This is the most important info.
- If the remaining amount is greater than 0, mention it. Example: "Just ₹{{remainingAmount}} more needed!"
- If the deadline is less than 24 hours, add urgency. Example: "(Closes in {{deadlineHours}}h ⏳)"
- Always include the restaurant/app name for context.
- Keep the title under 12 words.
- Use emojis like 🚚, 🔥, 🎉, 🍕 where relevant to make it eye-catching.
- Randomize phrasing slightly so not all posts look the same. For example, use "Join in!", "Let's order!", "Group order for..." etc.

Post Details:
- User's Input Title: "{{userInputTitle}}"
- Restaurant/App: "{{restaurantName}}"
- Remaining Amount Needed: ₹{{remainingAmount}}
- Deadline (Hours Left): {{deadlineHours}}
- Discount/Coupon Info: "{{discountInfo}}"

Generate a single, catchy title. Return only the final title string in the 'catchyTitle' field.
`,
});

const generatePostTitleFlow = ai.defineFlow(
  {
    name: 'generatePostTitleFlow',
    inputSchema: GeneratePostTitleInputSchema,
    outputSchema: GeneratePostTitleOutputSchema,
  },
  async (input) => {
    const { output } = await generatePostTitlePrompt(input);
    return output!;
  }
);
