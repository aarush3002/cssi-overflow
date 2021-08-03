let googleUser;
let userID, postID;
//export {userID, postID};

console.log("Home page script loaded");
function creationTime(epoch) {
    const dateObject = new Date(epoch);
    return dateObject.toLocaleString();
}

function displayPost(post, postKey) {
    postID = postKey;
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
        </header>
        <div class="card-content">
            <div class="content">
                ${content}
                <br>
                <time>${time}</time>
            </div>
            <button class="is-primary" onclick="viewPost()">View Post</button>
        </div>
    </div>
    `;
}

window.onload = (event) => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        googleUser = user;
        userID = user.uid;
        getNotes(user.uid);
        } else {
        window.location = 'index.html'; // 'index.html' is the login page
        }
    });
}

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users`).orderByChild('timestamp').limitToLast(100);
  console.log("Getting notes");
  notesRef.on('value', (snapshot) => {
      console.log("get ref to database");
    const data = snapshot.val();
    let postsGUI = ``;
    console.log("data");
    console.log(data);
    for(const userKey in data) {
        const userData = data[userKey];
        console.log("user data");
        console.log(userData);
        for(const postKey in userData) {
            const post = userData[postKey];
            console.log("post");
            console.log(post);
            postsGUI += displayPost(post, postKey)
        }
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = postsGUI;
    });
};

const viewPost = () => {
    document.cookie = `userID=${userID};`
    document.cookie = `postID=${postID};`
    window.location = "viewPost.html";
};