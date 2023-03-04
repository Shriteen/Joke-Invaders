setitem = (data) =>{
    let item = JSON.parse(JSON.stringify(data));
    let jokearray = item.joke.split(" ");
    console.log(jokearray)
}

fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single")
 .then((response) => response.json())
 .then((data) => setitem(data));

 



