// .ref(`AllUsers/${uid}/MyAds`)
let userEmail;
let ownerEmail;
let uid;
let msgObject;
let sendNewMsgBtn = document.getElementById("sendNewMsgBtn");
let msgBox = document.getElementById("msgBox");
sendNewMsgBtn.disabled = msgBox.disabled = true;
let navColMsgs = document.getElementById("nav-this-ad-msgs");
navColMsgs.innerHTML = "";
(() => {
  // to check authorization and to get userEmail
  try {
    firebase.auth().onAuthStateChanged(user => {
      // console.log(user);
      if (user) {
        // User is signed in.
        userEmail = user.email;
        uid = user.uid;
        getUserAds();
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

getUserAds = () => {
  console.log(``, uid);
  console.log(``, userEmail);
  firebase
    .database()
    .ref(`AllUsers/${uid}/MyAds/`)
    .on("value", snap1 => {
      if (snap1.val() !== null) {
        Object.values(snap1.val()).map(adKEY => {
          // getting list of all ads posted by this user
          firebase
            .database()
            .ref(`AllChats/${adKEY}`)
            .once("value", snap2 => {
              console.log(``,snap2.val());
              if (snap2.numChildren() > 0) {
                let chatNotFound = true;
                for (const chats in snap2.val()) {
                  const KEYS = Object.keys(snap2.val()[chats]);
                  const isChatAvailable = KEYS.join().indexOf("-") > -1;
                  if (isChatAvailable) {
                    chatNotFound = false;
                    let conversationKEY;
                    for (key of KEYS)
                      if (key.indexOf("-") > -1) {
                        conversationKEY = key;
                        break;
                      }
                    const senderEmail = snap2.val()[chats]["sender"];
                    navColMsgs.innerHTML += `<div class="card-text mt-2" id="${adKEY}-body">
                    <h5 class="mb-0" id="${adKEY}-title"></h5>
                  </div>`;
                    firebase
                      .database()
                      .ref(`AllAds/${adKEY}/title`)
                      .once("value", snap3 => {
                        const adTitle = snap3.val();
                        // `<a class="nav-link" chatID="${chatKey}" href="chat.js">${senderEmail}</a>`;
                        // `<a class="card badge-info mb-1 open-this-msg" href="#" onclick="loadItsMsgs('${snap1}/${chatKey}')">${senderEmail}</a>`;
                        // `<a class="nav-link" chatID="${chatKey}" href="chat.js">${senderEmail}</a>`;
                        document.getElementById(
                          `${adKEY}-title`
                        ).innerHTML = adTitle;
                        document.getElementById(
                          `${adKEY}-body`
                        ).innerHTML += `<a class="wrap card badge-info mb-1"
                        href="javascript:void(0)" id="${conversationKEY}">${senderEmail}</a>`;
                        document
                          .getElementById(conversationKEY)
                          .addEventListener("click", () => {
                            this.loadItsMsgs(
                              `AllChats/${adKEY}/${chats}/${conversationKEY}`
                            );
                          });
                      });
                  } // isChatAvailable END
                } // for (const chats in snap2.val()) END
                if (chatNotFound) {
                  alert("No msgs yet");
                }
              } // snap2.numChildren() > 0 END
            });
        });
      } else {
        alert("Ops! You have not posted any Ads yet.");
        window.location.href = "./new-ad.html";
      }
    });
};

loadItsMsgs = chatKEY => {
  console.log("key", chatKEY);
  let chatBox = document.getElementById("chat-msgs");
  chatBox.innerHTML = "";
  firebase
    .database()
    .ref(chatKEY)
    .on("child_added", snap1 => {
      console.log(``, snap1);
      console.log(snap1.val());
      chatBox.innerHTML += generateMsg(snap1.val());
      scrollToLastMsg();
      msgBox.disabled = sendNewMsgBtn.disabled = false;

      msgObject = firebase.database().ref(chatKEY);
      sendNewMsgBtn.addEventListener("click", this.sendMessage);
      msgBox.onkeyup = e => {
        if (e.key === "Enter" && e.ctrlKey) {
          this.sendMessage();
        }
      };
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

scrollToLastMsg = () => {
  const scrollDiv = document.getElementById("chat-msgs");
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
};

generateMsg = value => {
  const isRight = value.sender === userEmail;
  return `<div class="row justify-content-${isRight ? "end" : "start"} mb-1">
    <div class="col-7">
    <div class="card text-${isRight ? "right alert-dark" : "left bg-info text-white"}">
        <div class="card-body">
          <p class="card-text">
            <small>${new Date(value.msgTime).toLocaleString()}</small>
          </p>
          <p class="card-text">${value.msgText}</p>
        </div>
      </div>
    </div>
  </div>`;
};
