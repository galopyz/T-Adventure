# T-adventure

A choose your adventure text game maker using SvelteKit and Serverless functions with Vercel.
The app also uses MongoDB Atlas for data.

Deployed on [Vercel](https://t-adventure-980oo0hoc-galopyz.vercel.app/).

## Creation

On the Creation tab, plots can be created, updated, and deleted. 

Whatever is on the top of Unordered Plots will be on the editor to be edited.

If plot needs choices for readers to choose, a writer can add "\`(choice" (without quotes) 
with following options wrapped in paranthesis. For example, "`(choice (Eat apple) (Drink milk))" makes
two choices: Eat apple and Drink milk. 

Choosing first option will skip zero plot and choosing second option will skip one plot, so the writer can
put a plot about "eat apple" and "drink milk" and each choice will lead reader to respective choice.

If To Global button is clicked, plots in MongoDB Atlas are shown, and can be modified as well.

Then, To Local button can be clicked to come back to local.

## Reading

On the Reading tab, the writer can read his story in order. Unordered plots on the Creation tab will not
be shown on here.

If To Global button is clicked, plots in MongoDB Atlas are shown.

Then, To Local button can be clicked to come back to local.

## Inspiration

On the Inspiration tab, the writer can chat with Eliza for an inspiration for the story.
