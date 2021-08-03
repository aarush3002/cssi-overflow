//import {getIDs} from './script.js';
//const scriptModule = require("./script.js");
//import {userID, postID} from './script.js';

window.onload = (event) => {
    console.log(document.cookie);
    const testPostID = `-Mg7LyifWn9OC_9kou7-`;
    const testRef = firebase.database().ref(`test/${testPostID}`);
    testRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        document.querySelector("#postTitle").innerHTML += data.title;
        document.querySelector("#postContent").innerHTML += data.content;
    });
};