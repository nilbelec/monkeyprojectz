<script>
  import { onMount, onDestroy } from "svelte";
  import { getRandomColor } from "./utils.js";

  onMount(init);

  let requestID;

  let rings = [];
  const numRings = 8;

  const duration = 100;
  let currentTime;
  let prevCurrent;

  onDestroy(() => {
    window.cancelAnimationFrame(requestID);
  });

  let context;

  function init() {
    currentTime = 0;
    prevCurrent = 0;

    for (var i = 0; i < numRings; i++) {
      rings[i] = {
        color: getRandomColor(),
        stop: i / numRings
      };
    }

    context = document.getElementById("canvas").getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    requestID = window.requestAnimationFrame(loop);
  }

  function loop(time) {
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    update(time);
    draw(context);
    requestID = window.requestAnimationFrame(loop);
  }

  function update(time) {
    const interval = window.performance.now() - time;

    for (let i = 1; i < rings.length; i++) {
      rings[i].stop += 0.002 * i;
    }

    while (rings[rings.length - 1].stop > 1) {
      rings.pop();
      rings.unshift({
        color: getRandomColor(),
        stop: 0
      });
    }
  }

  function draw(context) {
    const w = context.canvas.width;
    const h = context.canvas.height;
    const cx = context.canvas.width / 2;
    const cy = h / 2;

    const size = Math.max(w, h);

    var gradient = context.createRadialGradient(cx, cy, 1, cx, cy, size);
    rings.forEach(ring => {
      gradient.addColorStop(ring.stop, ring.color);
    });

    context.clearRect(0, 0, w, h);
    context.fillStyle = gradient;
    context.fillRect(0, 0, w, h);
  }
</script>

<canvas id="canvas" />
<span class="channel-title">_ Endless Birth [] _</span>
