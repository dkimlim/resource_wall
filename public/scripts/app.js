$(() => {
  $.get("/api/users", (users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  $("#create-new-board").on('click', function (allBoards) { });
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
///////

  $('.new-card').on('submit', function (event) {

   event.preventDefault();
    console.log($(this).find('#card-title-text').val())
   // console.log($(this).find('#card-ulr').val()
  //  console.log($(this).find('#card-tags-text.form-control').val()
   //    console.log($(this).cookie('userid');

   const  boardName = $(this).find('#card-title-text').val()
   const  newCardULR = $(this).find('#card-ulr').val();
  // const  userid= $(this).cookie('userid');
   const  newCardtags = $(this).find('#card-tags-text.form-control').val();

console.log("newCardULR " + newCardULR, "boardName" + boardName, "userid" + userid, "newCardtags" + newCardtags)
/*
    const errorMessage = validateFormData(formDataStr);
    console.log(errorMessage)
    if(errorMessage){
     alert(errorMessage)
    } else {

// ????  is the this all the above info????
      postCards($(this).serialize())
  }*/
 });


});

/*

//THIS IS THE NEW CARD ////
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
    cardBoard.prepend(createCardElement(cards[cards]));
   }
  }

//#2 1.a
  function postTweets(formDataStr){
   $.ajax({
    url: `/tweets`,
    method: 'POST',
    data: formDataStr,
    success: function () {
     $('#text-area').val('');
      getTweets()
              }
   })
  }

  function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
  }
//#3
  function getTweets(){
    $.ajax({
      url: `/tweets`,
      method: 'GET',
      success: function (data) {
        console.log(data)
        renderTweets(data);
      }
    });
  }

//#1.b Discern appropriate ERROR message for empty tweet or too many characters
  function validateFormData (text) {
    console.log(text)
    let errorMessage = ""
     if(text == ""){
      errorMessage = "your tweet is empty"
     } else if (text.length > 140){
       errorMessage = "your tweet is too long"
     }
     return errorMessage
  }
///////// NEW CARDS SUBMIT //////////

 $('.create-card').on('submit', function (event) {

   event.preventDefault();
// ????  is the this the value of the drop down selected?????
   const  boardName = $(this).val(),
   const  newCardULR = $('#card-title-text').val();
   const  userid= $.cookie('userid');
   const  newCardtags = $('#card-tags-text').val();

console.log("newCardULR " + newCardULR, "boardName" + boardName, "userid" + userid, "newCardtags" + newCardtags)

    const errorMessage = validateFormData(formDataStr);
    console.log(errorMessage)
    if(errorMessage){
     alert(errorMessage)
    } else {

// ????  is the this all the above info????
      postCards($(this).serialize())
  }
 });


*/




