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
}
);
