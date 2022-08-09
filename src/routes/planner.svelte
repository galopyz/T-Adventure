<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { crossfade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { plots, add, remove, mark } from '$lib/plots';
  import { onDestroy } from 'svelte';

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
</script>

<h1>Create your story</h1>

<div class="story">
  <div class="board">
    <div class="left">
      <h2>Unordered Plots</h2>
      {#each $plots.filter((t) => !t.ordered) as plot (plot.id)}
        <div
          in:receive={{ key: plot.id }}
          out:send={{ key: plot.id }}
          animate:flip={{ duration: 280 }}
        >
          <label>
            <input type="checkbox" on:change={() => mark(plot, true)} />
            {plot.title}
            <button on:click={() => remove(plot)}>remove</button>
          </label>
        </div>
      {/each}
    </div>

    <div class="right">
      <h2>In Order</h2>
      {#each $plots.filter((t) => t.ordered) as plot (plot.id)}
        <div
          in:receive={{ key: plot.id }}
          out:send={{ key: plot.id }}
          animate:flip={{ duration: 280 }}
        >
          <label class="ordered">
            <input
              type="checkbox"
              checked
              on:change={() => mark(plot, false)}
            />
            {plot.title}
            <button on:click={() => remove(plot)}>remove</button>
          </label>
        </div>
      {/each}
    </div>
  </div>

  <form>
    <input placeholder="Title" />
    <textarea placeholder="Story" />
  </form>
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

  .story > form {
    font-size: 1.4em;
    grid-column: 1/3;
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

  label {
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

  button {
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

  label:hover button {
    opacity: 1;
  }

  textarea {
    width: 100%;
    height: 200px;
    background-color: aqua;
  }
</style>
