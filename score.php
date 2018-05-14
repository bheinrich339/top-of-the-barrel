<?php
   $page_title = "Statistics";
   require_once('includes/header.html.php');
?>

   <div class="center-block">

      <h3>Total Movies Watched: <span id="number_watched">0</span></h3>

      <hr />

      <h3>Movies Watched:</h3>

      <p class="original_list_text">None</p>

      <ul id="list_watched">
      </ul>

      <hr />

      <h3>Points: <span id="total_points"></span></h3>

      <hr />

      <h3>List of Badges:</h3>

      <div id="total_badges">
         <p class="original_badge_text">None</p>
      </div>

   </div>

<?php require_once('includes/footer.html.php'); ?>
