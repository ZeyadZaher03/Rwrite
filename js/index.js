auth.onAuthStateChanged((user) => {
    if (!user || !uid) {
        Cookies.remove("uid")
        Cookies.remove("email")
        auth.signOut()
    } else {
        console.log("logedin")
    }
});

const register = () => {
    const loginButton = document.querySelector("#LoginButton")
    const authForm = document.querySelector(".register-container")

    const closeRegisterAnimation = () => {
        anime({
            targets: ".register-container",
            top: ["170", "130"],
            opacity: ["1", "0"],
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
            top: ["150", "170"],
            opacity: ["0", "1"],
            duration: 300,
            easing: 'easeInOutQuad',
        })
    }

    const registerPopup = () => {

        const options = {
            loginRegPopupVis: false
        }

        loginButton.addEventListener("click", (e) => {
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



    const signInWithFaceBook = () => {
        const facebookLoginButton = document.querySelector(".register-facebook-login")
        facebookLoginButton.addEventListener("click", (e) => {
            e.preventDefault()
            const provider = new firebase.auth.FacebookAuthProvider();
            // provider.addScope("user_birthday");
            provider.setCustomParameters({
                display: "popup",
            });

            auth
                .signInWithPopup(provider)
                .then((result) => {
                    var user = result.user;
                    var uid = user.uid;
                    var email = result.user.email;
                    var name = result.user.displayName;

                    db.ref("users").once("value", (res) => {
                        Cookies.set("uid", uid)
                        Cookies.set("email", email)
                        if (res.val()) return
                        db.ref(`users/${uid}`).set({
                            name,
                            email
                        })
                    })
                }).catch((err) => {
                    console.log(err)
                })
        })
    }
    registerPopup()
    signInWithFaceBook()
}
register()