var copiedColor = sessionStorage.getItem("copiedColor");
var hasChanged = false;

// Default colors
var cssVar = [
    $(":root").css("--bg"),
    $(":root").css("--promo-bg"),
    $(":root").css("--ts-bg"),
    $(":root").css("--font-color"),
    $(":root").css("--nav-bg"),
    $(":root").css("--nav-font-color"),
];

//#region SETUP
$(window).resize(setup);

//Mobile keyboard breaks website, this gives the viewport a set height and width
$(setTimeout(function () {
    let viewheight = $(window).height();
    let viewwidth = $(window).width();
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
}, 300));

//Initial setup
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
    $("#contribute-content").css("width", $("#contribute").css("width"));

    $("#contribute-content > li").each(function(i){
        i++;
        $(this).css("transition", `opacity ${i * 75}ms, right ${i * 100}ms`)
    })
};

//Make each image same height, do something else in landscape mode
function setIMGSize(){
    return Promise.all($(".promoIMG").each(function(){
        var width = $(this).width();
        $(this).css("height", width);
    })).then(() =>{
        $(".promoIMG, .event div h2").addClass("visible");
        $(".promoIMG, .event div h2").removeClass("not-visible");
        if(window.innerWidth > window.innerHeight){
            $(".event div p").addClass("visible");
            $(".event div p").removeClass("not-visible");
        }
        else{
            $(".event div p").addClass("not-visible");
        }
    })
};

function setIMGSize(){
    return Promise.all($(".promoIMG").each(function(){
        var width = $(this).width();
        $(this).css("height", width);
    })).then(() =>{
        $(".promoIMG, .event div h2").addClass("visible");
        $(".promoIMG, .event div h2").removeClass("not-visible");
        if(window.innerWidth > window.innerHeight){
            $(".event div p").addClass("visible");
            $(".event div p").removeClass("not-visible");
        }
        else{
            $(".event div p").addClass("not-visible");
        }
    })
};

//#endregion

//#region FUNCTIONS
function toggleImage(event){
    let element = $(event).attr("id").split("-");
    let id = element[1];
    if(element[0] == "image")
        $(`#poster-${id}`).css("display", "flex");
    else
        $(`#poster-${id}`).css("display", "none");
}
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
var didScroll = false;
var lastScroll = 0;
$(window).scroll(function(){
    if(!didScroll){
        let st=$(window).scrollTop();
        let navButton = $("#navbar-button");
        if(lastScroll < st && st > 100){
            navButton.css({
                "position": "fixed",
                "top": "-10em"
            })
        }
        else{
            navButton.css({
                "position": "fixed",
                "top": "0"
            })
        }
        lastScroll = st;
    }
});
var didScroll = false;
var lastScroll = 0;

$(window).scroll(function(){
    if(!didScroll){
        let st=$(window).scrollTop();
        let navButton = $("#navbar-button");
        if(lastScroll < st && st > 100){
            navButton.css({
                "position": "fixed",
                "top": "-10em"
            })
        }
        else{
            navButton.css({
                "position": "fixed",
                "top": "0"
            })
        }
        lastScroll = st;
    }

    didScroll = true;
})
setInterval(function() {
    if ( didScroll ) {
        didScroll = false;
    }
}, 100);
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
    $("#links").css("left", "5em");
    $("#back-button").css("right", 0);
})
$("#back-button").on("click", function(){
    $("#links").css("left", "100vw");
    $("#back-button").css("right", "calc(5em - 100vw)");
    disappear();
})
$("#links > *:not(#contribute > a, #contribute, #back-button)").click(function(e) {
    e.preventDefault();
    $("#back-button").click();
    setTimeout(function (){
        window.location = e.target.href;
    }, $(e.target).css("transition-duration"));
});
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

//#region DROPDOWN MAGIC
var hoverState = false;
var focusState = false;
var drop = false;
$("#contribute").hover(function(){
    appear();
    hoverState = true;
}, function(){
    if(!focusState && !drop)
        disappear();
    hoverState = false;
});
$("#contribute a").focus(function(){        
    appear();
    focusState = true;
});
$("#contribute a").blur(function(){
    var $anchor = $(this).closest('#contribute');
    var inFocus = false;
    setTimeout(function(){
        inFocus = $.contains($anchor[0], document.activeElement);
        if(!inFocus)
            focusState = false;
        if(!focusState && !hoverState && !drop)
            disappear();
    },1);
})
$("#contribute > a").click(function(){
    toggleDropdown();
})
$("#contribute-content > li").on("classChanged", function(){
    let i = $(this).index() + 1;
    if($(this).attr("class") == "show")
        $(this).css("transition", `opacity ${(4-i) * 75}ms, right ${(4-i) * 100}ms`);
    if($(this).attr("class") == "hide")
        $(this).css("transition", `opacity ${i * 75}ms, right ${i * 100}ms`);
})
function toggleDropdown(){
    drop = !drop;
    drop ? appear() : disappear();
}
function appear(){
    $("#contribute-content > li").css("visibility", "visible");
    $("#contribute-content > li").trigger("classChanged");
    $("#contribute-content > li").addClass("show");
    $("#contribute-content > li").removeClass("hide");
    $("#contribute > a").addClass("highlight");
}
function disappear(){
    $("#contribute-content > li").trigger("classChanged");
    $("#contribute-content > li").removeClass("show");
    $("#contribute-content > li").addClass("hide");
    $("#contribute > a").removeClass("highlight");
    setTimeout(function(){
        $("#contribute-content > li").css("visibility", "collapse");
    },225);
}
//#endregion