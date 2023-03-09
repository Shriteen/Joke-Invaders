function stubForJokes()
{
    const joke = document.createElement('ul');
    fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single")
     .then((response) => response.json())
     .then((data) =>{
        let arr = data.joke.split(" ")
        for (i of arr) {
        let temp = document.createElement('li');
        temp.textContent = i;
        joke.append(temp);
        }
        $('#jokes').prepend(joke)});
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
    let startdiv=document.getElementById("start");
    let gamediv=document.getElementById("game");
    startdiv.style.display="none";
    gamediv.style.display="block";

    stubForJokes();
    let joker = setInterval(stubForJokes, 3000);
    $('#typing-field').on('keyup', onInput);
    $('#score-field').text('0');
    gameLoop(joker);
}

