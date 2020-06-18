<script>
  import { onMount, onDestroy } from "svelte";
  import { getMousePos } from "./utils.js";

  let squareNumberWidth = 60,
    squareNumberHeight = 40,
    squareWidth,
    squareHeight,
    squareMargin = 3,
    squares = [];

  let context, mousePos, requestID;

  onMount(() => {
    init();

    context = document.getElementById("canvas").getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    requestID = window.requestAnimationFrame(loop);
  });

  onDestroy(() => {
    window.cancelAnimationFrame(requestID);
  });

  function init() {
    // Calculate Width and Height
    squareWidth =
      (window.innerWidth - squareMargin * (squareNumberWidth + 1)) /
      squareNumberWidth;
    while (squareWidth < 1) {
      squareNumberWidth--;
      squareWidth =
        (window.innerWidth - squareMargin * (squareNumberWidth + 1)) /
        squareNumberWidth;
    }

    squareHeight =
      (window.innerHeight - squareMargin * (squareNumberHeight + 1)) /
      squareNumberHeight;
    while (squareHeight < 1) {
      squareNumberHeight--;
      squareHeight =
        (window.innerHeight - squareMargin * (squareNumberHeight + 1)) /
        squareNumberHeight;
    }

    for (var i = 0; i < squareNumberWidth; i++) {
      for (var j = 0; j < squareNumberHeight; j++) {
        var currentX = (squareMargin + squareWidth) * i + squareMargin;
        var currentY = (squareMargin + squareHeight) * j + squareMargin;

        var index = i + j * squareNumberWidth;
        squares[index] = {
          x: currentX,
          y: currentY,
          w: squareWidth,
          h: squareHeight,
          R: 253,
          G: 255,
          B: 106,
          stopIt: false,
          changed: false,
          touched: false
        };
      }
    }
  }

  function loop(time) {
    requestID = window.requestAnimationFrame(loop);

    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    update(time);
    draw(context);
  }

  function updateMousePos(evt) {
    mousePos = getMousePos(evt);
  }

  function draw(context) {
    for (var i = 0; i < squares.length; i++) {
      var square = squares[i];

      context.fillStyle =
        "rgb(" +
        Math.floor(square.R) +
        "," +
        Math.floor(square.G) +
        "," +
        Math.floor(square.B) +
        ")";
      context.fillRect(square.x, square.y, square.w, square.h);
    }
  }

  function update() {
    if (!mousePos || isNaN(mousePos.x) || isNaN(mousePos.y)) return;
    var currentX = mousePos.x;
    var currentY = mousePos.y;
    var i = -1;
    var j = -1;

    while (currentX >= 0) {
      currentX -= squareWidth + squareMargin;
      i++;
    }

    while (currentY >= 0) {
      currentY -= squareHeight + squareMargin;
      j++;
    }

    while (j >= squareNumberHeight) {
      j--;
    }

    while (i >= squareNumberWidth) {
      i--;
    }

    var index = squareNumberWidth * j + i;

    if (index >= 0 && index < squares.length) {
      var square = squares[index];
      square.touched = true;
    }

    for (var i = 0; i < squares.length; i++) {
      var square = squares[i];

      if (square.touched) {
        if (!square.stopIt) {
          if (!square.changed) {
            square.x++;
            square.w -= 2;
          } else {
            square.x--;
            square.w += 2;
          }

          if (square.w <= 0) {
            while (square.w < 0) {
              square.w += 2;
              square.x--;
            }
            square.changed = true;
            square.R = Math.floor(Math.random() * 255);
            square.G = Math.floor(Math.random() * 255);
            square.B = Math.floor(Math.random() * 255);
          } else if (square.w > squareWidth) {
            while (square.w >= squareWidth) {
              square.x++;
              square.w -= 2;
            }
            square.stopIt = true;
          }
        }
      }
    }
  }
</script>

<canvas on:mousemove={updateMousePos} id="canvas" />
<span class="channel-title">_ Uncovered Feelings [ move ] _</span>
