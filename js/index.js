// // auth.onAuthStateChanged((user) => {
// //     if (!user || !Cookies.get("uid")) {
// //         Cookies.remove("uid")
// //         return window.location.replace("register.html");
// //     }
// // });

// const 
// const authForm = document.querySelector(".register-container")
// const options = {
//     loginRegPopupVis: false
// }
// loginButton.addEventListener("click", (e) => {
//     e.preventDefault()
//     if (options.loginRegPopupVis) {
//         console.log("make unvis")
//         anime({
//             targets: ".register-container",
//             top: ["170", "130"],
//             opacity: ["1", "0"],
//             duration: 250,
//             easing: 'easeInOutQuad',
//             complete() {
//                 authForm.style.display = "none"
//             }
//         })
//         options.loginRegPopupVis = false
//     } else {
//         authForm.style.display = "flex"
//         anime({
//             targets: ".register-container",
//             top: ["130", "170"],
//             opacity: ["0", "1"],
//             duration: 400,
//             easing: 'easeInOutQuad',
//         })
//         options.loginRegPopupVis = true
//     }
// })

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

    registerPopup()

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
                        }).then((response) => {
                            window.location.replace("index.html");
                        })
                    })
                }).cathc((err) => {
                    console.log(err)
                })
        })
    }
    signInWithFaceBook()
}
register()