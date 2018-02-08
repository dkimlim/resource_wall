$(() => {
  $.get("/api/users", (users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });


  $("#create-new-board").on('click', function (allBoards) {});
  // $.post("/car)ds", (newCard) => {
  //   let templateVars = { };
  // })

  $("#register-button").click(function () {
    $(".register-form").slideToggle("slow");
  });

  $("#login-button").click(function () {
    $(".login-form").slideToggle("slow");
  });

  $("#reveal-new-card").click(function () {
    $("#create-card-section").slideToggle("slow");
  });

  $("#create-new-board").click(function () {
    $("#new-board").slideToggle("slow");
  });


  $("#comment-box-open").click(function () {
    $("#comment-box").slideToggle("slow");
  });

  $("#comments-display").click(function () {
    $(".comment-container").slideToggle("slow");
  });

  $("#logout-button").on('click', function () {
    console.log("logout clicked")
    $.post("/logout", () => {
      console.log("logged out");
      //This redirects the window back to the home page
      window.location.replace("/");
    })
  })

});
