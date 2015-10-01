$(function() {
  var $commentButton = $('#hide_comments');

  $commentButton.on('click', function() {
    $('#disqus_thread').slideToggle();

    if ($(this).text() === 'View Comments') {
      $(this).text('Hide Comments');
    }
    else {
      $(this).text('View Comments');
    }
  });
});
