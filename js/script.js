var params = {
	gameInProgress: false,
	winNumberEnds: 0,
	
	roundNumber: 1,
	results: {
		player: 0,
		computer: 0
	},

	progress: [],
	generateProgressTable: function() {
		var table = '<table>';
		
		this.progress.forEach(row => {
			table += "<tr><td>"
			table += row.join("</td><td>");
			table += "</td></tr>"
		});

		table += "</table>";
		return table;
	}
};

var output = document.getElementById('output');
var resultDiv = document.getElementById('result');
var tableDiv = document.querySelector('#modal-results > .content');
var modalEnd = document.querySelector('#modal-end > .content');

var newGameBtn = document.getElementById('newGame');
var controlsBtns = document.getElementById('controls');

var playableButtons = document.getElementsByClassName('player-move');
for (var i = 0; i < playableButtons.length; i++) {
	playableButtons[i].onclick = function(){
		playerMove(this.getAttribute("data-move"));
	}
}

function OutputText(text, clear, targetElement){
	if(!targetElement)
		targetElement = output;
	
	if(clear)
		targetElement.innerHTML = text + '<br>';
	else
		targetElement.innerHTML = text + '<br>' + targetElement.innerHTML;
}

function newGame(){
	if (params.gameInProgress){
		alert("Game is not over!");
		return;
	}
	
	params.winNumberEnds = prompt('How many wins will end the game?', 5);
	
	if(isNaN(params.winNumberEnds) || params.winNumberEnds == null || params.winNumberEnds == '' || params.winNumberEnds <= 0){
		alert("You have to put the correct number.");
		return;
	}
	
	params.roundNumber = 1;
	params.results = {
		player: 0,
		computer: 0
	}
	params.gameInProgress = true;
	params.progress = [["Round","Player's move","Computer's move","Round winner","Game results"]];
	
	OutputText("New game is started. Somebody needs to win "+params.winNumberEnds+" rounds to end the game!", true);
	OutputText('You: 0 - computer: 0 (to win: '+params.winNumberEnds+')', true, resultDiv);
	OutputText('The game just begin...', true, tableDiv);
	
	newGameBtn.style.display = 'none';
	controlsBtns.style.display = 'inline-block';
}

function roundEnd(state, move, computerMove){
	//state == -1  computer wins
	//state == 0   remis
	//state == 1   player wins
	
	if(!params.gameInProgress){
		OutputText("Game is not in progress, please press the new game button!");
		return;
	}
	
	switch (state){
		case 0:
			OutputText(("ROUND "+(params.roundNumber)+": ")+"REMIS: you and computer played "+computerMove);
			break;
		case -1:
			OutputText(("ROUND "+(params.roundNumber)+": ")+"COMPUTER WON: you played "+move+", computer played "+computerMove);
			params.results.computer++;
			break;
		case 1:
			OutputText(("ROUND "+(params.roundNumber)+": ")+"YOU WON: you played "+move+", computer played "+computerMove);
			params.results.player++;
			break;
	}
	
	OutputText('You: ' + params.results.player + ' - computer: ' + params.results.computer + ' (to win: '+params.winNumberEnds+')', true, resultDiv);
	params.progress.push([params.roundNumber,move,computerMove,(state==0?'remis':(state==1?'player':'computer')),params.results.player + '-' + params.results.computer]);
	
	OutputText(params.generateProgressTable(), true, tableDiv);

	if(params.results.player >= params.winNumberEnds || params.results.computer >= params.winNumberEnds){
		params.gameInProgress = false;
		OutputText("The game has been ended.", false, tableDiv);

		OutputText("==============", true, modalEnd);
		
		if (params.results.player >= params.winNumberEnds)
			OutputText("YOU WON THE ENTIRE GAME!!!", false, modalEnd);
		else
			OutputText("YOU LOOSE THE ENTIRE GAME!!!", false, modalEnd);

		OutputText("==============", false, modalEnd);
		showModalById("modal-end");
		
		newGameBtn.style.display = 'inline-block';
		controlsBtns.style.display = 'none';
	} else {
		params.roundNumber++;
	}
}

function playerMove(move){
	var computerMove = Math.floor(Math.random() * 3) + 1;
	
	computerMove = 
		computerMove == 1 ?
			'paper' :
			(computerMove == 2 ? 'rock' : 'scissors');
	
	switch (computerMove){
		case 'paper':
			if (move == 'paper')
				roundEnd(0, move, computerMove);
			else
			if (move == 'rock')
				roundEnd(-1, move, computerMove);
			else 
				roundEnd(1, move, computerMove);
			break;
			
		case 'rock':
			if (move == 'paper')
				roundEnd(1, move, computerMove);
			else
			if (move == 'rock')
				roundEnd(0, move, computerMove);
			else 
				roundEnd(-1, move, computerMove);
			break;
			
		case 'scissors':
			if (move == 'paper')
				roundEnd(-1, move, computerMove);
			else
			if (move == 'rock')
				roundEnd(1, move, computerMove);
			else 
				roundEnd(0, move, computerMove);
			break;
	}
}