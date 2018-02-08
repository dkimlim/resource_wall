$( document ).ready(function() {

   var likesCount = 0
   $('like-card').on('submit', function() {

     var likesCount = likesCount =+ 1;

     if(likesCount >= 0){
       $(this).siblings("#likes-value").html(likesCount)
       .css("color", "grey");
      } else {
       $(this).siblings("#likes-value").html(likesCount)
      .css("display: hidden");
    }
   });
});
