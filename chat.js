let userEmail;
let ownerEmail;
let ref;
let msgObject;
const chatBox = document.getElementById("chat-msgs");
const sendButton = document.getElementById("sendNewMsgBtn");
const msgBox = document.getElementById("msgBox");
sendButton.disabled = msgBox.disabled = true;
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

goBack = () => {
  window.location.href = "./index.html";
  return;
};

function checkMessages(userID, userEmail) {
  // to first get old msgs
  const url = new URL(document.URL.toString());
  const adID = url.searchParams.get("adID");
  ownerEmail = url.searchParams.get("ownerEmail");
  if (
    adID === undefined ||
    ownerEmail === undefined ||
    adID === null ||
    ownerEmail === null ||
    adID === "" ||
    ownerEmail === ""
  ) {
    goBack();
  }
  if (ownerEmail === userEmail) {
    alert("Cannot send Msg to yourself.");
    goBack();
  }
  ref = `AllChats/${adID}/`;
  chatBox.innerHTML = "";
  firebase
    .database()
    .ref(ref)
    .orderByChild("sender")
    .equalTo(userEmail)
    .once("value", data1 => {
      const value = data1.val();
      if (value === null) {
        initNewChat();
      } else {
        for (const key in value) {
          // key is of chat
          if (value.hasOwnProperty(key)) {
            const value2 = value[key];
            if ("sender" in value2 && value2["sender"] === userEmail) {
              const KEYS = Object.keys(value2);
              if (KEYS.join().indexOf("-") <= -1 || KEYS.length < 3) {
                // to check if there are any msgs present.
                ref += `${key}`;
                msgObject = firebase
                  .database()
                  .ref(ref)
                  .push();
              } else {
                for (key2 in value2) {
                  if (value2.hasOwnProperty(key2) && key2.indexOf("-") > -1) {
                    ref += `${key}/${key2}`;
                    msgObject = firebase.database().ref(ref);
                  }
                }
              }
              initChildAdded();
            } else {
              // its a new chat
              initNewChat();
            }
          }
        }
      }
      sendButton.disabled = msgBox.disabled = false;
    });
}

initNewChat = () => {
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
  initChildAdded();
};

sendButton.addEventListener("click", () => {
  sendMessage();
});
msgBox.onkeyup = e => {
  if (e.key === "Enter" && e.ctrlKey) {
    sendMessage();
  }
};

function scrollToLastMsg() {
  // to scroll msgs box at the last one.
  const scrollDiv = document.getElementById("chat-msgs");
  // console.log(scrollDiv);
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

function generateMsg(key, value) {
  const isRight = value.sender === userEmail;
  return `<div class="row justify-content-${isRight ? "end" : "start"} mb-1">
    <div class="col-7">
      <div class="card text-${
        isRight ? "right alert-dark" : "left bg-info text-white"
      }">
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

initChildAdded = () => {
  msgObject.on("child_added", snap1 => {
    chatBox.innerHTML += generateMsg(snap1.key, snap1.val());
    scrollToLastMsg();
  });
};

sendMessage = () => {
  if (msgBox.value.trim() === "") return;
  msgObject.push({
    sender: userEmail,
    msgTime: new Date().getTime(),
    msgText: msgBox.value.trim()
  });
  msgBox.value = "";
};
