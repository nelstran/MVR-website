$(".delete").click(function(){
    if(!confirm("Are you sure?"))
        return;
    let data = $(this).attr("id").split("/");
    $.ajax({
        url: '/admin/delete',
        data: { id: data[0], db: data[1] },
        type: 'POST',
    });
})