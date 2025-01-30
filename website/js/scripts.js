/*!
 * Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link"),
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
});

//dark mode
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("flexSwitchCheckChecked");

  // Function to enable dark mode
  function enableDarkMode() {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
  }

  // Function to disable dark mode
  function disableDarkMode() {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
  }

  // Check saved preference and apply
  if (localStorage.getItem("darkMode") === "enabled") {
      enableDarkMode();
      themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", function () {
      if (themeToggle.checked) {
          enableDarkMode();
      } else {
          disableDarkMode();
      }
  });
});