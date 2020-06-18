<script>
  import { onMount, onDestroy } from "svelte";
  import { getMousePos } from "./utils.js";

  let square,
    circles = [],
    eaten_circles = [],
    drop_circles = [],
    initialSize = 20,
    randomChangePercent = 5;

  let context;

  onMount(init);

  let requestID;
  onDestroy(() => {
    window.cancelAnimationFrame(requestID);
  });

  function init() {
    if (requestID) window.cancelAnimationFrame(requestID);
    square = {
      x: Math.floor(Math.random() * (window.innerWidth - initialSize)),
      y: Math.floor(Math.random() * (window.innerHeight - initialSize)),
      w: initialSize,
      h: initialSize,
      R: Math.floor(Math.random() * 255),
      G: Math.floor(Math.random() * 255),
      B: Math.floor(Math.random() * 255),
      goX: 1,
      goY: 0,
      speed: Math.floor(Math.random() * 4 + 5),
      isDropping: false,
      isVibrating: false,
      isCollapsing: false,
      collapsingTimes: Math.floor(Math.random() * 5 + 2)
    };

    circles = [];

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
    draw();
  }

  function addCircle(evt) {
    if (square.isDropping) return;
    const mousePos = getMousePos(evt);
    circles[circles.length] = {
      x: mousePos.x,
      y: mousePos.y,
      R: Math.floor(Math.random() * 255),
      G: Math.floor(Math.random() * 255),
      B: Math.floor(Math.random() * 255),
      angle: Math.PI * 2,
      size: Math.floor(Math.random() * 10 + 1)
    };
  }

  function update(time) {
    if (square.isDropping) {
      if (square.isVibrating) {
        if (!square.isCollapsing) {
          if (
            square.w < window.innerWidth / 2 + 100 ||
            square.h < window.innerHeight / 2 + 100
          ) {
            square.w += 40;
            square.x -= 20;
            square.h += 40;
            square.y -= 20;
          } else {
            square.isCollapsing = true;
          }
        } else {
          if (
            square.w > window.innerWidth / 2 ||
            square.h > window.innerHeight / 2
          ) {
            square.w -= 40;
            square.x += 20;
            square.h -= 40;
            square.y += 20;
          } else {
            square.isCollapsing = false;
            square.collapsingTimes--;

            if (square.collapsingTimes <= 0) {
              square.isVibrating = false;
            }
          }
        }
      } else {
        init();
      }
    } else {
      if (circles.length == 0) {
        if (Math.floor(Math.random() * 100) < randomChangePercent) {
          if (square.goX == 0) {
            square.goY = 0;
            if (Math.random() > 0.5) square.goX = 1;
            else square.goX = -1;
          } else {
            square.goX = 0;
            if (Math.random() > 0.5) square.goY = 1;
            else square.goY = -1;
          }
        } else {
          square.x += square.goX * square.speed;
          square.y += square.goY * square.speed;

          if (square.x < 0 || square.x >= window.innerWidth - square.w) {
            square.x -= square.goX * square.speed;
            square.goX = 0;

            if (Math.random() > 0.5) square.goY = 1;
            else square.goY = -1;
          }

          if (square.y < 0 || square.y >= window.innerHeight - square.h) {
            square.y -= square.goY * square.speed;
            square.goY = 0;

            if (Math.random() > 0.5) square.goX = 1;
            else square.goX = -1;
          }
        }
      } else {
        var circle = circles[0];

        if (circle.x + circle.size < square.x) {
          square.x -= square.speed;
        } else if (circle.x - circle.size > square.x + square.w) {
          square.x += square.speed;
        } else {
          if (circle.y + circle.size < square.y) {
            square.y -= square.speed;
          } else if (circle.y - circle.size > square.y + square.h) {
            square.y += square.speed;
          } else {
            square.w += circle.size;
            square.h += circle.size;
            square.speed += 1;
            square.R = circle.R;
            square.G = circle.G;
            square.B = circle.B;
            circles.splice(0, 1);

            if (
              square.w >= window.innerWidth / 2 ||
              square.h >= window.innerHeight / 2
            ) {
              square.isDropping = true;
              square.isVibrating = true;
            }
          }
        }
      }
    }
  }

  function draw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = `rgba(${square.R}, ${square.G}, ${square.B}, 1)`;
    context.fillRect(square.x, square.y, square.w, square.h);

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i];

      var color = `rgba(${circle.R}, ${circle.G}, ${circle.B}, .8)`;
      context.save();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.beginPath();
      context.arc(circle.x, circle.y, circle.size, 0, circle.angle, true);
      context.closePath();
      context.stroke();
      context.fill();
      context.restore();
    }
  }
</script>

<style>

</style>

<canvas on:click|preventDefault|stopPropagation={addCircle} id="canvas" />
<span class="channel-title">_ Disciplined Gluttony [ click ] _</span>
