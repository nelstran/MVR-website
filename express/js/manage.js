$(".delete").click(function(){
    if(!confirm("Are you sure?"))
        return;
    let data = $(this).attr("id").split("/");
    $.ajax({
        url: '/admin/delete',
        data: { id: data[0], db: data[1] },
        type: 'POST',
    });
    $(this).parents("tr").remove();
    alert("Row deleted");
})
$(".edit").click(function(){
    let data = $(this).attr("id").split("/");
    let table = data.shift();
    let id = data.shift();
    $.ajax({
        url: '/admin/edit',
        data: { db: table, id: id, rows: data},
        type: 'POST',
    });
})