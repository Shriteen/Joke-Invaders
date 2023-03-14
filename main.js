const Shuffle = window.Shuffle;

let jokePool=[];
let shuffleInstanceArray=[];
let shuffleInstanceOfJokes;

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
	});
}

function addJokesToBoard()
{
    
    const joke = document.createElement('ul');

    if(jokePool.length==0)
    {
	//blocking call
	fetchJokes();
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

    shuffleInstanceArray.push(new Shuffle(joke,{
	itemSelector: '#jokes li',
	columnWidth: (containerWidth)=> containerWidth/7
    }));

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
    }
}

function gameOver()
{
    $('#game-over-score-field').text($('#score-field').text());
    $('#game').hide();
    $('#game-over-screen').show();
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
	shuffleInstanceOfJokes = new Shuffle(document.querySelector('#jokes'), {
	    itemSelector: '.joke',
	});
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
    
    addJokesToBoard();
    let joker = setInterval(addJokesToBoard, 10000);
    $('#typing-field').on('keyup', onInput);
    $('#score-field').text('0');
    gameLoop(joker);
}



fetchJokes();

$('#game').hide();
$('#game-over-screen').hide();

$('#start-button').click(startGame);
$('#restart-button').click(startGame);


