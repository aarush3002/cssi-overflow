console.log("JS ready");
let googleUser;
const tagForm = document.querySelector("#tag");
const tagContainer = document.querySelector("#tag-container");

function createPost() {
    document.querySelector("#progressBar").classList.remove("hidden");
    var tagArray = [];
    var title = document.querySelector("#title").value;
    var content = document.querySelector("#content").value;
    for (var t = 0; t< tagContainer.querySelectorAll("span.new-tag").length; t++){
        tagArray.push(tagContainer.querySelectorAll("span.new-tag")[t].innerText);
    }
    console.log(tagArray);
    if (title != null || content != null) {
        firebase.database().ref(`users/${googleUser.uid}`).push({
            title: title,
            content: content,
            timestamp: Date.now(),
            tags: tagArray
        }).then(() => {
            console.log("change page");
            window.location = 'myPosts.html';

        }).catch(error => {
            //Something bad happened :(
            console.log(error);
        });

        console.log("created post");
    }
    //; //TODO: Go to 'my posts' page

    document.querySelector("#progressBar").classList.add("hidden");
}

window.onload = (event) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            googleUser = user;
        } else {
            window.location = 'index.html'; // 'index.html' is the login page
        }
    });
};

tagForm.addEventListener('keypress', e => {
    if (e.code == "Enter") {
        const tagValue = tagForm.value.trim();
        console.log(e.code);
        if (tagValue === "") {
            return;
        }
        const newTagElement = document.createElement("span");
        newTagElement.classList.add("new-tag", "tag", "is-danger");
        newTagElement.textContent = tagValue;
        const tagDeleteButton = document.createElement("button");
        tagDeleteButton.classList.add("delete");
        newTagElement.appendChild(tagDeleteButton);
        tagDeleteButton.addEventListener('click', event => {
            newTagElement.remove();
        });
        tagContainer.appendChild(newTagElement);

        tagForm.value = "";
    }
});

