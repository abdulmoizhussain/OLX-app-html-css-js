const adsDIV = document.getElementById("div-all-ads");
fetchAds();

function fetchCategorized() {
  let adsCategory = document.getElementById("category-ad");
  if (adsCategory) {
    if (adsCategory.value === "0-default-all") {
      fetchAds();
    } else {
      adsDIV.innerHTML = "";
      firebase
        .database()
        .ref("AllAds")
        .orderByChild("category")
        .equalTo(adsCategory.value)
        .once("value")
        .then(function(data) {
          const value = data.val();
          manageAndGenerateAds(adsDIV, value);
        });
    }
  } else console.log(adsCategory);
}

function fetchTitled() {
  let title = document.getElementById("title-keyword");
  if (title) {
    if (title.value === "") {
      fetchAds();
    } else {
      adsDIV.innerHTML = "";
      firebase
        .database()
        .ref("AllAds")
        .orderByChild("title")
        .startAt(title.value)
        .once("value")
        .then(function(data) {
          const value = data.val();
          manageAndGenerateAds(adsDIV, value);
        });
    }
    console.log(``, title.value);
  } else console.log(adsCategory);
}

function fetchAds() {
  adsDIV.innerHTML = "";
  firebase
    .database()
    .ref("AllAds")
    .once("value")
    .then(async data => {
      const value = data.val();
      manageAndGenerateAds(adsDIV, value);
    });
}

async function manageAndGenerateAds(adsDIV, value) {
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      const cache = await caches.open(dataCacheName);
      const KEYS = await cache.keys();
      let isFavourite = false;
      for (val of KEYS) {
        if (val.url.indexOf(key) > -1) {
          isFavourite = true;
          break;
        }
      }
      adsDIV.innerHTML += generateAd(value[key], key, isFavourite); // ( value, key )
    }
  }
}

function generateAd(data, key, isFavourite) {
  let picURL;
  if (data.pictures) {
    picURL = data.pictures["pic0"];
  } else {
    picURL = "no-image.png";
  }
  var categoryName = document.getElementById("category-ad").options[
    parseInt(data.category)
  ];
  categoryName =
    categoryName === undefined ? data.category : categoryName.innerHTML;
  let ad = `<div class="item">
    <div class="ui small image">
      <img src="${picURL}" id="img${key}">
    </div>
    <div class="content">
      <a class="header">${data.title}</a>
      <div class="right floated ui icon button" data-tooltip="${
        isFavourite ? `Favourited` : `Favourite this Ad`
      }" ${isFavourite ? "" : `onclick="favouriteIt('${key}',this)"`} >
      <i class="star ${isFavourite ? `` : "outline"} icon"></i>
      </div>
      <div class="meta">
      <span>${new Date(data.date).toLocaleString()}</span> <br/>
      <span class="stay">${categoryName}</span> <br/>
      <span class="stay"><b>By</b> ${data.username}</span>
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
  return ad;
}
function favouriteIt(id, element) {
  const img = document.getElementById(`img${id}`);
  console.log(``, img);
  console.log(``, img.src);
  element.firstElementChild.classList.remove("outline");
  const url = `https://project0-bf4c5.firebaseio.com/AllAds/${id}.json`;
  caches.open(dataCacheName).then(cache => {
    return fetch(url).then(async response => {
      const imgRes = await fetch(img.src, {
        mode: "no-cors",
        header: new Headers({
          'Access-Control-Allow-Origin':'*'
        })
      });
      cache.put(img.src, imgRes.clone());
      cache.put(url, response.clone());
      console.log(`ad favourited, ID:`, id);
      element.setAttribute("data-tooltip", "Favourited");
      element.setAttribute("onclick", "");
      return response;
    });
  });
}
function sendMessage(button) {
  window.location.href = `./chat.html?adID=${button.getAttribute(
    "id"
  )}&ownerEmail=${button.getAttribute("ownerEmail")}`;
  // sending ad ID and ownerEmail of ad in URL to be caught in chat.html page.
}
