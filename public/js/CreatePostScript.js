console.log("JS ready");
let googleUser;

function createPost() {
  document.querySelector("#progressBar").classList.remove("hidden");
  
  var title = document.querySelector("#title").value;
  var content = document.querySelector("#content").value;
  
    firebase.database().ref(`users/${googleUser.uid}`).push({
    title: title,
    content: content,
    timestamp: Date.now()
    }).then(() => {
    console.log("change page");
    window.location = 'myPosts.html';
}).catch(error => {
    //Something bad happened :(
    console.log(error);
    });

    console.log("created post");
  //; //TODO: Go to 'my posts' page

  document.querySelector("#progressBar").classList.add("hidden");
}

window.onload = (event) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      googleUser = user;
    } else {
      window.location = 'index.html'; // 'index.html' is the login page
    }
  });
};