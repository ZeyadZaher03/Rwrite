const register = () => {
    const closeRegisterAnimation = () => {
        anime({
            targets: ".register-container",
            top: ["100", "70"],
            top: ["1", "0"],
            duration: 200,
            easing: 'easeInOutQuad',
            complete() {
                authForm.style.display = "none"
            }
        })
    }

    const openRegisterAnimation = () => {
        authForm.style.display = "flex"
        anime({
            targets: ".register-container",
            top: ["70", "100"],
            top: ["0", "1"],
            duration: 300,
            easing: 'easeInOutQuad',
        })
    }

    const registerPopup = () => {
        const button = document.querySelector("button")
        const authForm = document.querySelector(".register-container")
        const options = {
            loginRegPopupVis: false
        }


        button.addEventListener("click", (e) => {
            e.preventDefault()
            if (!(options.loginRegPopupVis)) {
                openRegisterAnimation()
                options.loginRegPopupVis = true
            } else {
                closeRegisterAnimation()
                options.loginRegPopupVis = false
            }
        })

    }

    registerPopup()

    const signInWithFaceBook = () => {
        const facebookLoginButton = document.querySelector(".register-facebook-login")
        facebookLoginButton.addEventListener((e) => {
            e.preventDefault()
            console.log(e)
        })
    }
    signInWithFaceBook()
}
register()
// auth.onAuthStateChanged((user) => {
//     if (!!user) {
//         auth.signOut()
//         Cookies.remove("uid")
//     }

//     if ((!!Cookies.get("uid")) == true) {
//         return window.location.replace("index.html");
//     }
// });

// const facebookButton = document.querySelector("#login_with_facebook");
// facebookButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     const provider = new firebase.auth.FacebookAuthProvider();
//     provider.addScope("user_birthday");
//     provider.setCustomParameters({
//         display: "popup",
//     });

//     auth
//         .signInWithPopup(provider)
//         .then((result) => {
//             // console.log(result);
//             var user = result.user;
//             var uid = user.uid;
//             var email = result.user.email;
//             var name = result.user.displayName;
//             console.log(user);
//             console.log(email);
//             console.log(name);
//             console.log(uid);
//             //   This gives you a Google Access Token. You can use it to access the Google API.
//             // var token = result.credential.accessToken;
//             // The signed-in user info.
//             db.ref(`users/${uid}/name`).set(name).then((response) => {
//                 Cookies.set("uid", uid)
//                 Cookies.set("email", email)
//                 window.location.replace("index.html");
//             })
//             // ...
//         })
//         .catch((error) => {
//             console.log(error);
//             // Handle Errors here.
//             // var errorCode = error.code;
//             // var errorMessage = error.message;
//             // The email of the user's account used.
//             // var email = error.email;
//             // The firebase.auth.AuthCredential type that was used.
//             // var credential = error.credential;
//             // ...
//         });
// });