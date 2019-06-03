const close = document.querySelector(".close");
const pics = document.querySelectorAll(".pics");
const slideOne = document.querySelector(".slideOne");

close.addEventListener("click", ()=>{
    
    if (close.innerHTML === "close") {
      close.innerHTML = "menu";
    } else {
      close.innerHTML = "close";
    }
});
//console.log(pics[0].src);
//frameOne.appendChild(pics[0]);
pics[0].className += " active";
slideOne.src = pics[0].src;

const showPictureOnSlide =()=>{
  for (let index = 0; index < pics.length; index++) {
    pics[index].addEventListener("click", ()=>{
      slideOne.src = pics[index].src;
      pics[index].className += " active";
    });
    
  }
}
showPictureOnSlide();