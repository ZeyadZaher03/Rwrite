authintication()
menuNavigationSwitch()
const uid = Cookies.get("uid") || "C16NeLUBm5XfzKSuySJf7Ti1Uw92"


const profileSideNavigationStyle = () => {
    window.addEventListener("scroll", (e) => {
        const profileSideNav = document.querySelector(".profile-sidenav")
        const child = profileSideNav.querySelector(".profile-container-sidenav")
        const rect = profileSideNav.getBoundingClientRect()
        const screenWidth = window.innerWidth
        const scrollTop = window.scrollY

        const startingAnimation = () => {
            anime({
                targets: ".sticky",
                top: ["0", "2rem"],
                easing: "easeInOutSine",
                duration: 200,
            })
        }
        const endingAnimation = () => {
            anime({
                targets: ".sticky",
                top: ["2rem", "0"],
                easing: "easeInOutSine",
                duration: 200,
            })
        }

        if (screenWidth > 1000) {
            if (485 <= scrollTop) {
                child.classList.add("sticky")
                // startingAnimation()
            } else {

                // endingAnimation()
                child.classList.remove("sticky")
            }
        }

    })
}
profileSideNavigationStyle()

const updateProfileDataInDb = (inputName, value) => {
    const userQuery = db.ref(`users/${uid}`)
    // name
    if (inputName === "name") {
        userQuery.update({
            name: value
        })
    }
    // email
    else if (inputName === "email") {
        userQuery.update({
            email: value
        })
    }
    // bio
    else if (inputName === "bio") {
        userQuery.update({
            bio: value
        })
    }
    // image
    else if (inputName === "image") {
        userQuery.update({
            profileImageUrl: value
        })
    }
    // header 
    else if (inputName === "header") {
        userQuery.update({
            profileHeader: value
        })
    }
}

