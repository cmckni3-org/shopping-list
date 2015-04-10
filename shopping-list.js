$(function(){
  $('[data-edit]').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    var item_id = $(this).data('id');
    var span = $(this).siblings('span:first');
    swal({
      title: 'Edit item',
      showCancelButton: true,
      type: 'input',
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Update",
      cancelButtonText: "Cancel"
    }, function(inputValue){
      if (inputValue == "") return false;
      $.ajax({
        url: '/' + item_id,
        method: 'PUT',
        data: inputValue,
        contentType: 'application/json',
        dataType: 'text'
      }).done(function( response ) {
        swal.close();
        span.text(inputValue);
      }).fail(function( jqXHR, textStatus ) {
        swal.close();
        swal({ title: 'Error updating', type: 'error' });
      });
    });
  });

  $('[data-delete]').on('click', function(event){
    event.preventDefault();
    event.stopPropagation();
    var li = $(this).parent();
    var item_id = $(this).data('id');
    $.ajax({
      url: '/' + item_id,
      method: 'DELETE',
      data: item_id,
      contentType: 'application/json',
      dataType: 'text'
    }).done(function( response ) {
      li.remove();
    }).fail(function( jqXHR, textStatus ) {
      swal({ title: 'Error deleting', type: 'error' });
    });
  });
});
