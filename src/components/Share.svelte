<script>
  let active = "hidden";
  let open = false;
  let btn = " ";

  function isActive(open) {
    if (open) {
      btn = "hidden";
      active = " ";
      setTimeout(() => {
        active = "hidden";
        btn = " ";
      }, 8000);
    } else {
      active = " ";
    }
  }
</script>

<style>
  .social {
    transition: 0.5s ease-out;
  }
  .social:hover {
    transform: rotate(360deg);
    scale: 1.5;
  }
</style>

<form on:submit|preventDefault={isActive}>
  <div class="grid grid-cols-3 self-center">
    <div>
      <button class={btn} on:click={() => (open = !open)}>
        <img
          src="share.svg"
          alt="share"
          width="50"
          height="50"
          class="social" />
      </button>
    </div>

    <div class={active}>
      <a href="https://instagram.com/flordemonos?igshid=931ol0zsybq6">
        <img
          src="/instagram.svg"
          alt="Intagram rockband"
          width="50"
          height="50"
          class="social" />
      </a>
    </div>
    <div class={active}>
      <a href="https://www.facebook.com/FlorDeMonos/">
        <img
          src="/face.svg"
          alt="Facebook rockband"
          width="50"
          height="50"
          class="social" />
      </a>

    </div>

  </div>

</form>
