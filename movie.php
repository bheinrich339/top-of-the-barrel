<?php
   $page_title = "Add a Movie";
   require_once('includes/header.html.php');
?>

   <div class="center-block">
      <h2>Search by Movie Title</h2>
      <p class="search_info">Start typing in the search box to find the movie you watched!</p>
      <form method="post" action="" id="title_form">
         <input type="text" name="search_title" id="search_title" placeholder="Search by Title" />
         <button type="submit" class="search_btn"><i class="fa fa-search"></i></button>
      </form>
      <div id="title_pic"></div>
      <div id="title_pic_errors" class="errors"></div>
      <div id="results_title"></div>
      <form id="add_title" method="post" action="">
      </form>
      <div id="title_errors" class="errors"></div>
   </div>

<?php require_once('includes/footer.html.php'); ?>
