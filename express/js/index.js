// var cssVar = window.getComputedStyle(document.body);
var copiedColor;

//#region SETUP
$(window).resize(setup);

function setup(){
    setIMGSize();
    setColorValue();
};

function setColorValue(){
    $('#topSide').css("background-color", `${rgbToHex($(":root").css('--ts-bg'))}7d`);
    $(".customColor input").each(function(){
        let color = rgbToHex($(":root").css(`--${$(this).attr("id")}`));
        $(this).val(color);
    })
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
};
//#endregion

//#region EVENT LISTENER
document.getElementById("topSide").addEventListener("wheel", function(e){
    // prevent the default scrolling event
    e.preventDefault();

    // scroll the div
    document.getElementById("main").scrollBy(e.deltaX, e.deltaY);
});

$(".customColor input").on("change", function(){
    $(":root").css(`--${$(this).attr("id")}`, $(this).val());
    
});

$("#ts-bg").on("change", function(){
    $('#topSide').css("background-color", `${$(this).val()}7d`);
});

$(".copy").on("click", function(){
    let attr = $(this).attr("for");
    $(".copy").removeAttr("disabled");
    $(".paste").attr("disabled", false);
    $(this).attr("disabled", true);
    let color = $(`#${attr}`);
    copiedColor = color.val();
});

$(".paste").on("click", function(){
    let attr = $(this).attr("for");
    let color = $(`#${attr}`);
    color.val(copiedColor);
    color.trigger("change");
})
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
