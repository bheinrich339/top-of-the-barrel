var firebaseRef;
var last_time;
var score = new Score();
var number_watched = 0;

setInterval(updateTimer, 1000);

var scoretimer = setInterval(lowerScore, 30000);

$(function(e) {
  initFirebase();

  $('#add_title').on('submit', addMovie);

  // hidden easter egg for users if they read through the home page content
  $('#egg').on('click', function() {
    swal('', 'We say "successfully" because you\'ll no doubt be watching some doozies...');
  });

  // same plugin for this project
  $('#mobile_nav').slicknav({
    label: '',
    duration: 500,
    easingOpen: "swing"
  });

  // this is basically what we did in our inclass example
  // the difference is that it's an ajax request within an ajax request
  // and it parses through the JSON for the relevant information
  // one for the information, and the other for the movie poster

  $('#search_title').keyup(function(e) {
    // this one is for the movie information

    // in order to display more than a single movie, i need to make another
    // ajax request for each entry received
    $.get({
      dataType: "json",
      url: "https://www.omdbapi.com/?apikey=201f3de2&t=" + $(this).val() + "&plot=full",
      complete: function(data) {
        if (data.status == 200) {
          movieData = JSON.parse(data.responseText);
          if (movieData.Response == 'False') {
            $('#title_errors').html("<p>We're sorry, but we couldn't find a movie with that title.</p>");

            // clears the results in case there are currently no movies found
            $('#results_title').html('');
            $('#title_pic').html('');
            $('#title_pic_errors').html('');
            $('#add_title').html('');
          } else {
            // this one is for the movie poster
            // uses the IMDb ID received from this
            $.get({
              dataType: "json",
              url: "https://img.omdbapi.com/?apikey=201f3de2&i=" + movieData.imdbID,
              complete: function(data) {
                if (data.status == 200) {
                  $('#title_pic').html('<p class="text-center"><img src="https://img.omdbapi.com/?apikey=201f3de2&i=' + movieData.imdbID + '&h=1000" alt="' + movieData.Title + ' Poster" /></p>');
                  $('#title_pic_errors').html('');
                } else {
                  $('#title_pic_errors').html("<p>No movie poster found.</p>");
                  $('#title_pic').html('');
                }
              }
            });
            // clears the errors div in case there were some before
            $('#title_errors').html('');

            $('#results_title').html(
              "<h3><span class=\"title\">" + movieData.Title + "</span> (<span class=\"year\">" + movieData.Year + "</span>)</h3><p><span class=\"bold\">Rating:</span> <span class=\"rating\">" + movieData.Rated + "</span><br /><span class=\"bold\">Genre:</span> <span class=\"genre\">" + movieData.Genre + "</span><br /><span class=\"bold\">Metascore:</span> <span class=\"score\">" + movieData.Metascore + "</span></p><p>" + movieData.Plot + "</p><input type=\"hidden\" class=\"id\" value=\"" + movieData.imdbID + "\" />"
            );

            $('#add_title').html('<p><input class=\"button\" type=\"submit\" name=\"submit\" id=\"submit\" value=\"Add to Watched List\" /></p>');
          }
        } else {
          $('#title_errors').html("<p>Error: " + data.message + "</p>");
        }
      }
    });
  });

  // so you can't submit the search form and refresh
  $('#title_form').on('submit', function(e) {
    e.preventDefault();
  });

  $('#total_points').html(score.scorecard().score);
});

function initFirebase() {
  var config = {
    apiKey: "AIzaSyBXeqQOJfw_y3iCchCpbo9fMhyeC-2X9FU",
    authDomain: "top-of-the-barrel.firebaseapp.com",
    databaseURL: "https://top-of-the-barrel.firebaseio.com",
    storageBucket: "top-of-the-barrel.appspot.com",
    messagingSenderId: "481370809424"
  };
  firebase.initializeApp(config);

  firebaseRef = firebase.database().ref('/');

  firebaseRef.child('movies').on('child_added', addToTotal);
  firebaseRef.child('badges').on('child_added', addToBadges);

  // sets the last_time variable for the last name a movie was watched
  firebaseRef.once('value').then(function(snapshot) {
    last_time = snapshot.child('timestamp').val();
  });
}

// updates the timestamp that a movie was last watched every time
// a user adds a movie to the watched list
function updateTime() {
  firebaseRef.child('timestamp').set(new Date().getTime());
  last_time = new Date().getTime();
}

