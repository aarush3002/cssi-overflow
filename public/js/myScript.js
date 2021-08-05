let googleUser;
let userID;

console.log("My Posts page script loaded");
function creationTime(epoch) {
    const dateObject = new Date(epoch);
    return dateObject.toLocaleString();
}

function displayMyPost(post,postKey, userKey) {
    console.log("Displaying post");
    console.log(post);
    var title = post["title"];
    var content = post["content"].substring(0, 100) + "...";
    var tag = ``;
    if(post.tags){
        for(let i = 0; i<post.tags.length; i++){
            tag += `<span class="tag is-link is-light mr-3">${post.tags[i]}</span>`;
        }
        
    }

    const time = creationTime(post.timestamp);
    console.log("Time: ");
    console.log(time);
    return `
    <div class="card m-3 m-3 has-background-light">
        <header class="card-header has-background-info-light">
            <p class="card-header-title"  onclick="openPost(\'${postKey}\',\'${userKey}\')">
                ${title}
            </p>
            <button class="delete" 
                onclick = "deleteCard('${postKey}')">
            </button>
        </header>
        <div class="card-content"  onclick="openPost(\'${postKey}\',\'${userKey}\')">
            <div class="content">
                ${content}
                <br>
                <br>
                <time><em>Post created on: ${time}</em></time>
            </div>
            <div id = "tag-container">${tag}</div>
        </div>
    </div>
    `;
}

function openPost(postID, userID) {
    console.log("Post clicked");
    document.cookie = `userID=${userID};`
    document.cookie = `postID=${postID};`
    window.location = "viewPost.html";
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
            postsGUI += displayMyPost(post, postKey, userId)
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = postsGUI;
    });
};

function deleteCard(postKey){
    if (confirm("Are you sure you want to delete this post?"))
    {
        console.log("deleting post");
        firebase.database().ref(`users/${googleUser.uid}/${postKey}`).remove();
    }
}

const viewPost = (postID, userID) => {
    document.cookie = `userID=${userID};`
    document.cookie = `postID=${postID};`
    window.location = "viewPost.html";
};