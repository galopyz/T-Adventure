<script lang="ts">
  import Eliza from 'elizabot';
  import { beforeUpdate, afterUpdate } from 'svelte';

  let div: HTMLElement | any;
  let autoscroll: boolean;

  beforeUpdate(() => {
    // determine whether we should auto-scroll
    // once the DOM is updated...
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  afterUpdate(() => {
    // ...the DOM is now in sync with the data
    if (autoscroll) div.scrollTo(0, div.scrollHeight);
  });

  const eliza = new Eliza();

  let comments = [{ author: 'eliza', text: eliza.getInitial() }];

  function handleKeydown(event: any) {
    if (event.key === 'Enter') {
      const text = event.target.value;
      if (!text) return;

      comments = comments.concat({
        author: 'user',
        text,
      });

      event.target.value = '';

      const reply = eliza.transform(text);

      setTimeout(() => {
        comments = comments.concat({
          author: 'eliza',
          text: '...',
          placeholder: true,
        });

        setTimeout(() => {
          comments = comments
            .filter((comment) => !comment.placeholder)
            .concat({
              author: 'eliza',
              text: reply,
            });
          // more realistic wait time based on length of texts
        }, 36 * reply.length + Math.random() * 30 * reply.length);
      }, 25 * text.length + Math.random() * 400);
    }
  }
</script>

<div class="chat">
  <h1>Eliza</h1>

  <div class="scrollable" bind:this={div}>
    {#each comments as comment}
      <article class={comment.author}>
        <span>{comment.text}</span>
      </article>
    {/each}
  </div>

  <input on:keydown={handleKeydown} placeholder="Chat with Eliza" />

  <p>
    Learn more about <a href="https://en.wikipedia.org/wiki/ELIZA">Eliza</a>
  </p>
</div>

<style>
  .chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 30em;
    width: 60%;
    margin: var(--column-margin-top) auto 0 auto;
  }

  .scrollable {
    flex: 1 1 auto;
    border-top: 1px solid #eee;
    margin: 0 0 0.5em 0;
    overflow-y: auto;
    max-height: 25em;
    min-height: 20em;
  }

  article {
    margin: 0.5em 0;
  }

  .user {
    text-align: right;
  }

  span {
    padding: 0.5em 1em;
    display: inline-block;
  }

  .eliza span {
    background-color: #eee;
    border-radius: 1em 1em 1em 0;
  }

  .user span {
    background-color: #0074d9;
    color: white;
    border-radius: 1em 1em 0 1em;
    word-break: break-all;
  }
</style>
