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

//enables dark mode -NO local storage -NO user tracking
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
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "enabled") {
  enableDarkMode();
  themeToggle.checked = true; 
} else {
  disableDarkMode(); 
  themeToggle.checked = false; 
}

// Toggle dark mode on switch change
themeToggle.addEventListener("change", function () {
  if (themeToggle.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  });
});

/*disclaimer popup*/
document.addEventListener("DOMContentLoaded", function () {
  const hasSeenDisclaimer = localStorage.getItem("hasSeenDisclaimer");
  const sessionActive = sessionStorage.getItem("sessionActive");

  // Checks if it's a new session
  if (!sessionActive) {
      sessionStorage.setItem("sessionActive", "true"); // Marks session as active
      localStorage.removeItem("hasSeenDisclaimer"); // Resets disclaimer for new session
  }

  // If disclaimer was dismissed in the past session, don't show it
  if (hasSeenDisclaimer) return;

  // If the disclaimer has not been dismissed in this session, show it
  if (!sessionStorage.getItem("disclaimerDismissed")) {
      document.getElementById("disclaimer-popup").style.display = "block";
  }
});

/* dismiss disclaimer popup */
function dismissPopup() {
  document.getElementById("disclaimer-popup").style.display = "none";

  // Store in localStorage so it does not appear again until a new session starts
  localStorage.setItem("hasSeenDisclaimer", "true");
  
  // Store in sessionStorage so it does not appear again during the session
  sessionStorage.setItem("disclaimerDismissed", "true");
}