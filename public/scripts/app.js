$(() => {
  $.get("/api/users", (users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });


  $("#create-new-board").on('click', function (allBoards) {
    // $.post("/cards", (newCard) => {
    //   let templateVars = { };
    // })

  });

  $("#reveal-new-card").click(function(){
     $("#create-card").slideToggle("slow");
    });

  $("#create-new-board").click(function(){
    $("#new-board").slideToggle("slow");
     });
});