// sets the time since a movie was last watched
function addTimer() {
  var t = (new Date()) - last_time;
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

// actually initializes the timer
function updateTimer() {
  var t = addTimer();
  $('#days').html(t.days);
  $('#hours').html(t.hours);
  $('#minutes').html(t.minutes);
  $('#seconds').html(t.seconds);
}

// movies are added in the below two functions
function addMovie(e) {
  e.preventDefault();

  var movie = {
    title: $('.title').html(),
    year: $('.year').html(),
    rating: $('.rating').html(),
    genre: $('.genre').html(),
    score: $('.score').html()
  };

  var id = $('.id').val();

  firebaseRef.once('value').then(function(snapshot) {
    var movie = {
      title: $('.title').html(),
      year: $('.year').html(),
      rating: $('.rating').html(),
      genre: $('.genre').html(),
      score: $('.score').html()
    };

    var id = $('.id').val();
    if (snapshot.hasChild('movies/' + id)) {
      updateTime();
      clearInterval(scoretimer);

      swal({
        title: 'Cheater!',
        text: 'You already watched this movie, so you don\'t get any points. However, we\'ll be nice and reset the timer for you ;)',
        type: 'info'
      });
    } else {
      firebaseRef.child('movies/' + id).set(movie);

      // to see if the batman movies were watched for badges
      var bb = snapshot.hasChild('movies/tt0372784');
      var tdk = snapshot.hasChild('movies/tt0468569');
      var tdkr = snapshot.hasChild('movies/tt1345836');

      // updates score
      score.increment(1000);

      $('#title_pic').html('');
      $('#results_title').html('');
      $('#add_title').html('');
      $('#search_title').val('');

      // updates the firebase timestamp to be the time the movie was added
      updateTime();

      // when the movie is added, they have another 30 seconds before losing 100 points
      clearInterval(scoretimer);

      // creates alerts and redirects to stats page if they choose for a feedback loop
      swal({
          title: '"' + movie.title + '" was added to your watched list, bringing your total score to ' + score.scorecard().score + '!',
          text: "Would you like to view your current statistics?",
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#337ab7",
          confirmButtonText: "Yes, please!",
          closeOnConfirm: false
        },
        function() {
          window.location = 'score.php';
        });

      if (number_watched == 1) {
        var firstwatch = {
          title: 'First Movie',
          desc: 'Watched 1st movie.'
        };
        addBadge(firstwatch);
        swal({
            title: 'You earned a badge!',
            text: 'You got the "First Movie" badge! Now to watch some more! Do you want to view the rest of your stats?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "Yes, please!",
            closeOnConfirm: false
          },
          function() {
            window.location = 'score.php';
          });
      }

      if (number_watched == 10) {
        var filmbuff = {
          title: 'Film Buff',
          desc: 'Watched 10 movies.'
        };
        addBadge(filmbuff);
        swal({
            title: 'You earned a badge!',
            text: 'You got the "Film Buff" badge! You now understand obscure references to them in media. Would you like to view the rest of your stats?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "Yes, please!",
            closeOnConfirm: false
          },
          function() {
            window.location = 'score.php';
          });
      }

      if ((bb === true && tdk === true && id == 'tt1345836') || (bb === true && id == 'tt0468569' && tdkr === true) || (id == 'tt0372784' && tdk === true && tdkr === true)) {
        var batman = {
          title: 'The Hero We Deserve',
          desc: 'Watched The Dark Knight trilogy.'
        };
        addBadge(batman);
        swal({
            title: 'You earned a badge!',
            text: 'You got the "The Hero We Deserve" badge! You now have our permission to die. Would you like to view the rest of your stats?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "Yes, please!",
            closeOnConfirm: false
          },
          function() {
            window.location = 'score.php';
          });
      }

      if (id == 'tt2975590') {
        var bvs = {
          title: 'Save Marrrtthhha!',
          desc: 'Watched Batman v Superman.'
        };
        addBadge(bvs);
        score.increment(1000);
        swal({
            title: 'You earned a badge!',
            text: 'You got the "Save Marrrtthhha!" badge! For watching this pile of trash, you got an additional 1000 points. Would you like to view the rest of your stats?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "Yes, please!",
            closeOnConfirm: false
          },
          function() {
            window.location = 'score.php';
          });
      }

      if (id == 'tt0137523') {
        var fc = {
          title: 'First Rule of Top of the Barrel',
          desc: 'Watched Fight Club.'
        };
        addBadge(fc);
        swal({
            title: 'You earned a badge!',
            text: 'You got the "First Rule of Top of the Barrel" badge! We\'re not sure we should be giving you these points because you broke the first rule... Would you like to view the rest of your stats?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: "#337ab7",
            confirmButtonText: "Yes, please!",
            closeOnConfirm: false
          },
          function() {
            window.location = 'score.php';
          });
      }
    }
  });
}

function addBadge(badge) {
  firebaseRef.child('badges/' + badge.title).set(badge);
}

function addToTotal(snapshot) {
  number_watched++;
  var movie = snapshot.val();
  var li = $('<li>').text(movie.title + ' (' + movie.year + ')');
  $('#list_watched').append(li);

  $('#number_watched').html(number_watched);

  if (number_watched > 0) {
    $('.original_list_text').html('');
  }
}

function addToBadges(snapshot) {
  var badge = snapshot.val();
  $('.original_badge_text').html('');

  $('#total_badges').append('<div class="badge"><p><img src="images/badge.png" alt="Top of the Barrel badge" /></p><h4>' + badge.title + '</h4><p>' + badge.desc + '</p></div>');
}

// lowers score by 100 every 30 seconds they don't watch movie
function lowerScore() {
  if ((score.scorecard().score) > 0) {
    score.decrement(500);
    swal({
      title: "Whoops!",
      text: "You just lost 500 points by slacking on your movie watching. Don't worry, you can still <a href=\"movie.php\">make it up to yourself</a>.",
      type: 'warning',
      html: true
    });
    $('#total_points').html(score.scorecard().score);
  }
}
