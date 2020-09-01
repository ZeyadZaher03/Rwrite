auth.onAuthStateChanged((user) => {
    if (!Cookies.get("uid")) {
        return window.location.replace("register.html");
    }
});