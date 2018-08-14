let displayName;
let email;
let emailVerified;
let photoURL;
let isAnonymous;
let uid;
let providerData;

checkSigninFirst();

function writeUserData(email, password) {
  var database = firebase.database().ref();
  var sku = database.child("Users").push();
  console.log(typeof sku.key);
  console.log(sku.key);
  console.log(sku);

  sku.child("id").set("" + sku.key);
  sku.child("email").set(email);
  sku.child("password").set(password);
}

function submitAd() {
  const form = new FormData(document.getElementById("submit-new-ad-form"));
  if (form.get("title-ad").length < 4) {
    alert("Title must not be empty.");
  } else if (form.get("category-ad") === "0-default") {
    alert("Select Ad category.");
  } else if (form.get("details-ad").length < 5) {
    alert("Provide some useful description.");
  } else if (form.get("username-ad").length < 4) {
    alert("Invalid username");
  } else if (form.get("province-ad").length < 3) {
    alert("Invalid Province name.");
  } else {
    initAdSubmission(form);
  }
  return false;
}

initAdSubmission = form => {
  // have to send it using document.getElementById, not by form.get()
  // and calling it first because its results are all callbacks.
  const adObject = firebase
    .database()
    .ref("AllAds")
    .push();
  firstUploadPics(document.getElementById("picture-ad"), form, adObject, email);
};

function checkSigninFirst() {
  try {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        displayName = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        photoURL = user.photoURL;
        isAnonymous = user.isAnonymous;
        uid = user.uid;
        providerData = user.providerData;
        console.log(typeof displayName, displayName);
        console.log(typeof email, email);
        console.log(typeof emailVerified, emailVerified);
        console.log(typeof photoURL, photoURL);
        console.log(typeof isAnonymous, isAnonymous);
        console.log(typeof uid, uid);
        console.log(typeof providerData, providerData);
      } else {
        window.location.href = `./signin.html`;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function firstUploadPics(imageObject, formObject, adObject, userEmail) {
  let picObject = {};
  if (imageObject.files.length < 1) {
    proceedAdSubmission(picObject, formObject, adObject, userEmail);
  }
  let picsCounter = 0;
  for (let i = 0; i < imageObject.files.length; i++) {
    const theImage = imageObject.files[i];
    const imageName = theImage.name.substr(0, theImage.name.indexOf("."));
    console.log(imageName);
    let uploadTask = firebase
      .storage()
      .ref("AllPics")
      .child(`${adObject.key}/${imageName}`)
      .put(theImage, { /*metaData*/ contentType: theImage.type });
    // Upload file and metadata to the object 'images/mountains.jpg'
    // var uploadTask = database.child('images/' + image.files[i].name).put(image.files[i], metadata);
    // let database = firebase.database().ref('AllPics/');
    // let uploadTask = database.child('AllPics/'+ adObject.key +'/'+ image.files[i].name).put(image.files[i], metadata);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        console.log(error);
        switch (error.code) {
          case "storage/unauthorized":
            alert(`User doesn't have permission to access the object`);
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            alert(`User canceled the upload`);
            // User canceled the upload
            break;

          case "storage/unknown":
            alert(`Unknown error occurred, check console log`);
            console.log(error.serverResponse);
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
          console.log(picsCounter);
          picObject[`pic${picsCounter++}`] = downloadURL;
          console.log(picsCounter);
          if (picsCounter === imageObject.files.length) {
            proceedAdSubmission(picObject, formObject, adObject, userEmail);
          }
        });
      }
    );
  }
}

function proceedAdSubmission(picObject, formObj, adObject, userEmail) {
  adObject.set({
    ownerEmail: userEmail,
    title: formObj.get("title-ad"),
    category: formObj.get("category-ad"),
    description: formObj.get("details-ad"),
    price: formObj.get("price-ad"),
    pictures: picObject,
    date: new Date().getTime(),
    username: formObj.get("username-ad"),
    contactno: formObj.get("contactno-ad"),
    province: formObj.get("province-ad")
  });
  console.log(formObj);
  console.log(picObject);
  console.log(adObject);
  console.log(uid);
  console.log(adObject.key);
  firebase
    .database()
    .ref(`AllUsers/${uid}/MyAds`)
    .push(adObject.key);
  console.log("ad submitted successfully");
  formObj.reset();
  return false;
}