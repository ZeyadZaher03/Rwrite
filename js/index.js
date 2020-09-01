auth.onAuthStateChanged((user) => {
    if (!user || !Cookies.get("uid")) {
        return window.location.replace("register.html");
    }
});