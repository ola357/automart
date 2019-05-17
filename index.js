$(document).ready(function () {

    $('#menu-btn').click(changeNav);
    $('#menu-btn').toggleClass('turn')
  
    function changeNav() {
      $('#links').toggle(2000);
      $('#menu-btn').toggleClass('turn')
    }
  
  })