<script context="module">
  import { browser, dev } from '$app/env';
  // we don't need any JS on this page, though we'll load
  // it in dev so that we get hot module replacement...

  export const hydrate = dev;

  // ...but if the client-side router is already loaded
  // (i.e. we came here from elsewhere in the app), use it
  export const router = browser;

  // since there's no dynamic data here, we can prerender
  // it so that it gets served as a static asset in prod
  export const prerender = true;
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="content">
  <h1>About this app</h1>

  <p>
    This is a text game creator. On <a href="/creation">creation</a>, you can
    add plots to your story, and on <a href="/reading">reading</a>, you can
    start reading. You can also change from local to global by clicking local
    and global buttons.
  </p>
</div>

<style>
  .content {
    width: 100%;
    max-width: var(--column-width);
    margin: 0 auto;
  }
</style>
