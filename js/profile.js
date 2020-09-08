authintication()
menuNavigationSwitch()


const editDataInput = () => {

}

const getProfileData = () => {
    // const uid = Cookies.get("uid")
    // if 

    const createInfoEleAppendToProfile = (type, value, inputName, selector) => {
        const editIcon = document.createElement('i')
        const input = document.createElement('input')
        const editIconContainer = document.createElement('div')
        input.classList.add("profile-data-input")
        editIconContainer.classList.add("profile-data-icon-container")
        editIcon.classList.add("profile-data-icon", "fas", "fa-pencil-alt")
        const container = document.querySelector(selector)
        container.innerHTML = ""
        container.classList.remove("profile-data-and-input-filler")

        console.log(type.toLowerCase())
        input.name = inputName
        if (type.toLowerCase() === "heading") {
            const headingEle = document.createElement('h2')
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

        icons.forEach((icon) => {
            let opened = false
            icon.addEventListener("click", () => {
                const container = icon.parentElement
                const value = container.firstElementChild
                const input = container.querySelector("input")
                console.log(opened)
                if (opened) {
                    value.style.display = "block"
                    input.style.display = "none"
                    opened = false
                } else {
                    value.style.display = "none"
                    input.style.display = "block"
                    opened = true
                }
            })
        })
        // const inputs = document.querySelectorAll(".profile-data-input")
        // inputs.forEach((input) => {
        //     const inputId = input.getAttribute("id")
        //     const inputName = input.name
        //     console.log("id:", inputId)
        //     console.log("name:", inputName)
        // })
        // console.log(inputs)
    }
    db.ref(`users/C16NeLUBm5XfzKSuySJf7Ti1Uw92`).on("value", (snapshot) => {
        const user = snapshot.val()
        const name = user.name
        const email = user.email
        const img = user.profileImageUrl
        const articles = user.articles
        console.log(articles)
        const imgContainer = document.querySelector(".profile-image ")
        const articelNumberEle = document.querySelector("#article-number")
        if (!articles) articelNumberEle.innerHTML = "0"
        if (articles) articelNumberEle.innerHTML = Object.keys(articles).length

        const imgEle = imgContainer.querySelector("img")
        imgEle.src = img

        createInfoEleAppendToProfile("heading", name, "name", "#nameProfileContainer")
        createInfoEleAppendToProfile("text", email, "email", "#emailProfileContainer")
        // createInfoEleAppendToProfile("heading", name, "name", "#nameProfileContainer")
        // createInfoEleAppendToProfile("heading", name, "name", "#nameProfileContainer")

        changeData()
    })
}

getProfileData()