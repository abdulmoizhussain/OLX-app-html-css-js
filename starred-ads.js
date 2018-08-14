fetchAds();
async function fetchAds() {
  const adsDIV = document.getElementById("div-all-ads");
  adsDIV.innerHTML = "";

  const cache = await caches.open(dataCacheName);
  const KEYS = await cache.keys();
  if (KEYS.length < 1) {
    alert("Please, Star some Ads first.");
    return;
  }
  for (val of KEYS) {
    fetch(val.url).then(async res => {
      const data = await res.json();
      console.log(``, data);
      if (data.title) {
        adsDIV.innerHTML += generateAd(data, "", true);
      }
    });
  }
}

function generateAd(data, key, isFavourite) {
  let picURL;
  if (data.pictures) {
    picURL = data.pictures["pic0"];
  } else {
    picURL = "no-image.png";
  }
  const categoryName = categoriesArray[parseInt(data.category)];
  let ad = `<div class="item">
    <div class="ui small image">
      <img src="${picURL}">
    </div>
    <div class="content">
      <a class="header">${data.title}</a>
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
    </div>
  </div>`;
  return ad;
}
