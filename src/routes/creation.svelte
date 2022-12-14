<script lang="ts">
  import { onMount } from 'svelte';
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { plots, add, remove, mark, reorder } from '$lib/plots';
  import { sortPlots } from '$lib/utils';
  import { createPlot, readPlots, updatePlot, deletePlot } from './apiCalls';

  async function updateMongo() {
    const response = await readPlots();
    mongoPlots = response.plots;
    uid = mongoPlots.length;
  }

  onMount(async () => {
    updateMongo();
  });

  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
      };
    },
  });

  $: story = environment === 'local' ? $plots : mongoPlots;
  $: unoredredPlots = story.filter((t) => t.order === -1);
  $: inEdit = unoredredPlots[0] || { title: '', story: '', id: -1 };
  $: orderedPlots = sortPlots(story);

  let environment = 'local';
  let promise;
  let mongoPlots;
  let sortedMongoPlots;
  let uid: number;

  async function handleClick() {
    sortedMongoPlots = sortPlots(mongoPlots);
  }
</script>

{#if environment === 'local'}
  <button
    class="Env-Button"
    on:click={() => {
      promise = handleClick();
      environment = 'global';
    }}>To Global</button
  >
{:else}
  <button
    class="Env-Button"
    on:click={() => {
      environment = 'local';
    }}>To Local</button
  >
{/if}

<h1>Create your story</h1>

<div class="story">
  <div class="board">
    <div class="left">
      <h2>Unordered Plots</h2>
      {#each unoredredPlots as plot (plot.id)}
        <div
          in:receive={{ key: plot.id }}
          out:send={{ key: plot.id }}
          animate:flip={{ duration: 280 }}
        >
          <label>
            <input
              type="checkbox"
              on:change={async () => {
                if (environment === 'local') {
                  mark(plot.id, orderedPlots.length);
                } else {
                  await updatePlot({ id: plot.id, order: orderedPlots.length });
                  updateMongo();
                }
              }}
            />
            {plot.title}
            <button
              on:click={async () => {
                if (environment === 'local') {
                  remove(plot.id);
                } else {
                  await deletePlot({ id: plot.id });
                  updateMongo();
                }
              }}>remove</button
            >
          </label>
        </div>
      {/each}
    </div>

    <div class="right">
      <h2>In Order</h2>
      {#each orderedPlots as plot (plot.id)}
        <div
          in:receive={{ key: plot.id }}
          out:send={{ key: plot.id }}
          animate:flip={{ duration: 280 }}
        >
          <label class="ordered">
            <input
              type="checkbox"
              checked
              on:change={() => {
                reorder(plot.order);
                mark(plot.id, -1);
              }}
            />
            {plot.title}
            <button
              on:click={async () => {
                if (environment === 'local') {
                  remove(plot.id);
                } else {
                  await deletePlot({ id: plot.id });
                  updateMongo();
                }
              }}>remove</button
            >
          </label>
        </div>
      {/each}
    </div>
  </div>

  <div class="editor">
    <button
      on:click={async () => {
        if (environment === 'local') {
          add();
        } else {
          await createPlot({ id: uid++, order: -1, title: '', story: '' });
          updateMongo();
        }
      }}>Add Plot</button
    >
    <label for="title">
      Title:
      <input
        disabled={inEdit.id === -1}
        id="title"
        placeholder="Add a new plot to edit title."
        type="text"
        bind:value={inEdit.title}
      />
    </label>
    <lable for="story" id="storyLabel">
      Story:
      <textarea
        disabled={inEdit.id === -1}
        id="story"
        placeholder="Add a new plot to edit story."
        bind:value={inEdit.story}
      />
    </lable>
  </div>
</div>

<style>
  .story {
    max-width: 46em;
    min-width: 35em;
    margin: 0 auto;
  }

  .board {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1em;
    max-width: 46em;
    margin: 0 auto;
    height: 20em;
    overflow: auto;
  }

  .right {
    text-align: right;
  }

  h2 {
    font-size: 2em;
    font-weight: 200;
    user-select: none;
    margin: 0 0 0.5em 0;
  }

  .board label {
    position: relative;
    line-height: 2.5;
    padding: 0.5em 2.5em 0.5em 2em;
    margin: 0 0 0.5em 0;
    border-radius: 2px;
    user-select: none;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(300, 28%, 27%);
    color: rgb(224, 196, 196);
  }

  input[type='checkbox'] {
    position: absolute;
    left: 0.5em;
    top: 0.6em;
    margin: 0;
  }

  .board label > button {
    position: absolute;
    top: 0;
    right: 0.2em;
    width: 2em;
    height: 100%;
    background: no-repeat 50% 50%
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23676778' d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: 1.4em 1.4em;
    border: none;
    opacity: 0;
    transition: opacity 0.2s;
    text-indent: -9999px;
    cursor: pointer;
  }

  .board label:hover button {
    opacity: 1;
  }

  .editor {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .editor * {
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(234, 71%, 8%);
    color: rgb(224, 196, 196);
    border-radius: 4px;
    padding: 1em, 0.5em, 1em, 0.5em;
  }

  .editor label {
    color: hsl(240, 8%, 70%);
    padding: 1em;
    margin: 1em;
  }

  #storyLabel {
    font-size: 1.2em;
    width: 100%;
    height: 20em;
    margin: 1em;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(234, 71%, 8%);
    color: rgb(224, 196, 196);
  }

  textarea {
    font-size: 1.2em;
    width: 85%;
    height: 70%;
    margin: 1em;
    border: 1px solid hsl(240, 8%, 70%);
    background-color: hsl(234, 71%, 8%);
    color: rgb(224, 196, 196);
    padding: 1em;
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
    width: 8em;
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
