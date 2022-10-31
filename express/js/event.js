$("#submit").click(function(e){
    let forms = [$("#titleInput"), $("#eventDate"), $("#eventLocation")];
    let valid = [
        forms[0].val().length > 0,
        !!forms[1].val(),
        forms[2].val().length > 0
    ];
    if(valid.every(bool => bool == true)){
        return true;
    }
    else{
        for(let i = 0; i < valid.length; i++){
            let formID = forms[i].attr('name');
            if(!valid[i]){
                $(`label[for=${formID}]`).addClass("animate");
                $(`input[name="${formID}"]`).addClass("animate");
                $(`label[for=${formID}]`).css("color", "red");
            }
            else{
                $(`label[for=${formID}]`).css("color", "white");
            }
        }
    }
    return false;
});

$("label, input").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (){
    $(this).removeClass("animate");
})