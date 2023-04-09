const Shuffle = window.Shuffle;

let jokePool=[];
let shuffleInstanceArray=[];
let shuffleInstanceOfJokes;

const wrongSound= document.querySelector('#audioWrongInput');
const gameOverSound= document.querySelector('#audioGameOver');

//Music On/Off
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
//Sound effects on off
const soundEffectSwitch = document.getElementById('soundEffectBtn');

let musicTracks= ['Kevin MacLeod - Dungeon Boss.opus',
		  'Kevin MacLeod - Itty Bitty.m4a',
		  'Kevin MacLeod - Pixelland.m4a'];

let difficultyTimeInterval=18000;

function fetchJokes()
{
    fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single&amount=10")
	.then((response)=> response.json())
	.then((data)=>{	    
	    for( j of data.jokes )
	    {
		let joke=j.joke;
		
		//replace problematic characters
		joke= joke.replace('“','"');
		joke= joke.replace('”','"');
		joke= joke.replace("‘","'");
		joke= joke.replace("’","'");
		joke= joke.replace("ö","o");
		
		let arr = joke.split(/\s+/);
		if(arr.length<=28)
		    jokePool.push(joke);
		
	    }
	}).catch((err)=> {
	    alert('There seems to be some error🙁\nTry checking your Internet connection and Refresh');
	});
}

function addJokesToBoard()
{
    
    const joke = document.createElement('ul');

    if(jokePool.length==0)
    {
	fetchJokes();
	// we want to have blocking call.
	
	// when there is no joke, start fetching and then come back in
	// 1 second, Even though we are returning and there is no
	// value associated with function and it's any-ways called
	// asynchronously, so no problem.
	setTimeout(addJokesToBoard,1000);
	return;
    }
    if(jokePool.length<=3)
    {
	//fetch more asynchronously
	setTimeout(fetchJokes, 10);
    }

    //jokepool is sure to have atleast one joke
    let jokeText = jokePool.shift();
    let arr = jokeText.split(/\s+/);
    for (i of arr) {
	let temp = document.createElement('li');
	temp.textContent = i;
	joke.append(temp);
    }
    $('#jokes').prepend(joke);
    $('#jokes>ul').addClass('joke');

    try {
	shuffleInstanceArray.push(new Shuffle(joke,{
	    itemSelector: '#jokes li',
	    columnWidth: (containerWidth)=> containerWidth/7
	}));
    }
    catch(err)
    {
	alert('There seems to be some error🙁\nTry checking your Internet connection and Refresh');
    }
    //code in gameloop should have been here
    // shuffleInstanceOfJokes = new Shuffle(document.querySelector('#jokes'), {
    // 	itemSelector: '.joke',
    // });
}

function onInput(e)
{
    if(e.key=="Enter" || e.key==" ")
    {
	let str=e.target.value.trim();

	if( $('.target').text() == str )
	{
	    shuffleInstanceArray[0].remove($('.target'));
	    $('.target').remove();
	    
	    // when ul is empty
	    if ($('#jokes ul:last-child').children().length == 0 )
	    {
		$('#jokes ul:last-child').remove();
		shuffleInstanceArray.shift();
	    }
	    $('#typing-field').val('');

	    let score=Number($('#score-field').text());
	    $('#score-field').text(String(score+1));
	}
	else
	{
	    if($('#soundEffectBtn.on').length)	    
		wrongSound.play();
	}
    }
}

function gameOver()
{
    $('#game-over-score-field').text($('#score-field').text());
    $('#game').hide();
    $('#game-over-screen').show();

    if($('#soundEffectBtn.on').length)
	gameOverSound.play();
}

function gameLoop(joker)
{
    let lastJoke= document.querySelector('#jokes ul:last-child');
    // if all words are cleared then lastJoke is null, just continue in this case
    if(!lastJoke)
    {
	setTimeout(() => gameLoop(joker), 100);
	return;
    }
    
    let gameOverLine= document.querySelector('#game-over-line');

    $('#jokes ul:last-child > li:first-child').addClass('target');
    $('#target-field').text($('.target').text());
    
    if(lastJoke.getBoundingClientRect().bottom  <
       gameOverLine.getBoundingClientRect().y)
    {
	// continue game
	setTimeout(() => gameLoop(joker), 100);

	/* ============================================================
	  The following joke should have been in addJokesToBoard
	   function, but it gives a bug that the first joke is not
	   visible after play again till second joke is loaded.
	   Putting it here works. I believe since this function runs
	   every 100ms it avoids some kind of race condition.
	 */
	delete shuffleInstanceOfJokes;

	try {
	    shuffleInstanceOfJokes = new Shuffle(document.querySelector('#jokes'), {
		itemSelector: '.joke',
	    });   
	}
	catch (err)
	{
	    alert('There seems to be some error🙁\nTry checking your Internet connection and Refresh');
	}
	
	// ============================================================
    }
    else
    {
	// GAME OVER
	$('#typing-field').off('keyup');
	clearInterval(joker);	
	gameOver();
    }
}


function startGame()
{
    $('#start-screen').hide();
    $('#game-over-screen').hide();
    $('#game').show();
    $('#jokes').empty();
    shuffleInstanceArray=[];
    $('#typing-field').val('').focus();

    if($('#playPauseBtn.on').length)
	audioPlayer.play();

    addJokesToBoard();
    let joker = setInterval(addJokesToBoard, difficultyTimeInterval);
    $('#typing-field').on('keyup', onInput);
    $('#score-field').text('0');
    gameLoop(joker);
}

function toggleMusic()
{
    if (audioPlayer.paused) {
	audioPlayer.play();
	playPauseBtn.alt = "Pause";	
	$('#playPauseBtn').removeClass('off').addClass('on');
    }
    else
    {
	audioPlayer.pause();
	playPauseBtn.alt = "Play";
	$('#playPauseBtn').removeClass('on').addClass('off');
    }

    if($('#typing-field').is(":visible"))
	$('#typing-field').focus();
}

function toggleSound()
{
    $('#soundEffectBtn').toggleClass('on').toggleClass('off');

    if($('#typing-field').is(":visible"))
	$('#typing-field').focus();
}

function changeTrack()
{
    let track = 'assets/music/' + musicTracks[Math.floor(Math.random()*musicTracks.length)];
    audioPlayer.src=track;
}

function updateDifficulty()
{
    let difficulty=$('#difficulty-level').val();
    switch(difficulty)
    {
	case "E":
	difficultyTimeInterval=18000;
	break;

	case "M":
	difficultyTimeInterval=12000;
	break;

	case "H":
	difficultyTimeInterval=8000;
	break;
    }
}

updateDifficulty();
$('#difficulty-level').change(updateDifficulty);

fetchJokes();
changeTrack();

$('#game').hide();
$('#game-over-screen').hide();

$('#start-button').click(startGame);
$('#restart-button').click(startGame);

$('#playPauseBtn').click(toggleMusic);
$('#soundEffectBtn').click(toggleSound);

document.querySelector('#audioPlayer').addEventListener('ended', changeTrack);

    
