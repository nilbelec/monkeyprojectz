<script>
  import { onMount, onDestroy } from "svelte";
  import { getMousePos } from "./utils.js";

  onMount(init);

  let requestID;
  onDestroy(() => {
    window.cancelAnimationFrame(requestID);
  });

  let circles = [];
  let context;

  function init() {
    circles = [];
    for (let i = 0; i < 15; i++) {
      circles[i] = getNewCircle();
    }

    context = document.getElementById("canvas").getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    requestID = window.requestAnimationFrame(loop);
  }

  function loop(time) {
    requestID = window.requestAnimationFrame(loop);

    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    update(time);
    draw(context);
  }

  function addCircle(evt) {
    var currentSize = Math.floor(Math.random() * 50 + 20);
    var maxSize = Math.floor(Math.random() * 30 + 20);
    var minSize = Math.floor(Math.random() * 10 + 2);

    if (currentSize > maxSize) currentSize = maxSize;
    else if (currentSize < minSize) currentSize = minSize;

    const mousePos = getMousePos(evt);
    circles[circles.length] = {
      x: mousePos.x,
      y: mousePos.y,
      R: Math.random() * 255,
      G: Math.random() * 255,
      B: Math.random() * 255,
      angle: Math.PI * 2,
      size: currentSize,
      maxSize: maxSize,
      minSize: minSize,
      speed: Math.random() * 10 + 5,
      intoout: false,
      bounce: Math.random() > 0.8
    };
  }

  function removeCircle(evt) {
    if (circles.length > 1) {
      circles.splice(0, 1);
    }
  }

  function draw(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const { R, G, B } = circle;
      const color = `rgba(${R},${G},${B}, .7)`;
      context.save();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.beginPath();
      context.shadowColor = color;
      context.shadowBlur = 20;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.arc(circle.x, circle.y, circle.size, 0, circle.angle, true);
      context.closePath();
      context.stroke();
      context.fill();
      context.restore();
    }
  }

  function update(time) {
    const interval = window.performance.now() - time;
    for (let i = 0; i < circles.length; i++) {
      var circle = circles[i];

      if (circle.bounce) {
        if (circle.intoout) {
          circle.size += 3;
        } else {
          circle.size -= 3;
        }
        if (circle.size < circle.minSize) {
          circle.intoout = !circle.intoout;
          circle.size = circle.minSize;
        }
        if (circle.size > circle.maxSize) {
          circle.intoout = !circle.intoout;
          circle.size = circle.maxSize;
        }
      }

      circle.x += circle.speed;
      if (circle.x > window.innerWidth + circle.size) {
        circles[i] = getNewCircle();
        circles[i].x = 0 - circle.size;
      }
    }
  }

  function getNewCircle() {
    var currentSize = Math.floor(Math.random() * 50 + 20);
    var maxSize = Math.floor(Math.random() * 30 + 20);
    var minSize = Math.floor(Math.random() * 10 + 2);

    if (currentSize > maxSize) currentSize = maxSize;
    else if (currentSize < minSize) currentSize = minSize;

    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      R: Math.floor(Math.random() * 255),
      G: Math.floor(Math.random() * 255),
      B: Math.floor(Math.random() * 255),
      angle: Math.PI * 2,
      size: currentSize,
      maxSize: maxSize,
      minSize: minSize,
      speed: Math.random() * 10 + 1,
      intoout: false,
      bounce: Math.random() > 0.8
    };
  }
</script>

<canvas
  on:click|preventDefault|stopPropagation={addCircle}
  on:contextmenu|preventDefault|stopPropagation={removeCircle}
  id="canvas" />
<span class="channel-title">_ Nonsense Travel [ click / rclick ] _</span>
