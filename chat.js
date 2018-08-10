let userEmail;
let ownerEmail;
let ref;
let msgObject;
let isFirstTime = true;
let sendButton = document.getElementById("sendNewMsgBtn");
let chatBox = document.getElementById("chat-msgs");
sendButton.disabled = true;
(function() {
  // to check authorization and to get userEmail
  try {
    firebase.auth().onAuthStateChanged(function(user) {
      // console.log(user);
      if (user) {
        // User is signed in.
        const email = (userEmail = user.email);
        const uid = user.uid;
        checkMessages(uid, email);
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

setNewChat = () => {
  msgObject = firebase
    .database()
    .ref(ref)
    .push();
  msgObject.set({ owner: ownerEmail, sender: userEmail });
  msgObject = msgObject.push();
  const pathArray = msgObject.path.pieces_;
  ref = "";
  for (index in pathArray) {
    ref += pathArray[index] + "/";
  }
  setChildAdded(ref);
};

function checkMessages(userID, userEmail) {
  // to first get old msgs
  const url = new URL(document.URL.toString());
  const adID = url.searchParams.get("adID");
  ownerEmail = url.searchParams.get("ownerEmail");
  ref = `AllChats/${adID}/`;
  chatBox.innerHTML = "";
  firebase
    .database()
    .ref(ref)
    .orderByChild("sender")
    .equalTo(userEmail)
    .once("value", function(data1) {
      const value = data1.val();
      if (value === null) {
        setNewChat();
      } else {
        for (const key in value) {
          // key is of chat
          if (value.hasOwnProperty(key)) {
            const value2 = value[key];
            if ("sender" in value2 && value2["sender"] === userEmail) {
              for (key2 in value2) {
                if (value2.hasOwnProperty(key2) && key2.indexOf("-") > -1) {
                  ref += `${key}/${key2}`;
                  setChildAdded(ref);
                }
              }
            } else {
              // its a new chat
              setNewChat();
            }
          }
        }
      }
      sendButton.disabled = false;
    });
}

sendButton.addEventListener("click", function(e) {
  const msg = document.getElementById("msgBox");
  if (msg.value.trim() === "") return;

  msgObject.push({
    sender: userEmail,
    msgTime: new Date().getTime(),
    msgText: msg.value.trim()
  });
  msg.value = "";
});

function scrollToLastMsg() {
  // to scroll msgs box at the last one.
  const scrollDiv = document.getElementById("chat-msgs");
  // console.log(scrollDiv);
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

function generateMsg(key, value) {
  if (value.sender === userEmail) {
    return `<div class="row justify-content-end mb-1" id="${key}">
    <div class="col-7">
      <div class="card text-right alert-dark">
        <div class="card-body">
          <p class="card-text">
            <small>${new Date(value.msgTime).toLocaleString()}</small>
          </p>
          <p class="card-text">${value.msgText}</p>
        </div>
      </div>
    </div>
  </div>`;
  } else {
    return `<div class="row justify-content-start mb-1" id="${key}">
    <div class="col-7">
      <div class="card text-left bg-info text-white">
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
}

setChildAdded = () => {
  firebase
    .database()
    .ref(ref)
    .on("child_added", snap1 => {
      chatBox.innerHTML += generateMsg(snap1.key, snap1.val());
      scrollToLastMsg();
    });
};
