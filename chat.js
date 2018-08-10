let userEmail;
let ownerEmail;
let ref;
let msgObject;
let isFirstTime=true;
(function() {
  // to check authorization and to get userEmail
  try {
    firebase.auth().onAuthStateChanged(function(user) {
      // console.log(user);
      if (user) {
        // User is signed in.
        const email = userEmail = user.email;
        const uid = user.uid;
        // console.log(typeof email, "email", email);
        // console.log(typeof uid, "uid", uid);
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

function checkMessages(userID, userEmail) {
  // to get msgs
  const url = new URL(document.URL.toString());
  const adID = url.searchParams.get("adID");
  ownerEmail = url.searchParams.get("ownerEmail");
  // console.log("ownerEmail",ownerEmail);
  // console.log("userEmail", userEmail);
  // console.log("adID", adID);
  // console.log("ownerEmail", ownerEmail);
  // ref = `AllChats/${adID}/${ownerEmail}+${userEmail}`;
  ref = `AllChats/${adID}/`;
  // console.log(ref);

  let isChatAvailable = false;
  let chatBox = document.getElementById("chat-msgs");
  chatBox.innerHTML = "";
  firebase
    .database()
    .ref(ref).orderByChild("sender").equalTo(userEmail)
    .once("value", function(data1) {

      const value = data1.val();
      console.log(value);
      
      if (value['sender'] !== userEmail) {
        msgObject = firebase.database().ref(ref).push();
        msgObject.set({"owner":ownerEmail, "sender": userEmail});
      }

      firebase.database().ref().orderByChild().equalTo().on("child_added", (data2)=> {
        const data3 = data2.val();
        chatBox.innerHTML += generateMsg(data3);
        // console.log("msgText", value.msgText);
        // console.log("msgTime", value.msgTime);
        // console.log("sender", value.sender);
        scrollToLastMsg();
        // for (const key in value) {
        //   if (value.hasOwnProperty(key)) {
        //     console.log(value[key]);
        //   }
        // }console.log(!isChatAvailable);
      });
    });
}

document.getElementById("sendNewMsgBtn").addEventListener("click", function(e) {
  const msg = document.getElementById("msgBox");
  if (msg.value.trim() === "") return;
  if (ref === undefined || ref === "") return;

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
function removeDots(value) {
  return value.replace(".", "");
}

function generateMsg(value) {
  if (value.sender === userEmail) {
    return `<div class="row justify-content-end mb-1">
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
    return `<div class="row justify-content-start mb-1">
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
