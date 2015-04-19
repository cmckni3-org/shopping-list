$(function () {
    $('.items').on('click', '.delete', function (evt) {
        swal({
          title: 'Are you sure you want to delete this item?',
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel",
          closeOnConfirm: true,
          closeOnCancel: true
        },
        function(isConfirm){
          if (isConfirm) {
            deleteItem($(evt.target).data('id'));
          }
        });
    });
});

function deleteItem(id) {
    $.ajax('/' + id, {
        type: 'DELETE'
    }).fail(function (err) {
        swal(err);
    }).done(function () {
        location.reload();
    });
}
