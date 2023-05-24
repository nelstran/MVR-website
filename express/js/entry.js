var simplemde = new EasyMDE({
    element: $('.editor')[0],
    placeholder: "Insert manifesto here",
    toolbar: ["bold", "italic", "heading", "|", 
    "quote", "unordered-list", "ordered-list", "|",
    "link", "preview", "guide"],
    autosave: {
		enabled: true,
		uniqueId: "MyUniqueID", //How do I set a unique ID for each user
		delay: 1000,
	},
    status: ["autosave", "words"],
    spellChecker: false,
    maxHeight: "15em"
});

var converter = new showdown.Converter();

//Preview what the post would look like 
$("#previewButton").click(function(){
    $("#preview").removeClass("preview");

    let file = $("#imgUpload").prop('files')[0];
    if(!validateFile(file))
        return;

    let title = $(`<h2> ${$("#titleInput").val()} </h2>`);
    let timestamp = new Date().toLocaleString([], {
        year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    let date = $(`<p class="date"> ${timestamp}</p>`);
    let img = file ? URL.createObjectURL(file) : $("#oldImg").attr("src");
    let imgDiv = img ? $(`<div class="home-img-container"><img src="${img}"></div>`) : null;
    let entry = converter.makeHtml(simplemde.value());

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

//Submit the post
$("#submit").click(function(){
    if(!validateEntry())
        return false;  
    $("#editor").empty();
    $("#editor").append((simplemde.value()));
    return true;
})

//Self explanatory
function validateEntry(){
    var error = false;
    let file = $("#imgUpload").prop('files')[0];

    $("#error").empty();

    if($("#titleInput").val().length == 0){
        $("#error").append("• Title cannot be empty! <br>");
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
    return true;
}

//Only upload certain file types
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
