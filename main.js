let jokePool=[];

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
}

function onInput(e)
{
    if(e.key=="Enter" || e.key==" ")
    {
	let str=e.target.value.trim();

	if( $('.target').text() == str )
	{
	    $('.target').remove();
	    // when ul is empty
	    if ($('#jokes ul:last-child').children().length == 0 )
		$('#jokes ul:last-child').remove();
	    $('#typing-field').val('');

	    let score=Number($('#score-field').text());
	    $('#score-field').text(String(score+1));
	}
    }
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

    
    if(lastJoke.getBoundingClientRect().bottom  <
       gameOverLine.getBoundingClientRect().y)
    {
	// continue game
	setTimeout(() => gameLoop(joker), 100);
    }
    else
    {
	// GAME OVER
	$('#typing-field').off('keyup');
	clearInterval(joker);
	
	alert("Game over\n score:"+ $('#score-field').text());
    }
}


function startGame()
{
    $('#start-screen').hide();
    $('#game').show();

    
    addJokesToBoard();
    let joker = setInterval(addJokesToBoard, 10000);
    $('#typing-field').on('keyup', onInput);
    $('#score-field').text('0');
    gameLoop(joker);
}

$('#game').hide();
$('#start-button').click(startGame);
fetchJokes();
