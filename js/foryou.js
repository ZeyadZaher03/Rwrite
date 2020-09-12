authintication()
menuNavigationSwitch()


const url = new URL(location.href).searchParams
const selectedTag = url.get("tag")


const createArticleEle = (snapshot) => {
    const id = snapshot.key
    const articleData = snapshot.val()

    const tagline = articleData.tagline
    const description = articleData.description
    const imageUrl = articleData.image
    const name = articleData.name
    const readingTime = articleData.est


    const parent = document.querySelector(".foryou")

    const container = document.createElement("a")
    container.classList.add("article-link")
    container.href = `articleview.html?id=${id}`
    const infoContainer = document.createElement("div")
    infoContainer.classList.add("article-link-info")

    const taglineEle = document.createElement("h3")
    taglineEle.classList.add("article-link-tagline")

    const descriptionEle = document.createElement("p")
    descriptionEle.classList.add("article-link-descriptinon")

    const nameEle = document.createElement("p")
    nameEle.classList.add("article-link-publication-name")

    const detailsContainer = document.createElement("div")
    detailsContainer.classList.add("article-link-small-info")

    const dateEle = document.createElement("p")
    dateEle.classList.add("article-link-date")

    const readingTimeEle = document.createElement("p")
    readingTimeEle.classList.add("article-link-min-reading")

    const actionContainer = document.createElement("div")
    actionContainer.classList.add("article-link-actions")

    const bookmarkIconConatainer = document.createElement("div")
    bookmarkIconConatainer.classList.add("article-link-bookmark")

    const bookmarkIcon = document.createElement("i")
    bookmarkIcon.classList.add("far", "fa-bookmark")
    bookmarkIconConatainer.appendChild(bookmarkIcon)

    const optionsIconConatainer = document.createElement("div")
    optionsIconConatainer.classList.add("article-link-options")

    const optionsIcon = document.createElement("i")
    optionsIcon.classList.add("fas", "fa-ellipsis-h")
    optionsIconConatainer.appendChild(optionsIcon)

    actionContainer.appendChild(bookmarkIconConatainer)
    actionContainer.appendChild(optionsIconConatainer)

    const imageContainer = document.createElement("div")
    imageContainer.classList.add("article-link-image")
    const imgEle = document.createElement("img")

    imageContainer.appendChild(imgEle)

    detailsContainer.appendChild(dateEle)
    detailsContainer.appendChild(readingTimeEle)

    infoContainer.appendChild(taglineEle)
    infoContainer.appendChild(descriptionEle)
    infoContainer.appendChild(nameEle)
    infoContainer.appendChild(detailsContainer)
    infoContainer.appendChild(actionContainer)
    container.appendChild(infoContainer)
    container.appendChild(imageContainer)

    container.dataset.id = id

    imgEle.src = imageUrl
    taglineEle.innerHTML = tagline
    descriptionEle.innerHTML = description
    nameEle.innerHTML = name
    dateEle.innerHTML = moment().format("MMM DD")
    readingTimeEle.innerHTML = readingTime


    parent.appendChild(container)

}

const getArticles = async () => {
    const articlesQuery = db.ref(`articles`)
    const articlesSnapshot = await articlesQuery
    document.querySelector(".foryou").innerHTML = ""

    articlesSnapshot.on("value", (snapshot) => {
        let selectedArticles = []
        snapshot.forEach((childSnapshot) => {
            const dbTags = childSnapshot.val().tags
            if (dbTags.includes(selectedTag)) {
                selectedArticles.push(childSnapshot)
            }
        });
        selectedArticles.forEach(childSnapshot => createArticleEle(childSnapshot))
    })
}

getArticles()