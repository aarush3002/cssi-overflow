//import {getIDs} from './script.js';
//const scriptModule = require("./script.js");
//import {userID, postID} from './script.js';
const curr_userID = getCook('curr_userID');
const post_userID = getCook('userID');
const post_ID = getCook('postID');

let userObj;

window.onload = () => {
    const postRef = firebase.database().ref(`users/${post_userID}/${post_ID}`);
    console.log(postRef);
    postRef.on('value', (snapshot) => {
        const data = snapshot.val();
        document.querySelector("#app").innerHTML = displayPost(data, post_ID, post_userID);
        document.querySelector("#postTitle").innerHTML = data["title"];
    });

    firebase.auth()
        .onAuthStateChanged(user => {
            if (user) {
                userObj = user;
            }
            else {
                window.location = 'index.html';
            }
        });
        
    getComments();
};

const getComments = () => {
  const postRef = firebase.database().ref(`users/${post_userID}/${post_ID}/comments`)
  console.log("Getting comments");
  postRef.on('value', (snapshot) => {
    console.log("get ref to database");
    const comments = snapshot.val();
    let commentsGUI = ``;
    for(const commentKey in comments) {
        console.log(commentKey);
        commentsGUI += renderComment(commentKey, comments[commentKey]);
    }
    // Inject our string of HTML into our viewNotes.html page
    document.querySelector('#comments').innerHTML = commentsGUI;
    });
};

function displayPost(post, postKey, userKey) {
    console.log("Displaying post");
    console.log(post);
    var title = post["title"];
    var content = post["content"];
    const time = creationTime(post.timestamp);
    if (getCook('curr_userID') === getCook('userID'))
    {
        return `
        <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
                <div class="card m-3"> 
                    <div class="card-content">
                        <div class="content">
                            ${content}
                          <br>
                          <br>
                          <time><em>Post created on: ${time}</em></time>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" onclick="addComment()" class="card-footer-item">Comment</a>
                        <a href="#" onclick="editPost()" class="card-footer-item">Edit Post</a>
                    </footer>
                </div>
            </div>
            <div class="column"></div>
        </div>
        `;
    }
    else {
        return `
        <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
                <div class="card m-3">
                    <div class="card-content">
                        <div class="content">
                            ${content}
                            <br>
                            <br>
                            <time><em>Post created on: ${time}</em></time>
                        </div>
                    </div>    
                    <footer class="card-footer">
                        <a href="#" onclick="addComment()" class="card-footer-item">Comment</a>
                    </footer>
                </div>
            </div>
            <div class="column"></div>
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
    getComments();
    closeEditModal();
}

const addComment = () => {
    const commentModal = document.querySelector('#commentModal');
    commentModal.classList.toggle('is-active');
    //set comment modal to active
    //let user make comment (or cancel)
    //save comment in database, storing the following attributes:
        //comment user obj (which has displayName and uid attributes)
        //comment content
    //render the newly made comment on the webpage by calling renderComments() function
}

const closeCommentModal = () => {
    const commentModal = document.querySelector("#commentModal");
    commentModal.classList.toggle("is-active");
}

const saveComment = () => {
    const commentContent = document.querySelector("#commentInput").value;
    firebase.database().ref(`users/${post_userID}/${post_ID}/comments`).push({
        commentUser: userObj.displayName,
        commentText: commentContent,
        timestamp: Date.now()
    });
    //how to push comments to database???
    //comment ID --> how to add all this at once?
        //commenter user ID (doable)
        //comment content (doable)
    
    closeCommentModal();
}

const renderComment = (commentKey, comment) => {
    const content = comment.commentText;
    const username = comment.commentUser;
    const time = creationTime(comment.timestamp);
    console.log(userObj.displayName);
    console.log(username);
    if (userObj.displayName === username) {
        return `
        <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
                <div class="card m-3">
                    <header class="card-header">
                        <button class="delete" onclick="deleteComment('${commentKey}')"> </button>
                    </header>
                    <div class="card-content">
                        <div class="content"> ${content} </div>
                        <br>
                        <time><em>Commented on: ${time}</em> by <strong>${username}</strong></time>
                    </div>
                    <footer class="card-footer">
                        <button class="is-primary" onclick="editComment()">Edit</button>
                    </footer>
                </div>
            </div>
            <div class="column"></div>
        </div>`
    } else {
        return `
        <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
                <div class="card m-3">
                    <div class="card-content">
                        <div class="content"> ${content} </div>
                        <br>
                        <time><em>Commented on: ${time}</em> by <strong>${username}</strong></time>
                    </div>
                </div>
            </div>
            <div class="column"></div>
        </div>`;
    }
}

function creationTime(epoch) {
    const dateObject = new Date(epoch);
    return dateObject.toLocaleString();
}

function deleteComment(commentKey){
    if (confirm("Are you sure you want to delete this comment?"))
    {
        console.log("deleting comment");
        firebase.database().ref(`users/${post_userID}/${post_ID}/comments/${commentKey}`).remove();
    }
    else {
        return 0;
    }
}

const editComment = () => {
    const editCommentModal = document.querySelector('#editCommentModal');
    editCommentModal.classList.toggle('is-active');
}

const closeEditCommentModal = () => {
    const editCommentModal = document.querySelector("#editCommentModal");
    editCommentModal.classList.toggle("is-active");
}

const saveEditedComment = () => {
    const commentContent = document.querySelector("#commentInput").value;
    firebase.database().ref(`users/${post_userID}/${post_ID}/comments`).push({
        commentUser: userObj.displayName,
        commentText: commentContent,
        timestamp: Date.now()
    });
    closeCommentModal();
}
