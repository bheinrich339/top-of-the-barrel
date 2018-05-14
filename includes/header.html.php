<!DOCTYPE html>
<html>
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title><?= $page_title; ?></title>
      <!-- CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" />
      <link href="css/slicknav.css" type="text/css" rel="stylesheet" media="screen" />
      <link href="css/font-awesome.min.css" type="text/css" rel="stylesheet" media="screen" />
      <link href="css/sweetalert.css" type="text/css" rel="stylesheet" media="screen" />
      <link href="css/styles.css" type="text/css" rel="stylesheet" media="screen" />
      <!-- JS -->
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
      <script src="js/jquery.slicknav.min.js"></script>
      <script src="js/sweetalert.min.js"></script>
      <script src="js/score.min.js"></script>
      <script src="https://www.gstatic.com/firebasejs/3.5.2/firebase.js"></script>
   </head>
   <body>

      <nav class="mobile_nav">
         <ul id="mobile_nav">
            <li><a href="index.php">Home</a></li>
            <li><a href="movie.php">Add a Movie</a></li>
            <li><a href="score.php">View Stats</a></li>
         </ul>
      </nav>

      <header class="text-center">
         <h1>Top of the Barrel</h1>
      </header>

      <main>

         <div class="text-center center-block" id="time_alert">
            <h2>Time Since Watching a Movie:</h2>

            <div id="timer">
               <div>
                  <span id="days"></span>
                  <div class="smalltext">Days</div>
               </div>
               <div>
                  <span id="hours"></span>
                  <div class="smalltext">Hours</div>
               </div>
               <div>
                  <span id="minutes"></span>
                  <div class="smalltext">Minutes</div>
               </div>
               <div>
                  <span id="seconds"></span>
                  <div class="smalltext">Seconds</div>
               </div>
            </div>
            <div class="row">
               <p>Only <span class="bold">14 days</span> can go by before you lose 500 points!</p>
            </div>

         </div>
