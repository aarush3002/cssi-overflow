//import {getIDs} from './script.js';
//const scriptModule = require("./script.js");
//import {userID, postID} from './script.js';
const curr_userID = getCook('curr_userID');
const post_userID = getCook('userID');
const post_ID = getCook('postID');

window.onload = () => {
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
    if (getCook('curr_userID') === getCook('userID'))
    {
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
                <button class="is-primary" onclick="editPost()">Edit Post</button>
            </div>
        </div>
        `;
    }
    else {
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

const editPost = () => {
    //set the "editPost" modal to active
    //modal has 2 inputs (for title and content respectively)
        //input fields should be pre-populated with existing data
        //user should be able to edit the input fields
        //user can either save or cancel their edits
            //push changes to database if user selects "save"
            //otherwise don't do anything
    const editPostModal = document.querySelector('#editPostModal');
    const postRef = firebase.database().ref(`users/${post_userID}/`);
    postRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const postDetails = data[post_ID];
        document.querySelector('#editTitleInput').value = postDetails.title;
        document.querySelector('#editContentInput').value = postDetails.content;
    });
    editPostModal.classList.toggle('is-active');
}

const closeEditModal = () => {
    const editPostModal = document.querySelector("#editPostModal");
    editPostModal.classList.toggle("is-active");
}

const saveEditedPost = () => {
    const newTitle = document.querySelector("#editTitleInput").value;
    const newContent = document.querySelector("#editContentInput").value;

    firebase.database().ref(`users/${post_userID}/${post_ID}`)
        .set({
            title: newTitle,
            content: newContent
        });
    closeEditModal();
}