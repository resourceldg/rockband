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
    height: 500px;
    width: auto;
    background-color: #0000;
    margin: 0;
    padding-bottom: 30px;
  }

  .slide-content header {
    height: 400px;
    width: auto;
    background-size: cover;
    margin: 0;
    padding: 0;
  }

  .slide-content section {
    height: 100px;
    margin: 0;
    padding-bottom: 30px;
    padding-top: 30px;
    color: aqua;
  }

  @media screen and (max-width: 900px) {
    .slide-content {
      display: flex;
      flex-direction: column;
      height: 400px;
      width: auto;
      background-color: #0000;
      margin: 0;
      padding-bottom: 30px;
    }

    .slide-content header {
      height: 350px;
      width: auto;
      background-size: cover;
      margin: 0;
      padding: 0;
    }

    .slide-content section {
      height: 100px;
      margin: 0;
      padding-bottom: 30px;
      padding-top: 30px;
      color: aqua;
    }
  }
  @media screen and (max-width: 600px) {
    .slide-content {
      height: 350px;
      width: auto;
    }

    .slide-content header {
      height: 175px;
      width: auto;
    }

    .slide-content section {
      height: 100px;
    }
  }
</style>

<div class="demo">

  <Carousel perPage="1" dots="false">
    <div class="slide-content">
      <header style="background-image: url(fdm_1.jpg)" />
      <section>
        <div>
          <Share />
        </div>
        <div>2</div>
      </section>
    </div>
    <div class="slide-content">
      <header style="background-image: url(fdm_2.png)" />
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
  <div class="mt-4">
    
    <h4>"Nuestra historia... "</h4>
    <p class="pb-4">
      Flor de Monos Musiqueros es una banda marplatense de rock mestizo que
      nació en el 2012. En el año 2016 grabó su primer material discográfico
      “Siempre libre, siempre vivo” en Kangrejoz Records. En el año 2018
      lanzaron su segundo disco “Sentir Musiquero”, proyecto auto gestionado y
      grabado en La Maravillosa Records, donde se fusionan estilos musicales y
      letras orientadas a la realidad social, el valor de la vida y el sentir
      por la tierra. El conjunto se caracteriza por tener influencias
      latinoamericanas en sus ritmos y un fuerte arraigo a la música popular,
      además de una fuerte identidad en sus letras. El respeto a las mujeres y a
      los pueblos originarios, la libertad y el mestizaje entre nuestras raíces
      y el día a día son reflejo de sus canciones. La banda realizó más de 140
      presentaciones, acompañando a artistas reconocidos cómo No te va gustar,
      Kapanga, Goy y los kangrejos, C4, Rondamon, Las manos de Filipi, entre
      otros. Además de las fechas en su ciudad natal, han recorrido el país
      llevando su música a Rio Colorado, Bahía Blanca, Pinamar, Villa Gessel,
      Miramar, Santa Teresita, Santa Clara del Mar, Mar Azul, Nechochea, Tandil,
      Otamendi, Mar de cobo, Rauch, Junin, Tres Arroyos, CABA, Azul, Dolores y
      Ayacucho.
    </p>
     <h5>
       Integrantes...
     </h5>
   <div class="grid grid-cols-1 md:grid-cols-2 m-4">
   
    <div><p>Abel Cardoso (Voz y Guitarra)</p><br>
      <p>Juan Cerqueira (Guitarra)</p><br>
      <p>Santiago Mikuki (Batería)</p><br>
      <p>Lucas Caviedes (Bajo)</p><br>
      <p>Julián Chule Bai (Teclado)</p><br>
    </div>
    <div>
      <p>Lucas González (Percusión)</p><br>
      <p>Germán Lutz (Saxo alto y coros)</p><br>
      <p>Gonzalo Delgado ( Saxo tenor y coros)</p><br>
      <p>Jerónimo Camara (Trompeta)</p><br>
      <p> Mateo Bandi (trombón)</p>

    </div>

   </div>

   
    
    
  </div>
</div>
