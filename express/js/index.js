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

// const mainElement = document.getElementById('main');
// const bodyElement = document.body;
// mainElement.addEventListener("scroll", event =>{
//     if(mainElement.scrollTop == 0){
//         bodyElement.style.overflow = auto;
//     }
// })


//THIS IS A TEST DELETE WHEN NEEDED
$(document).ready(function() {
        $.ajax({
            url : "package/movie.txt",
            dataType: "text",
            success : function (data) {
                $(".movie").html(data);
            }
        });
}); 