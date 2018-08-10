fetchAds();
function generateIMG(url) {
  let span = document.createElement("img");
  span.setAttribute("src", url);
  document.body.appendChild(span);
}

function fetchCategorized() {
  let adsCategory = document.getElementById("category-ad");

  adsCategory = undefined;
  if (adsCategory) {
    if (adsCategory.value === "default-all") {
      fetchAds();
    } else {
      const database = firebase.database();
      database
        .ref("AllAds")
        .orderByChild("category")
        .equalTo(adsCategory)
        .once("value")
        .then(function(data) {
          const adsDIV = document.getElementById("div-all-ads");
          adsDIV.innerHTML = "";
        });
    }
  } else console.log(adsCategory);
}

function fetchAds() {
  const database = firebase.database();
  const adsDIV = document.getElementById("div-all-ads");
  adsDIV.innerHTML = "";

  database
    .ref("AllAds")
    .once("value")
    .then(function(data) {
      const value = data.val();
      console.log(value);
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          // console.log(value[key]);
          adsDIV.innerHTML += generateAd(value[key], key); // ( value, key )
        }
      }
    });
}

function generateAd(data, key) {
  let picURL;
  if (data.pictures) {
    picURL = data.pictures["pic0"];
  } else {
    picURL = "no-image.png";
  }
  var categoryName = document.getElementById("category-ad").options[parseInt(data.category)];
  // console.log(categoryName);
  // console.log(categoryName.text);
  categoryName =
    categoryName === undefined ? data.category : categoryName.innerHTML;
  let ad = `<div class="item" id="${key}">
    <div class="ui small image">
      <img src="${picURL}">
    </div>
    <div class="content">
      <a class="header">${data.title}</a>
      <div class="meta">
      <span>${new Date(data.date).toLocaleString()}</span> <br/>
        <span class="stay">${categoryName}</span>
      </div>
      <div class="description">
        <p>${data.province}</p>
      </div>
      <div class="description">
        <a class="ui orange tag label">Rs ${data.price}</a>
      </div>
      <div class="extra content">
      <span class="right floated">
        <button class="ui button" id="${key}" ownerEmail="${
    data.ownerEmail
  }" onclick="sendMessage(this)">Send Message</button>
      </span>
    </div>
    </div>
  </div>`;
  // <td><button class='btn btn-danger' onclick="deleteRow('${key}',this)"> X</button></td>
  // return "";
  return ad;
}
function sendMessage(button) {
  console.log(button);
  window.location.href = `./chat.html?adID=${button.getAttribute(
    "id"
  )}&ownerEmail=${button.getAttribute("ownerEmail")}`;
  // sending ad ID and ownerEmail of ad in URL to be caught in chat.html page.
}

function signout() {
  firebase
    .auth()
    .signOut()
    .then(
      function() {
        console.log("Signed Out");
      },
      function(error) {
        console.log("signoutERROR", error);
      }
    );
}
