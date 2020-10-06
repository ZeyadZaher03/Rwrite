authintication()
menuNavigationSwitch()

const url = new URL(location.href).searchParams
const id = url.get("id")
const uid = Cookies.get("uid") || "C16NeLUBm5XfzKSuySJf7Ti1Uw92"
console.log(uid)

const getWriters = async () => {
    const writersSnapshot = await db.ref(`articles/${id}/writer`).once("value")
    const writers = await writersSnapshot.val()
    return await writers
}

const getMyName = async () => {
    const userSnapshot = await db.ref(`users/${uid}/name`).once("value")
    const name = await userSnapshot.val()
    return await name
}

const getArticle = async () => {
    const aticleQuery = await db.ref(`articles/${id}`)
    const snapshot = await aticleQuery.once("value")
    const articleData = snapshot.val()
    const views = snapshot.val().views
    aticleQuery.update({
        views: views + 1
    })
    return articleData
}


if (!id) {
    location.href = "index.html"
}

const runArticle = async () => {
    const articleData = await getArticle()

    const image = articleData.image
    const name = articleData.name
    const tagline = articleData.tagline
    const article = articleData.article

    const articleImageEle = document.querySelector("#article_image")
    const articleBody = document.querySelector(".article_body")
    const articleTagline = document.querySelector(".article_tagline")
    const articleName = document.querySelector(".article_name")

    articleImageEle.src = image
    articleBody.innerHTML = article
    articleTagline.innerHTML = tagline
    articleName.innerHTML = `by: ${name}`
}

runArticle()


const commentSystem = async () => {
    const writers = await getWriters()
    const name = await getMyName()
    const addComment = () => {
        const commentForm = document.querySelector(".add-comment")
        const commentinput = commentForm["comment"]
        commentForm.addEventListener("submit", e => {
            e.preventDefault()
            if (!uid) {
                commentinput.value = ""
                return alert("login to be able to comment")
            } else if (!(writers.includes(name))) {
                commentinput.value = ""
                return alert("You are not tagged in this Article")
            }

            const comment = commentinput.value

            if (comment === "") return
            const timestamp = new Date().getTime()

            db.ref(`articles/${id}/comments`).push({
                "uid": uid,
                "comment": comment,
                "data": timestamp
            })
            commentForm.reset()
        })
    }
    addComment()

    const viewComments = () => {
        const container = document.querySelector(".comment-container")
        createCommentItem = (name, comment) => {
            const commentItemContainer = document.createElement("div")
            const nameContainer = document.createElement("h5")
            const commentText = document.createElement("p")

            nameContainer.innerHTML = `${name}:`
            commentText.innerHTML = comment

            commentItemContainer.classList.add("comment-item-container")
            commentItemContainer.appendChild(nameContainer)
            commentItemContainer.appendChild(commentText)

            return commentItemContainer
        }
        db.ref(`articles/${id}/comments`).on("value", (snapshot) => {
            container.innerHTML = ""
            snapshot.forEach((childSnapshot) => {

                const commentObj = childSnapshot.val()
                const comment = commentObj.comment
                const userId = commentObj.uid

                const generateComment = async () => {
                    const userNameQuery = await db.ref(`users/${userId}/name`).once("value")
                    const name = await userNameQuery.val()
                    container.appendChild(createCommentItem(name, comment))
                }

                generateComment()
            })

        })
    }
    viewComments()
}

commentSystem()