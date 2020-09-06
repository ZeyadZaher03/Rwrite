const menuNavigationSwitch = () => {
    const menuButton = document.querySelector(".nav-menu")
    const menuOptions = {
        isOpened: false
    }
    const closeAnimation = () => {
        anime({
            targets: ".sidemenu",
            left: ["0", '-40rem'],
            easing: "easeInOutSine",
            duration: 200
        })
        anime({
            targets: ".container",
            left: ["40rem", '0rem'],
            easing: "easeInOutSine",
            duration: 200
        })
    }

    const openAnimation = () => {
        anime({
            targets: ".sidemenu",
            left: ["-40rem", '0'],
            easing: "easeInOutSine",
            duration: 300
        })
        anime({
            targets: ".container",
            left: ["0", '40rem'],
            easing: "easeInOutSine",
            duration: 300
        })
    }

    menuButton.addEventListener('click', (e) => {
        e.preventDefault()
        if (!menuOptions.isOpened) {
            openAnimation()
            menuOptions.isOpened = true
        } else {
            closeAnimation()
            menuOptions.isOpened = false
        }
    })
}

const authintication = () => {
    auth.onAuthStateChanged((user) => {
        const uid = Cookies.get("uid");
        const registerButton = document.querySelector(".registerbutton");
        console.log("id", uid);
        console.log("user", user);

        if (!user || !uid) {
            Cookies.remove("uid");
            Cookies.remove("email");
            auth.signOut();
            registerButton.setAttribute("id", "LoginButton");
            registerButton.innerHTML = "Register / Log in";
            register();
        } else {
            registerButton.innerHTML = "Logout";
            registerButton.setAttribute("id", "logoutButton");
            logout();
        }
    });

    const logout = () => {
        const closeRegisterAnimation = () => {
            if (window.innerWidth < 800) {
                anime({
                    targets: ".register-container",
                    top: ["140", "110"],
                    opacity: ["1", "0"],
                    duration: 200,
                    easing: "easeInOutQuad",
                    complete() {
                        authForm.style.display = "none";
                    },
                });
            } else {
                anime({
                    targets: ".register-container",
                    top: ["170", "130"],
                    opacity: ["1", "0"],
                    duration: 200,
                    easing: "easeInOutQuad",
                    complete() {
                        authForm.style.display = "none";
                    },
                });
            }
        };
        const logoutButton = document.querySelector("#logoutButton");
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            auth.signOut();
            Cookies.remove("uid");
            Cookies.remove("email");
            closeRegisterAnimation();
        });
    };

    const register = () => {
        const loginButton = document.querySelector("#LoginButton");
        const authForm = document.querySelector(".register-container");

        const closeRegisterAnimation = () => {
            if (window.innerWidth < 800) {
                anime({
                    targets: ".register-container",
                    top: ["140", "110"],
                    opacity: ["1", "0"],
                    duration: 200,
                    easing: "easeInOutQuad",
                    complete() {
                        authForm.style.display = "none";
                    },
                });
            } else {
                anime({
                    targets: ".register-container",
                    top: ["170", "130"],
                    opacity: ["1", "0"],
                    duration: 200,
                    easing: "easeInOutQuad",
                    complete() {
                        authForm.style.display = "none";
                    },
                });
            }
        };

        const openRegisterAnimation = () => {
            if (window.innerWidth < 800) {
                authForm.style.display = "flex";
                anime({
                    targets: ".register-container",
                    top: ["130", "150"],
                    opacity: ["0", "1"],
                    duration: 300,
                    easing: "easeInOutQuad",
                });
            } else {
                authForm.style.display = "flex";
                anime({
                    targets: ".register-container",
                    top: ["150", "170"],
                    opacity: ["0", "1"],
                    duration: 300,
                    easing: "easeInOutQuad",
                });
            }
        };

        const registerPopup = () => {
            const options = {
                loginRegPopupVis: false,
            };

            loginButton.addEventListener("click", (e) => {
                e.preventDefault();
                if (!options.loginRegPopupVis) {
                    openRegisterAnimation();
                    options.loginRegPopupVis = true;
                } else {
                    closeRegisterAnimation();
                    options.loginRegPopupVis = false;
                }
            });
        };

        const signInWithFaceBook = () => {
            const facebookLoginButton = document.querySelector(".register-facebook-login");
            facebookLoginButton.addEventListener("click", (e) => {
                e.preventDefault();
                const provider = new firebase.auth.FacebookAuthProvider();
                provider.addScope("user_birthday");
                provider.addScope("user_link");
                provider.addScope("instagram_basic");
                provider.addScope("email");
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
                        console.log(result);
                        Cookies.set("uid", uid);
                        Cookies.set("email", email);
                        db.ref("users").once("value", (res) => {
                            if (res.val()) return;
                            db.ref(`users/${uid}`).set({
                                name,
                                email,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        };
        registerPopup();
        signInWithFaceBook();
    };
}