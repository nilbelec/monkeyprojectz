<script>
  import { channels } from "./channels";
  import Screen from "./Screen.svelte";
  import Overlay from "./Overlay.svelte";

  let tv;

  let currentChannel = 0;
  export function changeChannel() {
    new Audio("/assets/tv_on.wav").play();
    tv.classList.remove("on");
    currentChannel == channels.length - 1
      ? (currentChannel = 0)
      : currentChannel++;
    void tv.offsetWidth;
    tv.classList.add("on");
  }
</script>

<style>
  .tv {
    width: 100%;
    height: 100%;
  }

  .tv::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(18, 16, 16, 0.1);
    opacity: 0;
    z-index: 2;
    pointer-events: none;
  }

  .tv::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
      ),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.06),
        rgba(0, 255, 0, 0.02),
        rgba(0, 0, 255, 0.06)
      );
    z-index: 2;
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
  }

  .tv::after {
    animation: flicker 1s infinite;
  }

  .tv.on > :global(.screen) {
    animation: turn-on 4s linear;
    animation-fill-mode: forwards;
    width: 100%;
    height: 100%;
  }

  .tv.on > :global(.overlay) {
    animation: overlay-anim 5s linear;
    animation-fill-mode: forwards;
  }
</style>

<div bind:this={tv} class="tv on">
  <Screen>
    <svelte:component this={channels[currentChannel]} />
  </Screen>
  <Overlay>AV-{currentChannel}</Overlay>
</div>
