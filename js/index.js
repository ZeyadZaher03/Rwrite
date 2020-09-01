auth.onAuthStateChanged((user) => {
    console.log(Cookies.get("uid"))
    console.log(user)
    // if (!Cookies.get("uid")) {
    //     return window.location.replace("register.html");
    // }
});