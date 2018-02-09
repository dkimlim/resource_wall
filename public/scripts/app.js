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
    $("#add-board-button").slideToggle("slow");
  });
//THIS IS THE NEW CARD////
  function createCardElement (cardObj) {
    $card = $("<article>").addClass("card");

    let cardInfo = `

<div class="card" style="width: 18rem;">
    <h5><a  class="card-title" href=${cardObj.user.card.url}>Card Title</a></h5>
  <img class="card-img-top" src=${cardObj.user.card.img} >
  <div class="card-body">

    <p class="card-tags">${cardObj.user.card.tags}</p>
  </div>
   <span class="user-name"> Saved by <b> ${cardObj.user.username}</b></span>
      <actions class="card-reaction">
        <i class="fa fa-heart" aria-hidden="true" type="submit"> </i>
        <span class="likes-value"> ${cardObj.user.card.likes} </span>
     </actions>
`;

    $card = $card.append(cardInfo);
    return $card;
  }

  function renderCard(cards) {
   const cardBoard = $('.card-container');
   cardBoard.empty()
    //prepend to render ontop of old tweets....append would be for bottom
   for(let card in cards) {
    cardBoard.prepend(createTweetElement(tweets[tweet]));
   }
  }

///////// NEW CARDS SUBMIT //////////

$('.dropdown-item').click(function(){

  //add a function to stop sumit if any feilds empty

   var newCardULR = $('#card-title-text').val('');
   var boardName = $(this).parent().data('id'),
   var userid= $.cookie('userid');
   var newCardtags = $('#card-tags-text').val('');

   console.log(newCardULR, boardName, userid)

 function postCards(formDataStr){
   $.ajax({
    url: `/cards`,
    method: 'POST',
    data: formDataStr,
    success: function () {
     $('#text-area').val('');
      getCards()
              }
   })
  }

  function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
  }
//#3
  function getCards(){
    $.ajax({
      url: `/cards`,
      method: 'GET',
      success: function (data) {
        console.log(data)
        renderCards(data);
      }
    });
  }
}




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
