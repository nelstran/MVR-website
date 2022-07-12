$(window).resize(setHeight);

function setHeight(){
    
    // $(".event").children().each(function(){
    //     console.log($(this).outerHeight(true));
    //     totalHeight = totalHeight + $(this).outerHeight(true);
    //     console.log(totalHeight);
    // });
    // $("#events .event").css("min-height", totalHeight);

    $(".event").each(function(){
        var totalHeight = 0;

        $(this).children().each(function(){
            totalHeight = totalHeight + $(this).outerHeight(true);
        })
        $(this).css("min-height", totalHeight);
    });
};



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

$(window).scroll(function(){
    var scrollPos = $(document).scrollTop();
    console.log(scrollPos);
});