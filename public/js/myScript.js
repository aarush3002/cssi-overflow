let googleUser;

console.log("My Posts page script loaded");
function creationTime(epoch) {
    const dateObject = new Date(epoch);
    return dateObject.toLocaleString();
}

function displayMyPost(post,postKey) {
    console.log("Displaying post");
    console.log(post);
    var title = post["title"];
    var content = post["content"].substring(0, 100) + "...";
    const time = creationTime(post.timestamp);
    console.log("Time: ");
    console.log(time);
    return `
    <div class="card m-3">
        <header class="card-header">
            <p class="card-header-title">
                ${title}
            </p>
            <button class="delete" 
                    onclick = "deleteCard('${postKey}')">
            </button>
        </header>
        <div class="card-content">
            <div class="content">
                ${content}
                <br>
                <time>${time}</time>
            </div>
        </div>
    </div>
    `;
}

window.onload = (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        googleUser = user;
        getNotes(user.uid);
        } else {
        window.location = 'index.html'; // 'index.html' is the login page
        }
    });
}

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`).orderByChild('timestamp').limitToLast(100);
  console.log("Getting notes");
  notesRef.on('value', (snapshot) => {
      console.log("get ref to database");
    const data = snapshot.val();
    let postsGUI = ``;
    console.log("data");
    console.log(data);
   
    for(const postKey in data) {
        const post = data[postKey];
        console.log("user data");
        console.log(post);
            postsGUI += displayMyPost(post, postKey)
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = postsGUI;
    });
};

function deleteCard(postKey){
    console.log("deleting post");
    firebase.database().ref(`users/${googleUser.uid}/${postKey}`).remove();
}