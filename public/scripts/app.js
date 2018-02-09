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


///////// NEW CARDS SUBMIT //////////
  $('#new-card').on('submit', function(event) {

   event.preventDefault();
 // console.log($(this).find('#validationDefault01').val());
 // console.log($('option:selected',this).val());
  //console.log($(this).find('#validationDefault02').val());
 // console.log($(this).find('#validationDefault03').val());
// console.log($(this).serialize())
// console.log($(this))


//     console.log(formDataStr)
   //const formDataStr = $(this).serialize()
   const  cardTitle = $(this).find('#validationDefault01').val();
   const  boardID = $('option:selected',this).val();
   const  newCardULR = $(this).find('#validationDefault02').val();
   const  newCardtags = $(this).find('#validationDefault03').val();
   // const  userid= $(this).cookie('userid');
  console.log("newCardULR " + newCardULR, "boardID " + boardID, "newCardtags" + newCardtags, "cardTitle " +  cardTitle)
// ????  is the this all the above info????
      postCards($(this).serialize())

 });

  function postCards(formDataStr){
   $.ajax({
    url: `/cards`,
    method: 'POST',
    data: formDataStr,
    success: function () {
      $(this).find('#validationDefault01').val(""); //clear  cardTitle
      //$('option:selected',this).val(); //no need to clear selected wheel
      $(this).find('#validationDefault02').val(""); //clear   newCardULR
      $(this).find('#validationDefault03').val("");// clear  newCardtags
      getCards()
              }
   })
  }

  function getCards(){
    $.ajax({
      url: `/cards`,
      method: 'GET',
      success: function (data) {
        console.log(data)
        renderCard(data);
      }
    });
  }

  function renderCard(cards) {
   const cardBoard = $('.card-container');
   cardBoard.empty()
    //prepend to render ontop of old tweets....append would be for bottom
   for(let card in cards) {
    cardBoard.prepend(createCardElement(cards[cards]));
   }
  }

  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function createCardElement (cardObj) {
    $card = $("<article>").addClass("card");
    //do get request to get userId

    let cardInfo = `
      <div class="card" style="width: 18rem;">
        <h5><a  class="card-title" href=${escape(cardObj.user.card.url)}>${escape(cardObj.user.card.title)}</a></h5>
        <img class="card-img-top" src=${img} >
      <div class="card-body">
        <p class="card-tags">${escape(cardObj.user.card.tags)}</p>
      </div>
       <span class="user-name"> Saved by <b> ${cardObj.user.username}</b></span>
          <actions class="card-reaction">
            <i class="fa fa-heart" aria-hidden="true" type="submit"> </i>
            <span class="likes-value"> ${cardObj.user.card.likes} </span>
         </actions>
         </div>
    `;
    $card = $card.append(cardInfo);
    return $card;
  }


});

