<script context="module" lang="ts">
  export const prerender = true;
  export const load = async function fetch({ fetch }) {
    const res = await fetch('mongo');
    const data = await res.json();
    // console.log(data);
    return {
      props: {
        data,
      },
    };
  };
</script>

<script lang="ts">
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h1>Adventure</h1>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  h1 {
    width: 100%;
  }
</style>
