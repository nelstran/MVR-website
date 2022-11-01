$(function(){
    $("#eventDate").attr("min",new Date().toISOString().split("T")[0])
})
$("#submit").click(function(e){
    let forms = [$("#titleInput"), $("#eventDate"), $("#eventLocation"), $("#imgUpload")];
    let valid = [
        forms[0].val().length > 0,
        !!forms[1].val(),
        forms[2].val().length > 0,
        forms[3].val() != ""
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
                $(`input[name="${formID}"]`).addClass("invalid");
                $(`label[for=${formID}]`).css("color", "red");
            }
            else{
                $(`label[for=${formID}]`).css("color", "white");
                $(`input[name="${formID}"]`).removeClass("invalid");
            }
        }
    }
    return false;
});

$("label, input").on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function (){
    $(this).removeClass("animate");
})