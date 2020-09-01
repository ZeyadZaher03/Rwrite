auth.onAuthStateChanged((user) => {
    if (!user || !Cookies.get("uid")) {
        return window.location.replace("register.html");
    }
});
const uid = Cookies.get("uid")
const editor1 = CKEDITOR.replace('editor1');
const addArticleForm = document.querySelector(".article-form-container")
const addArticleFormButton = document.querySelector(".article-form-button")
addArticleForm.addEventListener("submit", (e) => e.preventDefault())

addArticleFormButton.addEventListener("click", (e) => {
    const name = addArticleForm["name"].value
    const tagline = addArticleForm["tagline"].value
    const description = addArticleForm["description"].value
    const twiiter = addArticleForm["twiiter"].value
    const facebook = addArticleForm["facebook"].value
    const instagram = addArticleForm["instagram"].value
    const email = addArticleForm["email"].value
    const tags = addArticleForm["tags"].value
    const editor = addArticleForm["editor"].value
    const writers = addArticleForm["writers"].value
    const article = CKEDITOR.instances.editor1.getData()
    const articleObj = {
        name,
        tagline,
        description,
        twiiter,
        facebook,
        instagram,
        email,
        tags,
        editor,
        writers,
        article,
    }
    db.ref(`users/${uid}/articles`).push(articleObj)
    e.preventDefault()
})