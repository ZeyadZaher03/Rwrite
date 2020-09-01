auth.onAuthStateChanged((user) => {
    if (user || Cookies.get("uid") == true) {
        return window.location.replace("index.html");
    }
});

const facebookButton = document.querySelector("#login_with_facebook");
facebookButton.addEventListener("click", (e) => {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope("user_birthday");
    provider.setCustomParameters({
        display: "popup",
    });

    auth
        .signInWithPopup(provider)
        .then((result) => {
            console.log(result);
            //   This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            var uid = user.uid;
            var email = result.user.email;
            var name = result.user.displayName;
            db.ref(`users/${email}`).push({
                name
            }).then((response) => {
                Cookies.set("uid", uid)
                Cookies.set("email", email)
                window.location.replace("index.html");
            })
            // ...
        })
        .catch((error) => {
            console.log(error);
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // The email of the user's account used.
            // var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            // ...
        });
});