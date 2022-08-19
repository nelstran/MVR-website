$("#SSN input, #credit input").keypress(function (event){
    return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57));
});
$("#CC").keyup(function(event){
    var text = $(this).val().split(" ").join("");
    if(text.length > 0){
        text = text.match(new RegExp('.{1,4}', 'g')).join(" ");
    }
    $(this).val(text);
});
$("#SSN input").keyup(function (event) {
    if (this.value.length == this.maxLength)
        $(this).next('#SSN input').focus();
    if(event.keyCode == 8 && this.value.length == 0)
        $(this).prev('#SSN input').focus();
});
$("#joinButton").click(function(e){
    if($("#first").val().length > 0 &&
        $("#last").val().length > 0 &&
        $("#mail").val().length > 0 &&
        $("#mail").is(":valid")){
            $("form > *").css("display", "none");
            $("form > h1").css("display", "block");
    }
    else{
        $("label[for=first]").addClass("animate");
        $("#require").css("display", "block");
    }
    return false;
});

$("label[for=first]").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (){
    $(this).removeClass("animate");
})