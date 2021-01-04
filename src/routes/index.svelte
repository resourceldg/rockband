<script>
  import Carousel from "@beyonk/svelte-carousel";
  import { ChevronLeftIcon, ChevronRightIcon } from "svelte-feather-icons";
  import Share from "../components/Share.svelte";

  let carousels = [
    {
      perPage: 3,
    },
    {
      perPage: 3,
      controls: false,
    },
    {
      perPage: { 320: 2, 768: 4 },
    },
    {
      perPage: { 320: 1, 768: 3 },
    },
  ];

  function changed(event) {
    console.log(event.detail.currentSlide);
  }

  function handleClick() {
    alert("clicked");
  }
</script>

<style>
  .demo {
    margin: 0;
    padding-bottom: 30px;
    height: 230px;
    width: auto;
  }

  .slide-content {
    display: flex;
    flex-direction: column;
    height: 230px;
    background-color: #0000;
    margin: 0;
    padding-bottom: 30px;
  }

  .slide-content header {
    flex: 1;
    background-size: cover;
    margin: 0;
    padding: 0;
    height: 100px;
  }

  .slide-content section {
    height: 100px;
    margin: 0;
    padding-bottom: 30px;
    padding-top: 30px;
    color: aqua;
  }
</style>

<div class="demo">

  <Carousel perPage="1" dots="false">
    <div class="slide-content">
      <header style="background-image: url(locura.svg)" />
      <section>
        <div>
          <Share />
        </div>
        <div>2</div>
      </section>
    </div>
    <div class="slide-content">
      <header style="background-image: url(//placekitten.com/180)" />
      <section>
        <div>
          <Share />
        </div>
        <div>3</div>
      </section>
    </div>
    <div class="slide-content">
      <header style="background-image: url(//placekitten.com/320)" />
      <section>
        <div>
          <Share />
        </div>
        <div>4</div>
      </section>
    </div>

  </Carousel>
</div>
<div>
  <p class="pb-4">
    Waladocs is a documentation by Walatic We hope this tool helps you and
    accompanies you in your work. If you find any error please report it
    <a class="a" href="https://github.com/resourceldg/waladocs/issue">here</a>
    You can do better if you fork this project and contribute.
  </p>
  <h3>Remember</h3>
  <h4>" You have the potencial to make amazing things. "</h4>
</div>
