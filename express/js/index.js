var cssVar = window.getComputedStyle(document.body);

$(window).resize(setup);

document.getElementById("topSide").addEventListener("wheel", function(e){
  // prevent the default scrolling event
  e.preventDefault();

  // scroll the div
  document.getElementById("main").scrollBy(e.deltaX, e.deltaY);
});

// var didScroll;// on scroll, let the interval function know the user has scrolled

// $(window).scroll(function(event){
//     didScroll = true;
// });

// setInterval(function() {
//     if (didScroll) {
//       hasScrolled();
//       didScroll = false;
//     }
// }, 100);

// var scrollPos = 0;

// function hasScrolled() {
//     // console.log($(window).scrollTop() <= scrollPos);
//     if($(window).scrollTop() <= scrollPos){
//         $("#topSide").css("position","fixed");
//         $("#topSide").css("top","0px");

//         // $("#topSide").animate({top:"0px"}, 100);
//     }
//     else{
//         $("#topSide").css("position","static");
//         $("#topSide").css("top",`-${cssVar.getPropertyValue('--ts-Height')}`);
//         // $("#topSide").animate({top:`-${cssVar.getPropertyValue('--ts-Height')}`}, 100);
//     }
//     scrollPos = $(window).scrollTop();
// }

function setup(){
    setIMGSize();
}
function setIMGSize(){
    $(".promoIMG").each(function(){
        var width = $(this).width();
        $(this).css("height", width);

    })
    
    if($(window).height() > $(window).width())
        return;
    
    $(".event").each(function(){
        // var totalHeight = 0;
        // $(this).children().each(function(){
        //     totalHeight = totalHeight + $(this).outerHeight(true);
        //     console.log($(this).outerHeight(true));
        // });
        // console.log(totalHeight);
        // $(this).css("min-height", totalHeight+"px");
    });
};

//THIS IS A TEST DELETE WHEN NEEDED
$(document).ready(function() {
    fixedElement = document.getElementById("topSide");
        $.ajax({
            url : "package/movie.txt",
            dataType: "text",
            success : function (data) {
                $(".movie").html(data);
            }
        });
}); 

// const output = document.querySelector("#output");
