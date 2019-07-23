function openNav() {
  document.getElementById("mySidebar").style.width = "230px";
  document.getElementById("main").style.marginLeft = "230px";
  document.querySelector(".openbtn").style.display = 'none'
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.querySelector(".openbtn").style.display = 'inline-block'
}