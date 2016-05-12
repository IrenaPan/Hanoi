"use strict";
var isStart = false;
//diskStack is used to record which disks are now on which stick.
var diskStack = [['#disk5', '#disk4', '#disk3', '#disk2', '#disk1'], [], []];
//moves is used to record all movements, then it will be animated.
var moves = [];
var moveParam = undefined;
var widthInterval = 260;
var bottomTop = 0;
var diskHeight = 0;
var moveStarted = false;
var numOfDisks = 5;
var timer = null;

//start funcion
function start(){
	bottomTop = $("#bottom").position().top;
	diskHeight = $(".disk").height();

	if (!moveStarted) {
		moveStarted = true;
		$("button").text("stop");
		hanoi(numOfDisks, 0, 1, 2);
		play();
	}
	else
	{
		$("button").text("start");
		moves = [];
		moveStarted = false;
		clearTimeout(timer);
		for (var i = 1; i <= numOfDisks; i++) {	
			var left = 130 - i * 20, top = 260 + i * 20;
			$("#disk" + i).stop();
			$("#disk" + i).css({left : left, top: top});
		}

		diskStack = [['#disk5', '#disk4', '#disk3', '#disk2', '#disk1'], [], []];
	}
};

function hanoi(n, from, temp, to) {
	if (n == 0) {
		return;
	}

	hanoi(n-1, from, to, temp);
	moveOne(from, to);
	hanoi(n-1, temp, from, to);
}

//move one disk from stick f to stcik t
function moveOne(f, t) {
	var diskToMove = diskStack[f].pop();

	var liftUp = {diskToMove : diskToMove, moveParam : {top: 100}};
	moves.push(liftUp);

	var horizontalOffset = (t - f) * widthInterval;
	var moveHorizontally = {diskToMove : diskToMove, moveParam: {horizontalOffset : horizontalOffset}};
	moves.push(moveHorizontally);

	var newTop = bottomTop - (diskStack[t].length + 1) * (diskHeight + 1);
	var putDown = {diskToMove: diskToMove, moveParam: {top: newTop}};
	moves.push(putDown);

	diskStack[t].push(diskToMove);
}

//animation of all moves
function play() {
	if (moves.length > 0) {
		var oneMove = moves.shift();
		var $diskToMove = $(oneMove.diskToMove);
		if ("top" in oneMove.moveParam) {
			$diskToMove.animate({top: oneMove.moveParam.top}, 200);
		}
		else
		{
			var newLeft = $diskToMove.position().left + oneMove.moveParam.horizontalOffset;
			$($diskToMove).animate({left : newLeft}, 200);
		}
		timer = setTimeout(play, 200);
	}
	else {
		$("button").text("new game");
		setTimeout(function(){alert('move finished')}, 500)
	}

}