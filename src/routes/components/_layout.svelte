<script>
  import { showNav } from "stores.js";
  export let segment = "";

  showNav.set(true);
  $: n = (segment || "").replace(new RegExp('-', 'g'), ' ');
  $: name = n.length ? n.charAt(0).toUpperCase() + n.slice(1) : "";

</script>

<svelte:head>
  <title>
    {name ? `${name} |` : ""} Waladocs.
  </title>
   <meta name="description" content="Walatic documentation. {name}">
</svelte:head>

{#if segment}
  <h4 class="capitalize pb-8">{name}</h4>
{/if}
<slot />