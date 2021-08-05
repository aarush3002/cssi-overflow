let googleUser;
//export {userID, postID};
const searchForm = document.querySelector("#filter-form");
const searchButton = document.querySelector("#tagSearch");

console.log("Home page script loaded");
function creationTime(epoch) {
    const dateObject = new Date(epoch);
    return dateObject.toLocaleString();
}

function displayPost(post, postKey, userKey) {
    console.log("Displaying post");
    console.log(post);
    var title = post["title"];
    var content = post["content"].substring(0, 100) + "...";
    var username = post["username"]
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
    <div id = "${postKey}" class="card m-3 has-background-light" onclick="openPost(\'${postKey}\',\'${userKey}\')">
        <header class="card-header has-background-info-light">
            <p class="card-header-title">
                ${title}
            </p>
        </header>
        <div class="card-content">
            <div class="content">
                ${content}
                <br>
                <br>
                <time><em>Post created on: ${time}</em> by <strong>${username}</strong></time>
            </div>
            <div id = "tag-container">${tag}</div>
        </div>
    </div>
    `;
}

function openPost(postID, userID) {
    document.cookie = `userID=${userID};`
    document.cookie = `postID=${postID};`
    window.location = "viewPost.html";
    console.log("Post clicked");
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

searchForm.addEventListener('keyup', e => hideUnfilteredCards(e.target.value));
searchButton.addEventListener('click', e => hideUnfilteredCards(searchForm.value));

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
            postsGUI += displayPost(post, postKey, userKey)
        }
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#app').innerHTML = postsGUI;
    });
};

const viewPost = (postID, userID) => {
    document.cookie = `userID=${userID};`
    document.cookie = `postID=${postID};`
    window.location = "viewPost.html";
};

function hideUnfilteredCards(searchTerm) {
    // Create a regular expression that checks if the search term is anywhere inside a string 
    // .* on both sides means that any characters can come before or after the search term
    const searchRe = new RegExp(`.*(${searchTerm.toLowerCase()}).*`);
    const postsRef = firebase.database().ref(`users`).orderByChild('timestamp').limitToLast(100);
    console.log("Getting notes");
    postsRef.on('value', (snapshot) => {
        console.log("get ref to database");
        const data = snapshot.val();
        for (const userKey in data) {
            const userData = data[userKey];
            console.log("user data");
            console.log(userData);
            for (const postKey in userData) {
                const post = userData[postKey];
                console.log("post");
                console.log(post);
                // Check if the search term mastches the card title
                const foundTitleMatch = searchRe.test(post.title.toLowerCase());
                var foundTagMatch;
                // Check if search term matches some (one or more) of the tags. If any matches, it returns true
                if(post.tags != null){
                    console.log(post.title);
                    foundTagMatch = post.tags.some(t => searchRe.test(t));
                }
                if (searchTerm === "" || foundTitleMatch || foundTagMatch) {
                    document.getElementById(postKey).classList.remove("hidden");
                    console.log("false");
                } else {
                    document.getElementById(postKey).classList.add("hidden");
                    console.log("true");
                }


            }
        }

    });
};