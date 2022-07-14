$(window).resize(setup);

function setup(){
    setIMGSize();
    // setPromoSize();
}
function setIMGSize(){
    
    // $(".event").children().each(function(){
    //     console.log($(this).outerHeight(true));
    //     totalHeight = totalHeight + $(this).outerHeight(true);
    //     console.log(totalHeight);
    // });
    // $("#events .event").css("min-height", totalHeight);

    $(".event img").each(function(){
        var width = $(this).width();
        $(this).css("height", width);
    })
    
    if($(window).height() > $(window).width())
        return;
    
    $(".event").each(function(){
        var totalHeight = 0;
        $(this).children().each(function(){
            totalHeight = totalHeight + $(this).outerHeight(true);
        })
        $(this).css("min-height", totalHeight);
    });
};

// function setPromoSize(){
//     var height = $(window).height() - ($("#promo").offset().top - $(window).scrollTop());
//     $("#promo").css("max-height", height+"px");
// }

// function setPromoScroll(){
//     var pos = $("#promo").offset().top - $(window).scrollTop();
//     console.log(pos <= 1);
//     if(pos <= 1) {
//         $("#promo").css("overflow-y", "auto");
//     } else {
//         // console.log("dkjalf;adf");
//         $("#promo").css("overflow-y", "hidden");
//         // $("#promo").animate({scrollTop:0}, 500);
//     };
// }

// $(function($){
//     $(window).on("scroll", function(){
//         if($(window).height() > $(window).width())
//             return;
//         setPromoSize();
//         setPromoScroll();
//     })
// });



//THIS IS A TEST DELETE WHEN NEEDED
// $(document).ready(function() {
//         $.ajax({
//             url : "package/movie.txt",
//             dataType: "text",
//             success : function (data) {
//                 $(".movie").html(data);
//             }
//         });
// }); 

// const output = document.querySelector("#output");
