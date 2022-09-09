$(document).ready(function(){
    resize();

    var colc = new Colcade('.grid', {
        columns: '.grid-col',
        items: '.grid-item'
    });
})
$(window).resize(resize)
function resize(){
    var max = $(".grid-item").length > 3 ? 3 : $(".grid-item").length;
    let winWid = $(window).width();
    let num = 1;
    if(winWid >= 800)
        num = 3;
    if(winWid < 800)
        num = 2;
    if(winWid < 500)
        num = 1;
    var wid = 1 / num * 100;
    num = num > max ? max : num;
    for(let i = 1; i <= num; i++){
        $(`.grid-col--${i}`).css("display", "block");

        $(`.grid-col--${i}`).css("width", wid + "%");
    }
    for(let i = 4; i > num; i--)
        $(`.grid-col--${i}`).css("display", "none");
}