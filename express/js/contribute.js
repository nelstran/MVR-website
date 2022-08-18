$("#SSN input").keypress(function (event){
    return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57));
})

$("#SSN input").keyup(function (event) {
    if (this.value.length == this.maxLength)
        $(this).next('#SSN input').focus();
    if(event.keyCode == 8 && this.value.length == 0)
        $(this).prev('#SSN input').focus();
});
$("#joinButton").click(function(e){
    if($("#first").val().length > 0 &&
        $("#last").val().length > 0 &&
        $("#mail").is(":valid")){
            $("form > *").css("display", "none");
            $("form > h1").css("display", "block");
    }
    return false;
});