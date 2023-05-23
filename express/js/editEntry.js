$("#clearImg").click(function(){
    $("#oldImg").removeAttr("src");
    $("#imgSrc").val("");
    $(this).remove();
})