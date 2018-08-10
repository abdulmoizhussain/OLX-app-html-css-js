checkSignin();
function signin() {
  let errorBox = document.getElementById("error_message_box");
  errorBox.style.display = "none";
  const loginData = new FormData(document.getElementById("loginForm"));
  const email = loginData.get("email");
  const password = loginData.get("password");
  let flag=false;
  let errorMsg = '';

  if (email==='') {
    errorMsg += `<li>Empty Email</li>`;
    flag=true;
  }
  if (password==='') {
    errorMsg += `<li>Empty Password</li>`;
    flag=true;
  }
  if (flag) {
    errorBox.style.display = "block";
    errorBox.innerHTML = `<ul>${errorMsg}</ul>`
  }

  if (email !== "" && password !== "") {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function (response) {
        console.log(response);
        alert(response.user.email);
        console.log(response.user.email);
        
        if (window.history.length > 0) history.back();
        // go back to where came from.
      })
      .catch(function (error) {
        console.log(error);
        alert(error.message);
      });
  }
}

function checkSignin() {
  firebase.auth().onAuthStateChanged(function (user) {
    console.log(typeof user);
    console.log(user);
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log(typeof displayName, displayName);
      console.log(typeof email, email);
      console.log(typeof emailVerified, emailVerified);
      console.log(typeof photoURL, photoURL);
      console.log(typeof isAnonymous, isAnonymous);
      console.log(typeof uid, uid);
      console.log(typeof providerData, providerData);
    } else {
      alert("Session not found please sign in again.");
    }
  });
}
