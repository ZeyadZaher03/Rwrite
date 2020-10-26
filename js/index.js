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

const createArticleItem = (articleData, articleId, name) => {

    const articleContainer = document.createElement("a")
    const imageContainer = document.createElement("div")
    const imageEle = document.createElement("img")
    const ArticleTagLine = document.createElement("h3")
    const ArticleDetails = document.createElement("div")
    const ArticleWriter = document.createElement("p")
    const ArticleDate = document.createElement("p")


    articleContainer.classList.add("arcticle-item")
    imageContainer.classList.add("arcticle-item-image-container")
    imageEle.classList.add("arcticle-item-image")
    ArticleTagLine.classList.add("arcticle-item-tagline")
    ArticleDetails.classList.add("arcticle-item-details")
    ArticleWriter.classList.add("arcticle-item-writer")
    ArticleDate.classList.add("arcticle-item-date")

    imageEle.src = articleData.image
    ArticleTagLine.innerHTML = articleData.tagline
    ArticleWriter.innerHTML = `writer: ${name}`
    ArticleDate.innerHTML = "29/10/2020"
    articleContainer.href = articleId

    articleContainer.appendChild(imageContainer)
    imageContainer.appendChild(imageEle)
    articleContainer.appendChild(ArticleTagLine)
    articleContainer.appendChild(ArticleDetails)
    ArticleDetails.appendChild(ArticleWriter)
    ArticleDetails.appendChild(ArticleDate)

    return articleContainer
}



const getTrendingArticles = async () => {
    const container = document.querySelector(".trending")
    const trendingArticlsQuery = db.ref(`articles`).once("value")
    const trendingArticlesSnapshot = await trendingArticlsQuery
    container.innerHTML = ""

    const articleGlider = new Glider(container, {
        slidesToShow: 5,
        slidesToScroll: 3,
        draggable: true,
    });
    articleGlider
    const latestArticlesSnapshotArray = []
    trendingArticlesSnapshot.forEach((articleSnapshot) => {
        const articleId = articleSnapshot.key
        latestArticlesSnapshotArray.push(articleId)
    })
    let counter = 0
    latestArticlesSnapshotArray.reverse().forEach((articleSnapshotKey) => {
        db.ref(`articles/${articleSnapshotKey}`).once("value", (articleSnapshot) => {
            if (counter < 8) {
                const articleData = articleSnapshot.val()
                const articleWriterUid = articleData.uid
                const isHidden = articleData.isHidden
                if (!isHidden) {
                    counter++
                    db.ref(`users/${articleWriterUid}`).once("value", async (writerSnapshot) => {
                        const writerData = await writerSnapshot.val()
                        const imgURL = writerData.imageURL || "assets/image/userImageFiller.png"
                        const name = writerData.name
                        articleGlider.addItem(createTrendingItem(articleData, articleSnapshotKey, name, imgURL))
                    })
                }
            }
        })


    })

    document.querySelector(".arcticle-container").innerHTML = ""
    latestArticlesSnapshotArray.reverse().forEach((articleSnapshotKey) => {
        db.ref(`articles/${articleSnapshotKey}`).once("value", (articleSnapshot) => {
            const articleData = articleSnapshot.val()
            const articleWriterUid = articleData.uid
            const isHidden = articleData.isHidden
            if (!isHidden) {
                db.ref(`users/${articleWriterUid}`).once("value", async (writerSnapshot) => {
                    const writerData = await writerSnapshot.val()
                    const name = writerData.name
                    document.querySelector(".arcticle-container").appendChild(createArticleItem(articleData, articleSnapshotKey, name))
                })
            }
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