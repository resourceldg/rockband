<script>
  import Card from "./Card.svelte";
</script>

<div
  class="grid md:grid-cols-3 gap-2 rounded-bl place-items-center m-2 shadow-lg
  mt-20 mb-10">
  <Card>
    <span slot="cardImage">
      <img src="disc.jpg" alt="caja" width="200" height="auto" />
    </span>
    <span slot="cardTitle">Disco S</span>
    <span slot="cardPharagraph">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum natus ut
      animi qui ab? Culpa excepturi doloremque accusamus beatae qui, odio est
      repudiandae vitae aperiam cumque tenetur hic neque obcaecati.
    </span>
    <span slot="cardButtom">Comprar</span>
  </Card>
  <Card>
    <span slot="cardImage">
      <img src="disc.jpg" alt="caja" width="200" height="auto" />
    </span>
    <span slot="cardTitle">Disco M</span>
    <span slot="cardPharagraph">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum natus ut
      animi qui ab? Culpa excepturi doloremque accusamus beatae qui, odio est
      repudiandae vitae aperiam cumque tenetur hic neque obcaecati.
    </span>
    <span slot="cardButtom">Comprar</span>
  </Card>
  <Card>
    <span slot="cardImage">
      <img src="disc.jpg" alt="caja" width="200" height="auto" />
    </span>
    <span slot="cardTitle">Disco L</span>
    <span slot="cardPharagraph">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum natus ut
      animi qui ab? Culpa excepturi doloremque accusamus beatae qui, odio est
      repudiandae vitae aperiam cumque tenetur hic neque obcaecati.
    </span>
    <span slot="cardButtom">Comprar</span>
  </Card>

</div>
