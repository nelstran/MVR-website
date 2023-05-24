//Remove image from post
$("#clearImg").click(function(){
    $("#oldImg").removeAttr("src");
    $("#imgSrc").val("");
    $(this).remove();
})