'use server';
/**
 * @fileOverview AI item suggestion flow for the POS system.
 *
 * - suggestItems - A function that suggests items based on the current items in the cart.
 * - SuggestItemsInput - The input type for the suggestItems function.
 * - SuggestItemsOutput - The return type for the suggestItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestItemsInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('The list of items currently in the shopping cart.'),
});
export type SuggestItemsInput = z.infer<typeof SuggestItemsInputSchema>;

const SuggestItemsOutputSchema = z.object({
  suggestedItems: z
    .array(z.string())
    .describe('A list of suggested items to add to the cart.'),
});
export type SuggestItemsOutput = z.infer<typeof SuggestItemsOutputSchema>;

export async function suggestItems(input: SuggestItemsInput): Promise<SuggestItemsOutput> {
  return suggestItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestItemsPrompt',
  input: {schema: SuggestItemsInputSchema},
  output: {schema: SuggestItemsOutputSchema},
  prompt: `You are a helpful shopping assistant. Based on the items currently in the cart, suggest other items that the customer might want to add.

Current cart items:
{{#each cartItems}}- {{{this}}}
{{/each}}

Suggest items that are frequently bought together with the current items. Suggest no more than 5 items.`,
});

const suggestItemsFlow = ai.defineFlow(
  {
    name: 'suggestItemsFlow',
    inputSchema: SuggestItemsInputSchema,
    outputSchema: SuggestItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
