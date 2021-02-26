<script>
	import Audio from './../components/Audio/Audio.svelte';
 
</script>
<h3 class="text-xl">Llevate nuestra música a donde quieras...</h3>
<div class="grid grid-cols-1">
    <div class="m-30">
        <Audio/>
    </div>
        <div class="grid md:grid-cols-4 gap-4 rounded-bl place-items-center  shadow-lg p-4 mt-30 mb-10">
        <div class="grid justify-self-start" >
            <img src="desc.svg " alt="disc" width="70" height="70"></div>
        <div class="grid col-span-2 justify-self-center">  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum</div>
        <div class="grid sm:justify-self-end"> <a href="PASO A PASO.mp3" download="PASO A PASO.mp3">
           download
          </a></div>
    </div>
    
</div>
