auth.onAuthStateChanged((user) => {
    if (user || Cookies.get("uid") == true) {
        return window.location.replace("register.html");
    }
});