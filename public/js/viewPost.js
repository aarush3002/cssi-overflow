//import {getIDs} from './script.js';
//const scriptModule = require("./script.js");
//import {userID, postID} from './script.js';

window.onload = () => {
    const curr_userID = getCook('curr_userID');
    const post_userID = getCook('userID');
    const post_ID = getCook('postID');
    const postRef = firebase.database().ref(`users/${post_userID}/${post_ID}`);
    console.log(postRef);
    postRef.on('value', (snapshot) => {
        const data = snapshot.val();
        document.querySelector("#app").innerHTML = displayPost(data, post_ID, post_userID);
    });
};

function displayPost(post, postKey, userKey) {
    console.log("Displaying post");
    console.log(post);
    var title = post["title"];
    var content = post["content"];
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
            </div>
        </div>
    </div>
    `;
}

function getCook(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};