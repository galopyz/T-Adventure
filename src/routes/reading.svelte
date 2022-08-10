<script lang="ts">
  import { plots } from '$lib/plots';

  let i = 0;
  $: story = $plots[i];
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
    console.log(options);
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
    margin: auto;
    color: honeydew;
    display: grid;
  }

  button {
    margin: auto;
  }
</style>
