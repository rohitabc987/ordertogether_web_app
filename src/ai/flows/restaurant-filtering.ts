'use server';

/**
 * @fileOverview Restaurant filtering AI agent.
 *
 * - filterRestaurants - A function that suggests restaurants based on user location, order history, and trends.
 * - FilterRestaurantsInput - The input type for the filterRestaurants function.
 * - FilterRestaurantsOutput - The return type for the filterRestaurants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterRestaurantsInputSchema = z.object({
  location: z.string().describe('The user\u2019s current location.'),
  pastOrders: z.string().describe('A list of the user\u2019s past orders.'),
  currentTrends: z.string().describe('Current popular restaurants in the area.'),
});
export type FilterRestaurantsInput = z.infer<typeof FilterRestaurantsInputSchema>;

const FilterRestaurantsOutputSchema = z.object({
  suggestedRestaurants: z
    .array(z.string())
    .describe('A list of suggested restaurants based on the input data.'),
});
export type FilterRestaurantsOutput = z.infer<typeof FilterRestaurantsOutputSchema>;

export async function filterRestaurants(input: FilterRestaurantsInput): Promise<FilterRestaurantsOutput> {
  return filterRestaurantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterRestaurantsPrompt',
  input: {schema: FilterRestaurantsInputSchema},
  output: {schema: FilterRestaurantsOutputSchema},
  prompt: `You are a restaurant recommendation expert. Based on the user's location, past orders, and current trends, suggest a list of restaurants.

Location: {{{location}}}
Past Orders: {{{pastOrders}}}
Current Trends: {{{currentTrends}}}

Suggest a list of restaurants:`,
});

const filterRestaurantsFlow = ai.defineFlow(
  {
    name: 'filterRestaurantsFlow',
    inputSchema: FilterRestaurantsInputSchema,
    outputSchema: FilterRestaurantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
