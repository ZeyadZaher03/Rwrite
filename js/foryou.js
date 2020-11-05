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
const getBookmarks = async () => {
    const bookmarks = []
    const bookmarksQuery = await db.ref(`users/${"z26b90gJxfY9R61RlCdfV4KQDtu2"}/bookmarks`);
    const bookmarksDb = await bookmarksQuery.once("value");
    await bookmarksDb.forEach((bookmark)=>{
        bookmarks.push(bookmark.val())
    })
    return bookmarks
}



const url = new URL(location.href).searchParams
const selectedTag = url.get("tag") || "rwrite"

const addToBookMarks = async () => {
    
    const myBookmarks = await getBookmarks()

    const bookMarkButtons = document.querySelectorAll(".article-link-bookmark")
    bookMarkButtons.forEach(bookMarkButton => {
        bookMarkButton.addEventListener("click",  (e)=>{
            e.preventDefault()
            const articleId = bookMarkButton.parentElement.parentElement.parentElement.dataset.id
            const bookMarkErrorMessage = "You must be logedin"
            const bookMarkSuccessMessage = "Added successfully"
            
            if(!uid) return displayMessage("topCenter", "error" , bookMarkErrorMessage ,2000)

            const addToBookMarkrun = ()=>{
                bookMarkButton.querySelector("svg").dataset.prefix = "fas"
                db.ref(`users/${uid}/bookmarks/${articleId}`)
                .set(articleId)
                .then(() => {
                    displayMessage("topCenter", "success" ,bookMarkSuccessMessage, 2000)
                    myBookmarks.push(articleId)
                });
            }

            const removeToBookMarkrun = ()=>{
                bookMarkButton.querySelector("svg").dataset.prefix = "far"
                db.ref(`users/${uid}/bookmarks/${articleId}`)
                .remove()
                .then(() => {
                    displayMessage("topCenter", "success" , "bookmark is successfully removed" ,2000)
                    const indexOfId = myBookmarks.indexOf(articleId)
                    myBookmarks.splice(indexOfId,1)
                });
            }

            if(myBookmarks.includes(articleId)) {
                removeToBookMarkrun()
            } else{                
                addToBookMarkrun()
            }
        })
    })
}


const getArticles = async () => {
    const parent = document.querySelector(".foryou")
    const myBookmarks = await getBookmarks()

    const createArticleEle = (snapshot,isInBookMarks) => {
        
        const id = snapshot.key
        const articleData = snapshot.val()
        const tagline = articleData.tagline
        const description = articleData.description
        const imageUrl = articleData.image
        const name = articleData.name
        const readingTime = articleData.est



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
        if(isInBookMarks){
            bookmarkIcon.classList.add("fas", "fa-bookmark")
        }else{
            bookmarkIcon.classList.add("far", "fa-bookmark")
        }
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

        return container
    }

    const tagsQuery = db.ref(`tags/${selectedTag}`)
    const tagsSnapshot = await tagsQuery
    document.querySelector(".foryou").innerHTML = ""

    tagsSnapshot.on("value", (snapshot) => {
        


        let selectedArticles = []

        snapshot.forEach((childSnapshot) => {
            selectedArticles.push(childSnapshot.val())
        });

        let count = 0
        selectedArticles.forEach(async (id) => {
            count++

            if (count == selectedArticles.length) {
                db.ref(`articles/${id}`).once("value", (articleData) => {
                    const isHidden = articleData.val().isHidden
                    const isInBookMarks = myBookmarks.includes(id)
                    if (!isHidden) parent.appendChild(createArticleEle(articleData,isInBookMarks))
                    addToBookMarks(myBookmarks)
                })
            } 
            else {
                db.ref(`articles/${id}`).once("value", (articleData) => {
                    const isHidden = articleData.val().isHidden
                    const isInBookMarks = myBookmarks.includes(id)
                    if (!isHidden) parent.appendChild(createArticleEle(articleData,isInBookMarks))
                })
            }

        });

    })
}

const getPopularTasks = async () => {
    const container = document.querySelector(".popular-articles-container-items")

    const createPopularArticleElement = (articleObj, id, counter) => {
        const title = articleObj.tagline
        const description = articleObj.description;
        const readingTime = articleObj.est

        const container = document.createElement("a")
        const conuterEle = document.createElement("span")
        const articleInfoContainer = document.createElement("span")
        const articleName = document.createElement("h3")
        const articleDescription = document.createElement("p")
        const articleDetailsContainer = document.createElement("div")
        const articleDate = document.createElement("div")
        const articleReadingTime = document.createElement("div")

        container.href = `http://127.0.0.1:5500/articleview.html?id=${id}`
        container.dataset.id = id

        conuterEle.innerHTML = counter
        articleName.innerHTML = title
        articleDescription.innerHTML = description
        articleReadingTime.innerHTML = readingTime + " reading time"
        articleDate.innerHTML = "aug 29"

        container.classList.add("popular-article")
        conuterEle.classList.add("popular-article-number")
        articleInfoContainer.classList.add("popular-article-info")
        articleName.classList.add("popular-article-heading")
        articleDescription.classList.add("popular-article-name")
        articleDetailsContainer.classList.add("article-link-small-info")
        articleDate.classList.add("article-link-date")
        articleReadingTime.classList.add("article-link-min-reading")

        container.appendChild(conuterEle)
        container.appendChild(articleInfoContainer)
        articleInfoContainer.appendChild(articleName)
        articleInfoContainer.appendChild(articleDescription)
        articleInfoContainer.appendChild(articleDetailsContainer)
        articleDetailsContainer.appendChild(articleReadingTime)
        articleDetailsContainer.appendChild(articleDate)

        return container
    }

    const articlesQuery = db.ref(`articles`).once("value")
    const articlesSnapshot = await articlesQuery
    container.innerHTML = ""
    let articleCounter = 0
    articlesSnapshot.forEach((snapshot) => {
        const articleId = snapshot.key
        const articleObj = snapshot.val()
        const isHidden = articleObj.isHidden
        if (!isHidden) {
            articleCounter++
            if (articleCounter <= 6) {
                container.appendChild(createPopularArticleElement(articleObj, articleId, articleCounter))
            }
        }
    })

}
getPopularTasks()
getArticles()