const getProfileData = () => {

    const buttonFunctionality = (button, name) => {
        const container = button.parentElement
        const input = container.querySelector(".profile-data-input")
        const link = container.querySelector(".profile-add-item")

        const close = () => {
            input.style.display = "none"
            button.style.display = "none"
            link.style.display = "block"
        }

        button.addEventListener("click", (e) => {
            e.preventDefault()
            close()
            updateProfileDataInDb(name, input.value)
        })
    }

    const linkFunctionality = (link) => {
        const options = {
            isInputVis: false
        }

        link.addEventListener("click", (e) => {
            e.preventDefault()
            const container = link.parentElement
            const input = container.querySelector(".profile-data-input")
            const button = container.querySelector(".profile-data-input-button")

            const open = () => {
                input.style.display = "block"
                link.style.display = "none"
                button.style.display = "block"
            }

            const close = () => {
                input.style.display = "none"
                button.style.display = "none"
                link.style.display = "block"
            }

            if (options.isInputVis) return close()
            else return open()
        })
    }

    const onAddNewProp = (name) => {
        const addNewPropLinks = document.querySelectorAll(".profile-add-item")
        const buttonsSubmit = document.querySelectorAll(".profile-data-input-button")
        addNewPropLinks.forEach((addNewPropLink) => linkFunctionality(addNewPropLink))
        buttonsSubmit.forEach((button) => buttonFunctionality(button, name))
    }

    //  =============
    const createLinkAndAdd = (name, linkText, selector) => {
        const container = document.querySelector(selector)
        container.classList.remove("profile-data-and-input-filler")

        const input = document.createElement('input')
        input.classList.add("profile-data-input")
        input.name = name
        input.placeholder = linkText

        const button = document.createElement("button")
        button.classList.add("profile-data-input-button")
        button.innerHTML = "done"

        const icon = document.createElement("i")
        icon.classList.add("fas", "fa-plus", "profile-data-input-icon")

        const linkEle = document.createElement('a')
        linkEle.href = "#"
        linkEle.classList.add("profile-add-item")
        linkEle.innerHTML = linkText
        linkEle.name = name

        linkEle.appendChild(icon)
        container.appendChild(linkEle)
        container.appendChild(input)
        container.appendChild(button)

        onAddNewProp(name)
    }


    const createInfoEleAppendToProfile = (type, value, inputName, selector) => {
        const container = document.querySelector(selector)
        container.innerHTML = ""
        container.classList.remove("profile-data-and-input-filler")

        const input = document.createElement('input')
        input.classList.add("profile-data-input")
        input.name = inputName

        const editIconContainer = document.createElement('div')
        editIconContainer.classList.add("profile-data-icon-container")

        const editIcon = document.createElement('i')
        editIcon.classList.add("profile-data-icon", "fas", "fa-pencil-alt")


        if (type.toLowerCase() === "heading") {
            const headingEle = document.createElement('h2')
            headingEle.classList.add("profile-value-animation-class")
            headingEle.innerHTML = value

            container.appendChild(headingEle)
        } else if (type.toLowerCase() === "text") {
            const textEle = document.createElement('p')
            textEle.innerHTML = value

            container.appendChild(textEle)
        }

        editIconContainer.appendChild(editIcon)
        container.appendChild(input)
        container.appendChild(editIconContainer)
    }

    const changeData = () => {
        const icons = document.querySelectorAll(".profile-data-icon-container")
        const options = {
            isChangeValueOpendInput: false
        }
        icons.forEach((icon) => {
            icon.addEventListener("click", () => {

                const container = icon.parentElement
                const value = container.firstElementChild
                const inputClass = ".profile-data-input"
                const textClass = ".profile-value-animation-class"
                const input = container.querySelector("input")
                const closeAnimtation = () => {
                    // anime({
                    // targets: inputClass,
                    // opacity: ["1", "0"],
                    // duration: 200,
                    // easing: "easeInOutSine",
                    // complete() {
                    input.style.display = "none"
                    value.style.display = "block"
                    //         anime({
                    //             targets: textClass,
                    //             opacity: ["0", "1"],
                    //             duration: 200,
                    //             easing: "easeInOutSine",
                    //         })
                    //     }
                    // })
                }

                const openAnimtation = () => {
                    // anime({
                    //     targets: textClass,
                    //     opacity: ["1", "0"],
                    //     duration: 100,
                    //     easing: "easeInOutSine",
                    //     complete() {
                    //         anime({
                    //             targets: inputClass,
                    //             opacity: ["0", "1"],
                    //             duration: 100,
                    //             easing: "easeInOutSine",
                    //         })
                    //     }
                    // })
                    input.style.display = "block"
                    value.style.display = "none"
                }
                if (options.isChangeValueOpendInput) {
                    closeAnimtation()
                    options.isChangeValueOpendInput = false
                } else {
                    openAnimtation()
                    options.isChangeValueOpendInput = true
                }
            })
        })

        const inputs = document.querySelectorAll(".profile-data-input")
        inputs.forEach((input) => {
            const inputName = input.name
            input.addEventListener("keydown", (e) => {
                if (e.key == "Enter") updateProfileDataInDb(inputName, input.value)
            })
        })
    }
    db.ref(`users/${uid}`).on("value", (snapshot) => {
        const user = snapshot.val()
        const name = user.name
        const email = user.email
        const bio = user.bio


        const img = user.profileImageUrl
        const articles = user.articles
        const imgContainer = document.querySelector(".profile-image ")
        const articelNumberEle = document.querySelector("#article-number")
        if (!articles) articelNumberEle.innerHTML = "0"
        if (articles) articelNumberEle.innerHTML = Object.keys(articles).length

        const imgEle = imgContainer.querySelector("img")
        imgEle.src = img
        if (bio) {
            createInfoEleAppendToProfile("text", bio, "bio", "#bioProfileContainer")
        } else {
            createLinkAndAdd("bio", "Add Bio ", "#bioProfileContainer")
        }
        createInfoEleAppendToProfile("heading", name, "name", "#nameProfileContainer")
        createInfoEleAppendToProfile("text", email, "email", "#emailProfileContainer")

        changeData()
    })
}

getProfileData()