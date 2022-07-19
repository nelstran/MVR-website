// var cssVar = window.getComputedStyle(document.body);

//#region SETUP
$(window).resize(setup);

function setup(){
    setIMGSize();
    setColorValue();
}

function setColorValue(){
    $("#bg1").val(rgbToHex($(":root").css('--bg')));
    $("#promoBg").val(rgbToHex($(":root").css('--promo-bg')));
    $("#tsBg").val(rgbToHex($(":root").css('--ts-bg')));
    $("#fontColor").val(rgbToHex($(":root").css('--font-color')));
    $("#navBg").val(rgbToHex($(":root").css('--nav-bg')));

};

function setIMGSize(){
    $(".promoIMG").each(function(){
        var width = $(this).width();
        $(this).css("height", width);
    })
};

//#endregion

//#region HELP FUNCTIONS
function rgbToHex(rgb) {
    var a = rgb.split("(")[1].split(")")[0];
    a = a.split(",");
    var b = a.map(function(x){             //For each array element
        x = parseInt(x).toString(16);      //Convert to a base16 string
        return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
    })
    return "#"+b.join("");
  }
//#endregion

//#region EVENT LISTENER
document.getElementById("topSide").addEventListener("wheel", function(e){
    // prevent the default scrolling event
    e.preventDefault();

    // scroll the div
    document.getElementById("main").scrollBy(e.deltaX, e.deltaY);
});
  
$("#bg1").on("change", function(){
    $(":root").css('--bg', $(this).val());
});
$("#promoBg").on("change", function(){
    $(":root").css('--promo-bg', $(this).val());
});
$("#tsBg").on("change", function(){
    $(":root").css('--ts-bg', $(this).val());
});
$("#fontColor").on("change", function(){
    $(":root").css('--font-color', $(this).val());
});
$("#navBg").on("change", function(){
    $(":root").css('--nav-bg', $(this).val());
});
//#endregion

//THIS IS A TEST DELETE WHEN NEEDED
// $(document).ready(function() {
//     fixedElement = document.getElementById("topSide");
//         $.ajax({
//             url : "package/movie.txt",
//             dataType: "text",
//             success : function (data) {
//                 $(".movie").html(data);
//             }
//         });
// }); 
