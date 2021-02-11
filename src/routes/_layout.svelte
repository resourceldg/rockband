<script>
  import AppBar from "components/AppBar";
  import Tabs from "components/Tabs";
  import Button from "components/Button";
  import { Spacer } from "components/Util";
  import List, { ListItem } from "components/List";
  import NavigationDrawer from "components/NavigationDrawer";
  import ProgressLinear from "components/ProgressLinear";
  import Tooltip from "components/Tooltip";
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { navMenu, topMenu } from "../utils/menu.js";
  import { right, elevation, persistent, showNav } from "stores.js";
  import dark from "../dark.js";

  const { preloading, page } = stores();

  let selected = "";

  const darkMode = dark();

  $: path = $page.path;
</script>

<style>
  .github {
    transition: 0.3s ease-out;
  }
  .github:hover {
    transform: rotate(360deg);
  }
</style>

<svelte:head>
  <title>Flor de Monos</title>
  <meta name="Flore de Monos Musiqueros" content="Rock Mestizo" />
</svelte:head>

{#if $preloading}
  <ProgressLinear app />
{/if}

{#each navMenu as link}
  <a href={link.to} class="hidden">{link.text}</a>
{/each}

<AppBar class={(i) => i.replace('primary-300', 'dark-600')}>
  <a href="." class="px-2 md:px-8 flex items-center">
    <img src="/fdm_logo.svg" alt="Rock Band logo" width="70" />
    <h6 class="pl-3 text-white tracking-widest font-thin text-lg">Flor de Monos</h6>
  </a>
  <Spacer />
  <Tabs navigation items={topMenu} bind:selected={path} />

  <Tooltip>
    <span class="hidden" slot="activator">
      <Button
        bind:value={$darkMode}
        small
        flat
        remove="p-1 h-4 w-4"
        iconClass="text-white"
        text />
    </span>
    {$darkMode ? 'Disable' : 'Enable'} dark mode
  </Tooltip>
  <div class="md:hidden">
    <Button
      icon="menu"
      small
      flat
      remove="p-1 h-4 w-4"
      iconClass="text-white"
      text
      on:click={() => showNav.set(!$showNav )} />
  </div>
  <a href="https://instagram.com/flordemonos?igshid=931ol0zsybq6" class="px-4 github">
    <img src="/instagram.svg" alt="ig rockband" width="50" height="50" />
  </a>
  <a href="https://www.facebook.com/FlorDeMonos/" class="px-4 github">
    <img src="/face.svg" alt="face rockband" width="50" height="50" />
  </a>

</AppBar>

<main
  class=" p-8 lg:max-w-5xl mx-auto mb-10 mt-24 md:ml-64 md:pl-16
  md:max-w-3xl md:px-3"
  transition:fade={{ duration: 300 }}>
  <NavigationDrawer
    bind:show={$showNav}
    right={$right}
    persistent={$persistent}
    elevation={$elevation}>
    <h6
      class="px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light
      dark:text-gray-100">
      Moneando
    </h6>
    <List items={navMenu}>
      <span slot="item" let:item class="cursor-pointer bg-nav">
        
        {#if item.to === 'shop'}
          <hr class="mt-4" />
          <h6
            class="px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light
            dark:text-gray-100">
            Tienda
          </h6>
        {/if}
        {#if item.to === 'press'}
          <hr class="mt-4" />
          <h6
            class="px-3 ml-1 pb-2 pt-8 text-sm text-gray-900 font-light
            dark:text-gray-100">
           Contacto
          </h6>
        {/if}

        <a href={item.to}>
          <ListItem
            id={item.id}
            text={item.text}
            to={item.to}
            selected={path.includes(item.to)}
            dense
            selectedClasses="bg-primary-transDark dark:bg-primary-transLight
            hover:bg-blue-gray-transDark blue-gray:bg-blue-gray-transLight" />
        </a>
      </span>
    </List>

    <hr />
  </NavigationDrawer>

  <slot />
</main>
