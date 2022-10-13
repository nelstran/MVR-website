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
    let entry = converter.makeHtml(simplemde.value());
    let title = $(`<h1> ${$("#titleInput").val()} </h1>`);
    let imgDiv = $(`<div class="home-img-container"></div>`);
    let img = $(`<img src="/images/dog.webp">`);
    imgDiv.append(img);
    let dt = new Date();
    let hours = dt.getHours() % 12;
    let ampm = dt.getHours() > 12 ? "pm" : "am"; 
    // let timestamp = `${dt.getMonth()}/${dt.getDay()}/${dt.getFullYear()} ${hours}:${dt.getMinutes()} ${ampm}`;
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
