$("#submit").click(function(e){
    let forms = [$("#titleInput"), $("#imgUpload"), $("#project-desc")];
    let valid = [
        forms[0].val().length > 0,
        forms[1].val() != "",
        forms[2].val().length > 0
    ];
    if(valid.every(bool => bool == true)){
        return true;
    }
    else{
        for(let i = 0; i < valid.length; i++){
            let formID = forms[i].attr('name');
            if(!valid[i]){
                $(`[name="${formID}"]`).css("animation-delay", `${25*i}ms`);
                $(`[name="${formID}"]`).addClass("animate");
                $(`[name="${formID}"]`).addClass("invalid");
            }
            else{
                $(`[name="${formID}"]`).removeClass("invalid");
            }
        }
    }
    return false;
});

$("textarea, input").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (){
    $(this).removeClass("animate");
})