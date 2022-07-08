
$(window).resize(function(){
    
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
});