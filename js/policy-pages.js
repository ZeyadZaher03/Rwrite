const uid = Cookies.get("uid");
if (uid) {
    db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
        if (snapshot.val()) menuNavigationSwitch("admin")
        else menuNavigationSwitch("user")
    })
} else {
    menuNavigationSwitch("guest")
}
authintication()