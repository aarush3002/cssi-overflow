window.onload = (event) => {
    const testPostID = `-Mg7LyifWn9OC_9kou7-`;
    const testRef = firebase.database().ref(`test/${testPostID}`);
    testRef.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(data);
        document.querySelector("#postTitle").innerHTML += data.title;
        document.querySelector("#postContent").innerHTML += data.content;
    });
};