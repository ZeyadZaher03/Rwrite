authintication()
menuNavigationSwitch()


const editDataInput = () => {

}

const getProfileData = () => {
    const uid = Cookies.get("uid")
    if (!uid) return
    db.ref(`users/${uid}`).once("value", (snapshot) => {
        console.log(snapshot.val())
    })
}

getProfileData()