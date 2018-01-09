$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    //$target = $(e.target);
    //console.log($target.attr('data-id'));
    const id = $(this).attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function (response) {
        console.log('Deleting Article');
        window.location.href='/';
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
});