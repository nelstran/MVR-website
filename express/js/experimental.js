$("#events").on("scroll", function(){
    var arrow = $(".overflow-indicator").eq(0);
    var scrollHeight = $(this).scrollTop();
    var scrollWidth = $(this).scrollLeft();
    // Portrait
    if(window.innerHeight > window.innerWidth){
        if(scrollWidth >= (arrow.width() * 4)){
            $("#overflow-begin").css("display", "flex");
        }
        else{
            $("#overflow-begin").css("display", "none");
        }
        if(scrollWidth <= ($("#events").prop("scrollWidth")-$(this).width() - (arrow.width() * 4))){
            $("#overflow-end").css("display", "flex");
        }
        else{
            $("#overflow-end").css("display", "none");
        }
    }

    // Landscape
    if(window.innerHeight <  window.innerWidth){
        if(scrollHeight >= (arrow.height() * 8)){
            $("#overflow-begin").css("display", "flex");
        }
        else{
            $("#overflow-begin").css("display", "none");
        }
        if(scrollHeight <= ($("#events").prop("scrollHeight")-$(this).height() - (arrow.height() * 8))){
            $("#overflow-end").css("display", "flex");
        }
        else{
            $("#overflow-end").css("display", "none");
        }
    }

    // console.log(arrow.height());
    // console.log($(this).scrollTop());

})

$(document).ready(function(){
    $("body").css({
        "filter": "brightness(100%)",
        "transition": ".15s"
    });
});

function hexShade(hexColor, magnitude){
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
}