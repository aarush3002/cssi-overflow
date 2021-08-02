console.log("JS ready");
let googleUser;

function createPost() {
  document.querySelector("#progressBar").classList.remove("hidden");
  
  var title = document.querySelector("#title").value;
  var content = document.querySelector("#content").value;
  
  // TODO: Enable the line below once we have login setup
  //firebase.database().ref(`users/${googleUser.uid}`).push({
  firebase.database().ref(`test`).push({
    title: title,
    content: content,
    timestamp: Date.now()
  });

  //window.location = 'index.html'; <!-- Go to 'my posts' page -->

  document.querySelector("#progressBar").classList.add("hidden");
}

window.onload = (event) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      googleUser = user;
    } else {
      //window.location = 'index.html'; // 'index.html' will be the login page
    }
  });
};