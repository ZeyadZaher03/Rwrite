authintication()
menuNavigationSwitch("admin")


const tag = async () => {
    const parent = document.querySelector(".tags")

    const createTagLink = (name) => {
        const link = document.createElement("a")
        link.classList.add("tag-main-item")
        link.href = `section.html?tag=${name}`
        link.innerHTML = `#${name}`

        parent.appendChild(link)
    }

    db.ref(`tags`).on("value", (snapshot) => {
        const tagsObj = snapshot.val()
        parent.innerHTML = ""
        for (const tag in tagsObj) createTagLink(tag)
    })
}

tag()

if (window.innerWidth < 800) {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 2,
        slidesToScroll: 1,
        draggable: true,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
    });
} else {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 5,
        slidesToScroll: 3,
        draggable: true,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
    });
}


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
        console.log(articleData)
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
        articleData.tags.forEach(tag => {
            const articleTag = document.createElement("a")
            articleTag.innerHTML = tag
            articleTag.classList.add("tag-item", "trending-tag-item")
            articleTagsContainer.appendChild(articleTag)
        })
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

    trendingArticlesSnapshot.forEach((articleSnapshot) => {
        const articleId = articleSnapshot.key
        const articleData = articleSnapshot.val()
        const articleWriterUid = articleData.uid
        db.ref(`users/${articleWriterUid}`).once("value", (writerSnapshot) => {
            const writerData = writerSnapshot.val()
            const imgURL = writerData.imageURL || "assets/image/userImageFiller.png"
            const name = writerData.name
            container.appendChild(createTrendingItem(articleData, articleId, name, imgURL))
        })
    })
}

getTrendingArticles()