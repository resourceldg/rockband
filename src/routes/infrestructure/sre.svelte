<script>
    import Code from "docs/Code.svelte";
  </script>

<div>
    <h4 class="pb-8">Welcome to the jungle!! Site Reliability Engineer!!</h4>
    <p class="pb-4">Mosquitto independiente del Docker Compose, primero creamos
        la network, después ejecutamos el coomando docker run
    </p>
    <Code code={`docker network create proxy-net`} />
    <Code code={`docker run -itd -p 1883:1883 -p 8883:8883 --net proxy-net  eclipse-mosquitto `} />
    
</div>