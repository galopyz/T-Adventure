<script lang="ts">
  import { plots } from '$lib/plots';
  import { sortPlots } from '$lib/utils';
  import { readPlots } from './apiCalls';

  $: story = environment === 'local' ? sortedStory : sortedMongoPlots;
  $: options = [{ text: 'hi', value: 0, selected: false }];
  $: selectedOption = -1;

  let promise;
  let mongoPlots;
  let sortedMongoPlots;
  let plotIndex = 0;
  let environment = 'local';
  let skip = 0;

  const sortedStory = sortPlots($plots);

  async function handleClick() {
    mongoPlots = await readPlots();
    sortedMongoPlots = sortPlots(mongoPlots.plots);
  }

  function makeOptions(newOptions: Array<string>) {
    options = newOptions.map((o, i) => {
      return {
        text: o.trim().replaceAll(/\(|\)/g, ''),
        value: i,
        selected: false,
      };
    });
  }

  function parse(text: string) {
    const regex = /(.+)\`\(choice(.+)/;
    if (regex.test(text)) {
      makeOptions(regex.exec(text)![2].split(/\)\s\(/));
      return regex.exec(text)![1];
    }
    makeOptions([]);
    return text;
  }
</script>

{#if environment === 'local'}
  <button
    class="Env-Button"
    on:click={() => {
      promise = handleClick();
      environment = 'global';
      plotIndex = 0;
    }}>To Global</button
  >
{:else}
  <button
    class="Env-Button"
    on:click={() => {
      environment = 'local';
      plotIndex = 0;
    }}>To Local</button
  >
{/if}

<h1>Reading Time</h1>
<div class="theator">
  {#await promise then value}
    <h2>
      {story[plotIndex].title}
    </h2>
    <p>{parse(story[plotIndex].story)}</p>
  {/await}
  {#each options as option (option.value)}
    <label>
      <input
        type="radio"
        name="option"
        bind:group={selectedOption}
        value={option.value}
      />
      {option.text}
    </label>
  {/each}

  <div class="navigation">
    <button
      disabled={plotIndex === 0}
      on:click={() => {
        plotIndex--;
      }}>prev</button
    >
    <button
      disabled={plotIndex > story.length - 2}
      on:click={() => {
        if (options.length !== 0) {
          if (selectedOption === 0) {
            skip = selectedOption + 1;
          } else {
            plotIndex += selectedOption;
          }
        } else if (skip !== 0) {
          plotIndex += skip;
          skip = 0;
        }
        plotIndex += 1;
      }}>next</button
    >
  </div>
</div>

<style>
  .theator {
    display: grid;
    color: var(--heading-color);
    width: 35%;
    height: 50%;
    margin: var(--column-margin-top) auto 0 auto;
  }

  .Env-Button {
    position: absolute;
    right: 20%;
    height: 3em;
    width: 6em;
    font-size: medium;
  }

  button {
    margin: auto;
    height: 2rem;
    width: 4em;
    padding: 0.2em;
    border: 1px solid hsl(240, 8%, 70%);
    border-radius: 0.3em;
    background-color: hsl(234, 71%, 8%);
    background-image: linear-gradient(
      45deg,
      hsl(234, 66%, 64%),
      transparent 90%
    );
    background-position: 100%;
    background-size: 400%;
    color: var(--heading-color);
    transition: background 0.3s ease-in-out;
  }

  button:disabled {
    color: hsl(240, 34%, 24%);
  }

  button:hover:not([disabled]) {
    color: hsl(244, 83%, 16%);
    /* background-color: hsl(234, 48%, 49%); */
    background-position: 0;
    cursor: pointer;
  }
</style>
