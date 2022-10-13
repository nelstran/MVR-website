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
    let imgDiv = $(`<div class="home-img-container"><img src="${URL.createObjectURL(file)}"></div>`);
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

function validateFile(file){
    var fileName = file.name
    let idxDot = fileName.lastIndexOf(".") + 1
    let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
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
