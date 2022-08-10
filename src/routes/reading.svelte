<script lang="ts">
  import { plots } from '$lib/plots';
  import { load } from './index.svelte';

  // load();

  let i = 0;
  const sortedStory = $plots
    .filter((t) => t.order !== -1)
    .sort((a, b) => a.order - b.order);

  let environment = 'local';

  $: story = sortedStory[i];
  $: options = [{ text: 'hi', value: 0, selected: false }];
  $: selectedOption = -1;

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

<button class="Env-Button">To Global</button>

<div class="theator">
  <h1>Reading Time</h1>
  <h2>{story.title}</h2>
  <p>{parse(story.story)}</p>
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
      disabled={i === 0}
      on:click={() => {
        i--;
      }}>prev</button
    >
    <button
      on:click={() => {
        if (options.length !== 0) {
          i += selectedOption;
        }
        i++;
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
    color: hsla(244, 83%, 16%, 0.849);
    /* background-color: hsl(234, 48%, 49%); */
    background-position: 0;
    cursor: pointer;
  }
</style>
