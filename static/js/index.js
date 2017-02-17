document.addEventListener("DOMContentLoaded", function() {
  var btns = document.querySelectorAll('.btn-show-more');
  for (i=0;i<btns.length;i++){
    btns[i].addEventListener('click', function(evt){
      var table = evt.currentTarget.parentNode.parentNode.querySelector('table');
      if (table.className.match(/hidden/)){
        evt.currentTarget.innerText = "hide history";
      }
      else{
        evt.currentTarget.innerText = "show messages history";
      }
      table.classList.toggle('hidden');
    });
  }
});
