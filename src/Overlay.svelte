<style>
  .overlay {
    color: #00ff00;
    position: fixed;
    top: 20px;
    left: 20px;
    font-size: 60px;
    visibility: hidden;
    pointer-events: none;
  }
</style>

<div class="overlay">
  <slot />
</div>
