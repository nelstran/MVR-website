var simplemde = new SimpleMDE({
    element: $('.editor')[0],
    placeholder: "Insert manifesto here",
    toolbar: ["bold", "italic", "heading", "|", 
    "quote", "unordered-list", "ordered-list", "|",
    "link", "preview", "guide"],
    autosave: {
		enabled: true,
		uniqueId: "MyUniqueID",
		delay: 1000,
	},
    status: ["autosave"],
    spellChecker: false
});
var converter = new showdown.Converter();
$("#previewButton").click(function(){
    $("#preview").removeClass("preview");
    var file = $("#imgUpload").prop('files')[0];
    if(!validateFile(file))
        return;
    let entry = converter.makeHtml(simplemde.value());
    let title = $(`<h1> ${$("#titleInput").val()} </h1>`);
    let imgDiv = file ? $(`<div class="home-img-container"><img src="${URL.createObjectURL(file)}"></div>`) : null;
    let dt = new Date();
    let timestamp = dt.toLocaleString([], {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    let date = $(`<p class="date"> ${timestamp}</p>`);

    $("#preview").empty();
    $("#preview").append(title);
    $("#preview").append(date);
    $("#preview").append(imgDiv);
    $("#preview").append(entry);

    $('html, body').animate({
        scrollTop: $(`#preview`).offset().top - 50
    }, 500);
    $('#main').animate({
        scrollTop: $("#main").scrollTop() + ($("#preview").offset().top - $("#main").offset().top)
    }, 500);
})
var file, title, content;
$("#submit").click(function(){
    if(!validateEntry())
        return false;   
    let dt = new Date();
    let timestamp = dt.toLocaleString([], {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    $.ajax({
        type: "post",
        url: "/admin/uploadEntry",
        contentType: "application/json",
        data: JSON.stringify({
            title: title,
            content: content,
            date: timestamp
        }),
        dataType: "json"
    }).done(console.log("Post to /uploadEntry"));
    return true;
})
function validateEntry(){
    file = $("#imgUpload").prop('files')[0];
    var error = false;

    $("#error").empty();
    if($("#titleInput").val().length == 0){
        $("#error").append("• Title cannot be empty!");
        $("#error").append("<br>");
        error = true;
    }
    if(simplemde.value().length == 0){
        $("#error").append("• Entry cannot be empty!");
        error = true;
    }
    if(!validateFile(file)){
        error = true
    }
    if(error){
        $("#error").css("display", "block");
        return false;
    }
    else{
        title = $("#titleInput").val();
        content = simplemde.value();
        content = converter.makeHtml(simplemde.value());
    }
    return true;
}
function validateFile(file){
    if(!file)
        return true;
    var fileName = file.name
    let idxDot = fileName.lastIndexOf(".") + 1
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    $("label[for=imgUpload]").css('color', "white");
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="gif" || extFile=="webp"){
        return true;
    }
    else{
        alert("The following files are allow: JPG/JPEG, PNG, GIF, WEBP");
        $("label[for=imgUpload]").css('color', "red");
        $("#imgUpload").val(null);
        return false;
    }
}
