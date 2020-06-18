// Juan Álvarez (2012)
// monkeyprojectz.com
// -------------------
$(function () {
	window.addEventListener('load', eventWindowLoaded, false);


	// mode0_circles
	var mode0_circles = [],
		mode0_numCircles, mode0_title = '_ Nonsense Travel [ click / rclick ] _';

	// GRID
	var mode1_squareNumberWidth = 60,
		mode1_squareNumberHeight = 40,
		mode1_squareWidth, mode1_squareHeight, mode1_squareMargin = 3,
		mode1_squares = [],
		mode1_title = '_ Uncovered Feelings [ move ] _';

	// SQUARE
	var mode2_square, mode2_circles = [],
		mode2_eaten_circles = [],
		mode2_drop_circles = [],
		mode2_initialSize = 20,
		mode2_randomChangePercent = 5,
		mode2_title = '_ Disciplined Gluttony [ click ] _';


	// NOMODE
	var nomode_title = '_ Empty Emptiness [] _';


	// WINDOW
	var width = window.innerWidth,
		height = window.innerHeight;


	// MOUSE
	var mousePos = {
		x: width + 10,
		y: height + 10
	};



	// BACKGROUND DEFINITION
	// 0 for mode0_circles
	// 1 for grid
	// 2 for square
	var currentBack = 0;
	var currentBackLimit = 3;

	$('.bottom_left').on('click', function (event) {
		event.stopPropagation();
		currentBack++;
		if (currentBack > currentBackLimit) currentBack = 0;

		initCurrentBack();

	});

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function initCurrentBack() {
		if (currentBack == 0) {
			$('#back_title').html(mode0_title);
			mode0_initialize();
		} else if (currentBack == 1) {
			$('#back_title').html(mode1_title);
			mode1_initialize();
		} else if (currentBack == 2) {
			$('#back_title').html(mode2_title);
			initializeMode2();
		} else {
			$('#back_title').html(nomode_title);
		}
		$('#tv').removeClass('on');
		void $('#tv')[0].offsetWidth; //hack to force reload animation;
		$('#tv').addClass('on');
		$('#channel-number').html(currentBack + 1);
		var audioOn = new Audio('sounds/tv_on.wav');
		audioOn.play();
	}

	const FRAME_RATE = 30;

	function eventWindowLoaded() {
		initCurrentBack();
		canvasApp();
	}

	function canvasApp() {
		var theCanvas = document.getElementById("canvas");
		if (!theCanvas || !theCanvas.getContext) {
			return;
		}
		var context = theCanvas.getContext("2d");
		if (!context) {
			return;
		}

		context.canvas.width = window.innerWidth;
		context.canvas.height = window.innerHeight;

		window.addEventListener('mousemove', function (evt) {
			mousePos = getMousePos(theCanvas, evt);
		}, false);

		window.addEventListener('click', function (evt) {
			if (currentBack == 2) {

				if (!mode2_square.isDropping) {
					mode2_circles[mode2_circles.length] = {
						x: mousePos.x,
						y: mousePos.y,
						R: Math.random() * 255,
						G: Math.random() * 255,
						B: Math.random() * 255,
						angle: Math.PI * 2,
						size: Math.floor(Math.random() * 10 + 1)
					};
				}
			} else if (currentBack == 0) {
				mode0_addNewCircleHere();
			}
		}, false);


		window.addEventListener('contextmenu', function (evt) {
			evt.preventDefault();

			if (currentBack == 0) {
				if (mode0_circles.length > 1) {
					mode0_circles.splice(0, 1);
				}
			}

			return false;
		}, false);

		function updateApp() {
			clearSelection();

			width = window.innerWidth;
			height = window.innerHeight;
			context.canvas.width = window.innerWidth;
			context.canvas.height = window.innerHeight;

			if (currentBack == 0) {
				mode0_update();
				mode0_draw(context);
			} else if (currentBack == 1) {
				mode1_update();
				mode1_draw(context);
			} else if (currentBack == 2) {
				updateMode2();
				drawMode2(context);
			} else {
				context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			}
		};


		var intervalTime = 1000 / FRAME_RATE;
		setInterval(updateApp, intervalTime);
	}


	// MODE 0

	function mode0_initialize() {
		mode0_numCircles = 15;
		while (mode0_circles.length > 0) {
			mode0_circles.pop();
		}
		for (var i = 0; i < mode0_numCircles; i++) {
			mode0_circles[i] = getNewCircle();
		}
	}

	function mode0_addNewCircleHere() {

		var currentSize = Math.floor(Math.random() * 50 + 20);
		var maxSize = Math.floor(Math.random() * 30 + 20);
		var minSize = Math.floor(Math.random() * 10 + 2);

		if (currentSize > maxSize) currentSize = maxSize;
		else if (currentSize < minSize) currentSize = minSize;

		mode0_circles[mode0_circles.length] = {
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
			bounce: (Math.random() > 0.8)
		}
	}


	function mode0_draw(context) {
		//context.fillStyle = 'black';
		//context.fillRect(0,0, context.canvas.width, context.canvas.height);
		for (var i = 0; i < mode0_circles.length; i++) {
			var circle = mode0_circles[i];

			var color = 'rgb(' + Math.floor(circle.R) + ',' + Math.floor(circle.G) + ',' + Math.floor(circle.B) + ')';
			context.fillStyle = color;
			context.strokeStyle = color;
			context.beginPath();
			context.arc(circle.x, circle.y, circle.size, 0, circle.angle, true);
			context.closePath();
			context.stroke();
			context.fill();
		}
	}


	function mode0_update() {

		for (var i = 0; i < mode0_circles.length; i++) {

			var circle = mode0_circles[i];

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

			circle.x = circle.x + circle.speed;
			if (circle.x > width + circle.size) {
				mode0_circles[i] = getNewCircle();
				mode0_circles[i].x = 0 - circle.size;
			}

			//circle.size += (Math.random()*3 + 1);
			//if (circle.size > 100 ) circle.size = Math.random()* 100 + 1;
		}
	}

	// MODE 1

	function mode1_draw(context) {

		for (var i = 0; i < mode1_squares.length; i++) {

			var square = mode1_squares[i];

			context.fillStyle = 'rgb(' + Math.floor(square.R) + ',' + Math.floor(square.G) + ',' + Math.floor(square.B) + ')';
			context.fillRect(square.x, square.y, square.w, square.h);
		}
	}

	function mode1_initialize() {
		// Calculate Width and Height
		mode1_squareWidth = (width - (mode1_squareMargin * (mode1_squareNumberWidth + 1))) / mode1_squareNumberWidth;
		while (mode1_squareWidth < 1) {
			mode1_squareNumberWidth--;
			mode1_squareWidth = (width - (mode1_squareMargin * (mode1_squareNumberWidth + 1))) / mode1_squareNumberWidth;
		}

		mode1_squareHeight = (height - (mode1_squareMargin * (mode1_squareNumberHeight + 1))) / mode1_squareNumberHeight;
		while (mode1_squareHeight < 1) {
			mode1_squareNumberHeight--;
			mode1_squareHeight = (height - (mode1_squareMargin * (mode1_squareNumberHeight + 1))) / mode1_squareNumberHeight;
		}

		for (var i = 0; i < mode1_squareNumberWidth; i++) {
			for (j = 0; j < mode1_squareNumberHeight; j++) {
				var currentX = ((mode1_squareMargin + mode1_squareWidth) * i) + mode1_squareMargin;
				var currentY = ((mode1_squareMargin + mode1_squareHeight) * j) + mode1_squareMargin;

				var index = i + (j * mode1_squareNumberWidth);
				mode1_squares[index] = {
					x: currentX,
					y: currentY,
					w: mode1_squareWidth,
					h: mode1_squareHeight,
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

	function mode1_update() {
		var currentX = mousePos.x;
		var currentY = mousePos.y;
		var i = -1;
		var j = -1;

		while (currentX >= 0) {
			currentX -= (mode1_squareWidth + mode1_squareMargin);
			i++;
		}

		while (currentY >= 0) {
			currentY -= (mode1_squareHeight + mode1_squareMargin);
			j++;
		}

		while (j >= mode1_squareNumberHeight) {
			j--;
		}

		while (i >= mode1_squareNumberWidth) {
			i--;
		}

		var index = (mode1_squareNumberWidth * j) + i;

		if (index >= 0 && index < mode1_squares.length) {
			var square = mode1_squares[index];
			square.touched = true;
		}

		for (var i = 0; i < mode1_squares.length; i++) {
			var square = mode1_squares[i];

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
					} else if (square.w > mode1_squareWidth) {
						while (square.w >= mode1_squareWidth) {
							square.x++;
							square.w -= 2;
						}
						square.stopIt = true;
					}
				}
			}

		}

	}


	// MODE 2

	function initializeMode2() {
		mode2_square = {
			x: Math.floor(Math.random() * (width - mode2_initialSize)),
			y: Math.floor(Math.random() * (height - mode2_initialSize)),
			w: mode2_initialSize,
			h: mode2_initialSize,
			R: Math.floor(Math.random() * 255),
			G: Math.floor(Math.random() * 255),
			B: Math.floor(Math.random() * 255),
			goX: 1,
			goY: 0,
			speed: Math.floor(Math.random() * 5 + 5),
			isDropping: false,
			isVibrating: false,
			isCollapsing: false,
			collapsingTimes: Math.floor(Math.random() * 5 + 2)
		}

		mode2_circles = [];
	}

	function updateMode2() {

		if (mode2_square.isDropping) {
			if (mode2_square.isVibrating) {
				if (!mode2_square.isCollapsing) {
					if ((mode2_square.w < (width / 2) + 100) || (mode2_square.h < (height / 2) + 100)) {
						mode2_square.w += 40;
						mode2_square.x -= 20;
						mode2_square.h += 40;
						mode2_square.y -= 20;
					} else {
						mode2_square.isCollapsing = true;
					}
				} else {
					if ((mode2_square.w > (width / 2)) || (mode2_square.h > (height / 2))) {
						mode2_square.w -= 40;
						mode2_square.x += 20;
						mode2_square.h -= 40;
						mode2_square.y += 20;
					} else {
						mode2_square.isCollapsing = false;
						mode2_square.collapsingTimes--;

						if (mode2_square.collapsingTimes <= 0) {
							mode2_square.isVibrating = false;
						}
					}
				}
			} else {
				initializeMode2();
			}

		} else {
			if (mode2_circles.length == 0) {
				if (Math.floor(Math.random() * 100) < mode2_randomChangePercent) {
					if (mode2_square.goX == 0) {
						mode2_square.goY = 0;
						if (Math.random() > 0.5) mode2_square.goX = 1;
						else mode2_square.goX = -1;
					} else {
						mode2_square.goX = 0;
						if (Math.random() > 0.5) mode2_square.goY = 1;
						else mode2_square.goY = -1;
					}
				} else {
					mode2_square.x += mode2_square.goX * mode2_square.speed;
					mode2_square.y += mode2_square.goY * mode2_square.speed;

					if (mode2_square.x < 0 || mode2_square.x >= (width - mode2_square.w)) {

						mode2_square.x -= mode2_square.goX * mode2_square.speed;
						mode2_square.goX = 0;

						if (Math.random() > 0.5) mode2_square.goY = 1;
						else mode2_square.goY = -1;
					}

					if (mode2_square.y < 0 || mode2_square.y >= (height - mode2_square.h)) {
						mode2_square.y -= mode2_square.goY * mode2_square.speed;
						mode2_square.goY = 0;

						if (Math.random() > 0.5) mode2_square.goX = 1;
						else mode2_square.goX = -1;
					}
				}
			} else {
				var circle = mode2_circles[0];

				if (circle.x + circle.size < mode2_square.x) {
					mode2_square.x -= mode2_square.speed;
				} else if (circle.x - circle.size > mode2_square.x + mode2_square.w) {
					mode2_square.x += mode2_square.speed;
				} else {
					if (circle.y + circle.size < mode2_square.y) {
						mode2_square.y -= mode2_square.speed;
					} else if (circle.y - circle.size > mode2_square.y + mode2_square.h) {
						mode2_square.y += mode2_square.speed;
					} else {
						mode2_square.w += circle.size;
						mode2_square.h += circle.size;
						mode2_square.speed += 1;
						mode2_square.R = circle.R;
						mode2_square.G = circle.G;
						mode2_square.B = circle.B;
						mode2_circles.splice(0, 1);

						if ((mode2_square.w >= width / 2) || (mode2_square.h >= height / 2)) {
							mode2_square.isDropping = true;
							mode2_square.isVibrating = true;
						}
					}
				}

			}
		}
	}

	function drawMode2(context) {
		context.fillStyle = 'rgb(' + Math.floor(mode2_square.R) + ',' + Math.floor(mode2_square.G) + ',' + Math.floor(mode2_square.B) + ')';
		context.fillRect(mode2_square.x, mode2_square.y, mode2_square.w, mode2_square.h);

		for (var i = 0; i < mode2_circles.length; i++) {

			var circle = mode2_circles[i];

			var color = 'rgb(' + Math.floor(circle.R) + ',' + Math.floor(circle.G) + ',' + Math.floor(circle.B) + ')';
			context.fillStyle = color;
			context.strokeStyle = color;
			context.beginPath();
			context.arc(circle.x, circle.y, circle.size, 0, circle.angle, true);
			context.closePath();
			context.stroke();
			context.fill();
		}
	}


	// AUX METHODS


	function getNewCircle() {
		var currentSize = Math.floor(Math.random() * 50 + 20);
		var maxSize = Math.floor(Math.random() * 30 + 20);
		var minSize = Math.floor(Math.random() * 10 + 2);

		if (currentSize > maxSize) currentSize = maxSize;
		else if (currentSize < minSize) currentSize = minSize;

		return {
			x: Math.random() * width,
			y: Math.random() * height,
			R: Math.random() * 255,
			G: Math.random() * 255,
			B: Math.random() * 255,
			angle: Math.PI * 2,
			size: currentSize,
			maxSize: maxSize,
			minSize: minSize,
			speed: Math.random() * 10 + 5,
			intoout: false,
			bounce: (Math.random() > 0.8)
		}
	}

	function getMousePos(canvas, evt) {
		return {
			x: evt.clientX,
			y: evt.clientY
		};
	}

	function isMouseCollidingCircle(circle) {
		var xd = circle.x - mousePos.x;
		var yd = circle.y - mousePos.y;

		var distSqr = Math.sqrt((xd * xd) + (yd * yd));

		if (distSqr <= circle.size) {
			return true;
		}

		return false;
	}


	function isMouseCollidingSquareGrid(square) {
		if ((square.x < mousePos.x && (square.x + square.w) > mousePos.x) && (square.y < mousePos.y && (square.y + square.h) > mousePos.y)) {
			return true;
		}

		return false;
	}


	function clearSelection() {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		} else if (window.getSelection) {
			var sel = window.getSelection();
			sel.removeAllRanges();
		}
	}
});
