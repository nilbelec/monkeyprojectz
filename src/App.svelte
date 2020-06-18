<script>
  import TV from "./Tv.svelte";
  let tv;
</script>

<style>
  button {
    color: white;
    position: fixed;
    bottom: 10px;
    left: 10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>

<TV bind:this={tv} />

<button on:click={() => tv.changeChannel()}>[ change TV channel ]</button>
