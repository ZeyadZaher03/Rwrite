authintication()
const uid = Cookies.get("uid");
if (uid) {
    db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
        if (snapshot.val()) menuNavigationSwitch("admin")
        else menuNavigationSwitch("user")
    })
} else {
    menuNavigationSwitch("guest")
}


const tag = async () => {
    const parent = document.querySelector(".tags")

    const createTagLink = (name) => {
        const link = document.createElement("a")
        link.classList.add("tag-main-item")
        link.href = `section.html?tag=${name}`
        link.innerHTML = `#${name}`
        parent.appendChild(link)
    }
    let counter = 0
    db.ref(`tags`).on("value", (snapshot) => {
        const numberOfTags = snapshot.numChildren()

        const tagsObj = snapshot.val()
        parent.innerHTML = ""
        for (const tag in tagsObj) {
            counter++
            createTagLink(tag)
            if (counter === numberOfTags) {
                new Glider(parent, {
                    slidesToShow: 8,
                    slidesToScroll: 3,
                    draggable: true,
                });
            }
        }

    })

    const tagsContainer = document.querySelector('.tags')
    console.log(tagsContainer)

}

tag()

// if (window.innerWidth < 800) {
//     new Glider(document.querySelector('.glider'), {
//         slidesToShow: 5,
//         slidesToScroll: 1,
//         draggable: true,
//         dots: '.dots',
//         arrows: {
//             prev: '.glider-prev',
//             next: '.glider-next'
//         },
//     });
// } else {
//     new Glider(document.querySelector('.glider'), {
//         slidesToShow: 5,
//         slidesToScroll: 3,
//         draggable: true,
//         dots: '.dots',
//         arrows: {
//             prev: '.glider-prev',
//             next: '.glider-next'
//         },
//     });
// }


const createTrendingItem = (articleData, articleId, writerName, writerImageURL) => {
    const addClassesAndAttributes = () => {
        // Adding attributes and Classes
        articleItemContainer.classList.add("trending-item")
        // articleItemContainer.classList.add("glider-slide", "trending-item")
        articleImageContainer.classList.add("trending-image-container")
        articleImage.classList.add("trending-image")
        articleName.classList.add("trending-title")


        articleDetails.classList.add("trending-details")
        articleDate.classList.add("trending-details-date")
        articleInfo.classList.add("trending-info")

        articleWriterInfo.classList.add("trendin-user")
        articleWriterImgContainer.classList.add("trendin-user-image-container")
        articleWriterImg.classList.add("trendin-user-image")
        articleWriterName.classList.add("trendin-user-name")

        articleTagsContainer.classList.add("tag-container", "trending-tag-container")
    }

    const arrangingElements = () => {
        articleImageContainer.appendChild(articleImage)
        articleDetails.appendChild(articleDate)
        articleInfo.appendChild(articleWriterInfo)
        articleWriterInfo.appendChild(articleWriterImgContainer)
        articleWriterImgContainer.appendChild(articleWriterImg)
        articleWriterInfo.appendChild(articleWriterName)
        articleInfo.appendChild(articleTagsContainer)
        articleItemContainer.appendChild(articleImageContainer)
        articleItemContainer.appendChild(articleName)
        articleItemContainer.appendChild(articleDetails)
        articleItemContainer.appendChild(articleInfo)
    }

    const AddingData = () => {
        const articleImgURL = articleData.image
        const articleNameValue = articleData.tagline
        // const articleWriter = articleData.tags
        articleItemContainer.href = `articleview.html?id=${articleId}`
        articleImage.src = articleImgURL
        articleName.innerHTML = articleNameValue
        articleWriterImg.src = writerImageURL
        articleDate.innerHTML = "aug 27 2020"
        articleWriterName.innerHTML = writerName
    }
    const createTagItems = () => {
        if (articleData.tags) {
            articleData.tags.forEach(tag => {
                const articleTag = document.createElement("a")
                articleTag.innerHTML = tag
                articleTag.classList.add("tag-item", "trending-tag-item")
                articleTagsContainer.appendChild(articleTag)
            })
        }
    }

    // Create Elements
    const articleItemContainer = document.createElement("a")
    const articleImageContainer = document.createElement("div")
    const articleImage = document.createElement("img")

    const articleName = document.createElement("p")

    const articleDetails = document.createElement("div")
    const articleDate = document.createElement("span")

    const articleInfo = document.createElement("div")
    const articleWriterInfo = document.createElement("div")
    const articleWriterImgContainer = document.createElement("div")
    const articleWriterImg = document.createElement("img")
    const articleWriterName = document.createElement("p")

    const articleTagsContainer = document.createElement("div")

    createTagItems()
    addClassesAndAttributes()
    arrangingElements()
    AddingData()

    return articleItemContainer
}


const getTrendingArticles = async () => {
    const container = document.querySelector(".trending")
    const trendingArticlsQuery = db.ref(`articles`).once("value")
    const trendingArticlesSnapshot = await trendingArticlsQuery
    container.innerHTML = ""

    let counter = 0
    const numOfArticles = trendingArticlesSnapshot.numChildren()
    const articleGlider = new Glider(container, {
        slidesToShow: 5,
        slidesToScroll: 3,
        draggable: true,
    });
    articleGlider
    trendingArticlesSnapshot.forEach((articleSnapshot) => {
        // if (counter > 2) return undefined

        const articleId = articleSnapshot.key
        const articleData = articleSnapshot.val()
        const articleWriterUid = articleData.uid
        counter++
        db.ref(`users/${articleWriterUid}`).once("value", async (writerSnapshot) => {
            const writerData = await writerSnapshot.val()
            const imgURL = writerData.imageURL || "assets/image/userImageFiller.png"
            const name = writerData.name
            const isHidden = await articleData.isHidden
            if (!isHidden) articleGlider.addItem(createTrendingItem(articleData, articleId, name, imgURL))
            console.log(articleGlider)
        })
    })


}





// new Glider(document.querySelector('.glider'), {
//     slidesToShow: 5,
//     slidesToScroll: 1,
//     draggable: true,
//     dots: '.dots',
//     arrows: {
//         prev: '.glider-prev',
//         next: '.glider-next'
//     },
// });

getTrendingArticles()