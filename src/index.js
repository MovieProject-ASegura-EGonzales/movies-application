const $ = require('jquery');
import sayHello from './hello';
sayHello('World');


const {getMovies} = require('./api.js');

$(document).ready(() => {
    setTimeout(() => {  // Timer with a delay of 1.2 seconds.  API delay is the same.
    $('.message').remove(); // Removes "loading" message from screen
    $('<h1>The Movie App</h1><br>').appendTo(".addTest");
        $('#main').removeClass('hidden');
        $('#listMovies').removeClass('hidden');
        $('form').removeClass('hidden');
    }, 1200)
});

listAndTable();

const url = "/api/movies";

const postMovies = (movie, rating) => {
    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({title: movie, rating: rating})
    }).then(function (response) {
        $('#instertMovies').empty();
        return response.json();
    })
}

function listAndTable(){
    $('<table id="listMovies" class="listTable hidden table-striped" align="center" style="width: 100%">\n' +
        '<thead class="thead-dark">\n' +
        '<tr>\n' +
        // '<th>ID</th>\n' +
        '<th>Name</th>\n' +
        '<th>Rating</th>\n' +
        '</tr>\n' +
        '</thead>\n' +
        '<tbody id="instertMovies"></tbody>\n' +
        '</table>').appendTo('.movies');
        tableLoad();
}

function tableLoad(){
    getMovies().then((movies) => {
        // $('<h2>Here are all the Movies</h2>').appendTo('.addTest');
        movies.forEach(({title, rating, id}) => {
            let htmlString = "";
            htmlString += "<tr>";
            // htmlString += "<td>" + id + "</td>";
            htmlString += "<td>" + title + "</td>";
            htmlString += "<td>" + rating + "</td>";
            htmlString += "</tr>";
            console.log(`id#${id} - ${title} - rating: ${rating}`);
            $('#instertMovies').append(htmlString);
        });
        movies.forEach(({title, rating, id}) => {
            let htmlString = "";
            // htmlString += "<a class=\"moviesDroped dropdown-item\" href=\"#\">" + id + "  " + title + "</a>";
            htmlString += "<a class=\"moviesDroped dropdown-item\" href=\"#\">" + title + "</a>";
            $('#dropMovies').append(htmlString);
        });
    movieEditLoad();
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.')
        console.log(error);
    });
}

let rating = [];
function submitMovies() {
    let content = $("#movieInput").val();
    let ratingNew = rating.toString();
    console.log(ratingNew);

    if (content) {
        postMovies(content,ratingNew);
    } else {
        alert('Please enter a movie to POST.');
    }
}

function delayMessage() {
    $('#load_screen').addClass('.show');
    setTimeout(()=>{
        $('#load_screen').remove();
    },1200);
}

// SUBMIT BUTTONS
$("#submit").click(function() {
    delayMessage();
    submitMovies();
    location.reload();
});

// Delete Movie
$("#delete").click(function() {
    delayMessage();
    let movieNametoDelete = movieDropdown.toString();
    deleteData(movieNametoDelete);
    location.reload();
});

$("#dropMovies").click(function() {
    delayMessage();
    sendStringToBox();
    let movieNametoDelete = movieDropdown.toString();
    deleteData(movieNametoDelete);
    movieDropdown.pop();
});

let sendStringToBox = () => {
    let movieNametoEdit = movieDropdown.toString();
    console.log("This is from sendStringToBox: " + movieNametoEdit);
    $('#movieInput').val(movieNametoEdit);
}

// Logic for rating dropdown
let ratings = $('.dropdown-item');
ratings = Array.from(ratings);
    ratings.forEach(function (element) {
        element.addEventListener('click', () => {
            var selection = element.innerText;
            console.log(selection);
            rating.push(selection);
        });
    });

let movieDropdown = []; // array to hold the values of the dropdown values.

const movieEditLoad = () => {
    let moviesDropdown = $('.moviesDroped'); //class moviesDroped
    moviesDropdown = Array.from(moviesDropdown); //send info to array

    moviesDropdown.forEach(function (element) {
        element.addEventListener('click', function() {
            var selection = element.innerText;
            console.log(selection);
            movieDropdown.push(selection);
        });
    });
}

let deleteData = (movie) => {
    getMovies().then((movies) => {
        movies.forEach(({title, rating, id}) => {
            if (movie === title) {
                return fetch(url + '/' + id,{
                    method: 'delete',
                    headers: {
                        'Content-Type': 'application/json'}
                }).then(response => response.json());
            }
        });
});
}




