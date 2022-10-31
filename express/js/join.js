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
    let forms = [$("#first"), $("#last"), $("#mail")];
    let valid = [
        forms[0].val().length > 0,
        forms[1].val().length > 0,
        forms[2].val().length > 0 && forms[2].is(":valid")
    ];
    if(valid.every(bool => bool == true)){
            $("form > *").css("display", "none");
            $("form > h1").css("display", "block");
    }
    else{
        let scrollToForm = null;
        for(let i = 0; i < valid.length; i++){
            let formID = forms[i].attr('id');
            if(!valid[i]){
                $(`label[for=${formID}]`).addClass("animate");
                $(`label[for=${formID}]`).css("color", "red");
                if(scrollToForm == null)
                    scrollToForm = formID;
            }
            else{
                $(`label[for=${formID}]`).css("color", "white");
            }
        }
        $('html, body').animate({
            scrollTop: $(`#${scrollToForm}`).offset().top - 50
        }, 500);
        $('#main').animate({
            scrollTop: $("#main").scrollTop() + ($(`#${scrollToForm}`).offset().top - $("#main").offset().top)
        }, 500);
        $("#require").css("display", "block");

    }
    return false;
});

$("label[for=first], label[for=last], label[for=mail]").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (){
    $(this).removeClass("animate");
})