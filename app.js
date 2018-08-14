if ("serviceWorker" in navigator) {
  window.addEventListener("load", ev => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(async res => {
        // await res.update();
        console.log("SERVICE WORKER registered!!!");
      })
      .catch(err => console.log(err));
  });
}