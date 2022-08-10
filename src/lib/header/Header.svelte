<script lang="ts">
  import { page } from '$app/stores';
  import logo from './svelte-logo.svg';
  import { onMount } from 'svelte';

  export let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    let frame = requestAnimationFrame(loop);

    function loop(t: number) {
      frame = requestAnimationFrame(loop);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

      for (let p = 0; p < imageData.data.length; p += 4) {
        const i = p / 4;
        const x = i % canvas.width;
        const y = (i / canvas.width) >>> 0;

        const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 1000);
        const g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 1000);
        const b = 128;

        imageData.data[p + 0] = r;
        imageData.data[p + 1] = g;
        imageData.data[p + 2] = b;
        imageData.data[p + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<header>
  <div class="corner">
    <a href="https://kit.svelte.dev">
      <img src={logo} alt="SvelteKit" />
    </a>
  </div>

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li class:active={$page.url.pathname === '/'}>
        <a sveltekit:prefetch href="/">Home</a>
      </li>
      <li class:active={$page.url.pathname === '/about'}>
        <a sveltekit:prefetch href="/about">About</a>
      </li>
      <li class:active={$page.url.pathname === '/creation'}>
        <a sveltekit:prefetch href="/creation">Creation</a>
      </li>
      <li class:active={$page.url.pathname === '/reading'}>
        <a sveltekit:prefetch href="/reading">Reading</a>
      </li>
      <li class:active={$page.url.pathname === '/inspiration'}>
        <a sveltekit:prefetch href="/inspiration">Inspiration</a>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner">
    <!-- <canvas bind:this={canvas} /> -->
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  .corner {
    width: 8em;
    height: 8em;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 7em;
    height: 7em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(140, 137, 187, 0.322);
  }

  svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li.active::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--accent-color);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1em;
    color: var(--heading-color);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--accent-color);
  }

  canvas {
    width: 100%;
    height: 100%;
    background-color: #666;
    /* -webkit-mask: url('./svelte-logo.svg') 50% 50% no-repeat;
		mask: url('./svelte-logo.svg') 50% 50% no-repeat; */
    -webkit-mask: url('./svelte-logo.svg') 50% 50% no-repeat;
    mask: url('./svelte-logo.svg') 50% 50% no-repeat;
  }
</style>
