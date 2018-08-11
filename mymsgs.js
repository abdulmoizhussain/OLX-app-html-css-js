// .ref(`AllUsers/${uid}/MyAds`)
let userEmail;
let ownerEmail;
let uid;
let ref;
(function() {
  // to check authorization and to get userEmail
  try {
    firebase.auth().onAuthStateChanged(function(user) {
      // console.log(user);
      if (user) {
        // User is signed in.
        userEmail = user.email;
        uid = user.uid;
        getAdKeys();
      } else {
        // user is not signed in
        window.location.href = `./signin.html`;
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
})();

getAdKeys = ()=> {
  console.log(``,uid);
  console.log(``,userEmail);
  firebase.database().ref(`AllUsers/${uid}`)
  .once("value", (snap1)=> {
    if (snap1.val() !== null) {
      Object.values(snap1.val()['MyAds']).map( (val)=> {
        console.log(``,val);
        // checkMessages();
      });

    } else {
      alert('Ops! You have not posted any Ads yet.');
    }
  });
};

function checkMessages() {
  console.log("userEmail", userEmail);
  firebase
    .database()
    .ref("AllAds")
    .orderByChild("ownerEmail")
    .equalTo(userEmail)
    .once("value", (data) => {
      const val = data.val();
      console.log(val); // to get the length
      console.log(Object.keys(val)); // to get the length
      // console.log(data.numChildren()); // to get the length

      let chatMsgs = document.getElementById("chat-msgs");
      chatMsgs.innerHTML = "";
      Object.keys(val).forEach(snap1 => {
        firebase
          .database()
          .ref(`AllChats/${snap1}`)
          .once("value")
          .then(function(snap2) {
            let adsMsgs = document.getElementById("nav-this-ad-msgs");
            adsMsgs.innerHTML = "";
            Object.keys(snap2.val()).forEach(function(snap3) {
              const chatKey = snap3;
              const senderEmail = snap3.split("+")[1]; // email of the person who sent msg
              adsMsgs.innerHTML +=
                // `<a class="nav-link" chatID="${chatKey}" href="chat.js">${senderEmail}</a>`;
                `<a class="card badge-info mb-1 open-this-msg" href="#" onclick="loadItsMsgs('${snap1}/${chatKey}')">${senderEmail}</a>`;
            });
          });
      });
    });
}

function loadItsMsgs(key) {
  console.log("key", key);

  let chatBox = document.getElementById("chat-msgs");
  chatBox.innerHTML = "";
  firebase
    .database()
    .ref(`AllChats/${key}`)
    .on("child_added", function(snap1) {
      console.log(snap1.val());
      chatBox.innerHTML += generateMsg(snap1.val());
      scrollToLastMsg();
    });
}

function scrollToLastMsg() {
  const scrollDiv = document.getElementById("chat-msgs");
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

function generateMsg(value) {
  const isRight = value.sender === userEmail;
  return `<div class="row justify-content-${isRight ? "end" : "start"} mb-1">
    <div class="col-7">
      <div class="card text-${isRight ? "right" : "left"} alert-dark">
        <div class="card-body">
          <p class="card-text">
            <small>${new Date(value.msgTime).toLocaleString()}</small>
          </p>
          <p class="card-text">${value.msgText}</p>
        </div>
      </div>
    </div>
  </div>`;
}
