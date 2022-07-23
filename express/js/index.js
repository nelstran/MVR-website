
var copiedColor = sessionStorage.getItem("copiedColor");
var hasChanged = false;

//From :root
var cssVar = [
    "#000000",
    "#2c2c2c",
    "#56c1ff",
    "#ffffff",
    "#000000",
    "#56c1ff",
];

//#region SETUP
$(window).resize(setup);

function setup(){
    if(!hasChanged){
        if(window.innerWidth > window.innerHeight){
            $(":root").css({
                "--nav-bg" : "#000000",
                "--nav-font-color" : "#56c1ff"
            })
            cssVar[4] = "#000000";
            cssVar[5] = "#56c1ff";
        }
        else{
            $(":root").css({
                "--nav-bg" : "#2c92ce",
                "--nav-font-color" : "#000000"
            })
            cssVar[4] = "#2c92ce";
            cssVar[5] = "#000000";
        }
    }
    if(!copiedColor){
        $(".paste").attr("disabled", true);
    }
    setIMGSize();
    setColorValue();
    darkenNavColor();
};

function setIMGSize(){
    $(".promoIMG").each(function(){
        var width = $(this).width();
        $(this).css("height", width);
    })
};

//#endregion

//#region HELPER FUNCTIONS

function darkenNavColor(){
    let color = $(":root").css("--nav-bg");
    $(":root").css("--nav-bg-dark", shadeColor(color, -25));
}
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
function setColorValue(){
    var cache = sessionStorage.getItem("ts-bg");
    var color = cache != null ? cache : $(":root").css('--ts-bg');

    $('#topSide').css("background-color", `${color}7d`);

    $(".customColor input").each(function(){
        let curr = $(this).attr("id");
        cache = sessionStorage.getItem(`${curr}`);

        if(cache){
            color = cache;
            $(":root").css(`--${curr}`, color);
        }
        else{
            color = $(":root").css(`--${curr}`);
        }

        $(this).val(color);
    })
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
    sessionStorage.setItem(`${$(this).attr("id")}`, $(this).val());

    $(":root").css(`--${$(this).attr("id")}`, $(this).val());

    if($(this).attr("id") == "nav-bg"){
        darkenNavColor();
    }
});

$("#ts-bg").on("change", function(){
    $('#topSide').css("background-color", `${$(this).val()}7d`);
});

$(".copy").on("click", function(){
    let attr = $(this).attr("for");
    let color = $(`#${attr}`);

    $(".copy").removeAttr("disabled");
    $(".paste").attr("disabled", false);
    $(this).attr("disabled", true);

    copiedColor = color.val();
    sessionStorage.setItem("copiedColor", copiedColor);
});

$(".paste").on("click", function(){
    let attr = $(this).attr("for");
    let color = $(`#${attr}`);

    color.val(copiedColor);
    color.trigger("change");
})

$("#navbar-button").on("click", function(){
    $("#links").css("right", 0);
    $("#back-button").css("right", 0);
})
$("#links > *").on("click", function(){
    $("#links").css("right", "calc( -1 * (100vw - 5em))");
    $("#back-button").css("right", "calc( -1 * (100vw - 5em))");
})

$("#defaultButton").on("click", function(){
    $(".customColor input").each(function(i){
        let color = cssVar[i];
        let id = $(this).attr("id");
        sessionStorage.setItem(`${id}`, color);

        $(":root").css(id, color);
        $(this).val(color);
        $(this).trigger("change");
    });
});

let display = true;
$("#closeButton").on("click", function(){
    let prop = display ? "none" : "block";
    let text = display ? "Open" : "Close";
    $(".customColor").each(function(){
        $(this).css("display",prop);
    });
    $(this).text(text);
    display = !display;

})
//#endregion

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
