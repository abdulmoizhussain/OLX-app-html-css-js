const navbarHTML = `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01"
  aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>
<div class="collapse navbar-collapse" id="navbarTogglerDemo01">
  <a class="navbar-brand" href="./index.html">
    <img src="./olx_logo.png" width="30" height="30" alt=""> Home
  </a>
  <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
    <li class="nav-item active" id="post-an-ad">
      <a class="nav-link" href="./new-ad.html">Post an Ad</a>
    </li>
    <li class="nav-item active" id="starred-ads">
      <a class="nav-link" href="./starred-ads.html">Starred Ads</a>
    </li>
  </ul>
</div>
<ul class="nav justify-content-end">
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)" role="button" aria-haspopup="true" aria-expanded="false" id="account-dropdown">Account</a>
    <div class="dropdown-menu" id="account-dropdown-body">
      <a class="dropdown-item" href="signin.html">SignIn</a>
      <a class="dropdown-item" href="signup.html">SignUp</a>
    </div>
  </li>
</ul>`;
let dropdown;
let dropdownBody;
generateNavBar();
try {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      dropdown.innerHTML = user.email;
      dropdownBody.innerHTML = `<a class="dropdown-item" href="mymsgs.html">Messages</a>
      <a class="dropdown-item" href="javascript:void(0)" id="sigout-button">SignOut</a>`;

      // sigout functionality
      document.getElementById("sigout-button").addEventListener("click", () => {
        firebase
          .auth()
          .signOut()
          .then(
            () => {
              window.location.reload();
            },
            error => {
              console.log("signoutERROR", error);
            }
          );
      });
    } else {
      // user is not signed in
    }
  });
} catch (error) {
  console.log(error);
}

function generateNavBar() {
  let parent = document.getElementsByTagName("body")[0];
  let firstElement = parent.firstElementChild;
  let newElement = document.createElement("nav");
  newElement.setAttribute(
    "class",
    "navbar navbar-expand-sm navbar-light bg-light"
  );
  newElement.innerHTML = navbarHTML;
  parent.insertBefore(newElement, firstElement);

  let navbar = document.getElementById("navbarTogglerDemo01");
  dropdown = document.getElementById("account-dropdown");
  dropdownBody = document.getElementById("account-dropdown-body");

  document
    .getElementsByClassName("navbar-toggler")[0]
    .addEventListener("click", e => {
      if (navbar.classList.contains("show")) {
        navbar.classList.remove("show");
        e.target.classList.add("collapsed");
        e.target.setAttribute("aria-expanded", false);
      } else {
        navbar.classList.add("show");
        if (e.target.classList.contains("collapsed"))
          e.target.classList.remove("collapsed");
        e.target.setAttribute("aria-expanded", true);
      }
    });

  document.getElementById("account-dropdown").addEventListener("click", e => {
    if (dropdownBody.classList.contains("show")) {
      dropdownBody.classList.remove("show");
      e.target.parentElement.classList.remove("show");
      e.target.setAttribute("aria-expanded", false);
    } else {
      dropdownBody.classList.add("show");
      e.target.parentElement.classList.add("show");
      e.target.setAttribute("aria-expanded", true);
    }
  });
}
