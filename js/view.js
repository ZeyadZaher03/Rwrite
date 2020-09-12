authintication()
menuNavigationSwitch()

const url = new URL(location.href).searchParams
const id = url.get("id")

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


// if (id) return undefined

const runArticle = async () => {
    const articleData = await getArticle()

    const image = articleData.image
    const name = articleData.name
    const tagline = articleData.tagline
    const article = articleData.article

    console.log(article)
    console.log(image)
    console.log(tagline)
    console.log(name)

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