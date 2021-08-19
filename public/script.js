var dropdownBtn = document.getElementById("dropdown-btn");
var logo = document.getElementById("logo");
var menu = document.getElementById("menu");
var icon = document.getElementById("icon");

// for sticky header
var header = document.getElementById("header");
var sticky = header.offsetTop;

dropdownBtn.addEventListener("click", function (e) {
  if (menu.className === "links-cont" && logo.className === "logo-cont") {
    menu.classList.add("responsive");
    logo.classList.add("responsive");
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    menu.className = "links-cont";
    logo.className = "logo-cont";
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

window.addEventListener("scroll", function () {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    menu.classList.remove("responsive");
    logo.classList.remove("responsive");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  } else {
    header.classList.remove("sticky");
  }
});
