let errorBox = document.getElementById("error_message_box");
let errorMsg = "";
signin = () => {
  errorMsg = "";
  errorBox.style.display = "none";
  const loginData = new FormData(document.getElementById("loginForm"));
  const email = loginData.get("email");
  const password = loginData.get("password");
  let flag = false;

  if (email === "") {
    errorMsg += `<li>Empty Email</li>`;
    flag = true;
  }
  if (password === "") {
    errorMsg += `<li>Empty Password</li>`;
    flag = true;
  }
  if (flag) {
    errorBox.style.display = "block";
    errorBox.innerHTML = `<ul>${errorMsg}</ul>`;
  }

  if (email !== "" && password !== "") {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
      .then(response => {
        console.log(``, response);
        if (response.user) {
          if (window.history.length > 0)
            history.back();
        }
      })
      .catch(error => {
        // Handle Errors here.
        alert(`Error: ${error.message}`);
        console.log(``, error.code);
        console.log(``, error.message);
      });
  }
};

