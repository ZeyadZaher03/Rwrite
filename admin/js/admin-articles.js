const uid = Cookies.get("uid")
auth.onAuthStateChanged((user) => {
    db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
        if (!user || !uid || !snapshot.val()) {
            location.href = "../index.html"
        }
    })
})

const articles = async () => {
    // creating article element
    const createArticlsElements = (name, id, uid, isHidden) => {
        // creating elements
        const container = document.createElement("div");
        const buttonsContainer = document.createElement("div");
        const nameEle = document.createElement("p");
        const deleteBtn = document.createElement("button");
        const hideBtn = document.createElement("button");

        // setting up element attributes
        container.dataset.id = id;
        container.dataset.userId = uid;

        // elements values
        nameEle.innerHTML = name;
        deleteBtn.innerHTML = "Remove";
        hideBtn.innerHTML = "Hide"

        // elements classes
        container.classList.add("item-container");
        buttonsContainer.classList.add("buttons-container");
        deleteBtn.classList.add("btn", "delete", "btn-article");
        hideBtn.classList.add("btn", "hide", "btn-article-hide");

        // arranging elements
        buttonsContainer.appendChild(nameEle);
        container.appendChild(nameEle);
        container.appendChild(buttonsContainer);

        // if the article is hidden put a message beside it saying its hidden
        if (isHidden) {
            const hiddenEle = document.createElement("p");
            hiddenEle.innerHTML = "hidden"
            hiddenEle.classList.add("hiddenEle");
            buttonsContainer.appendChild(hiddenEle);
        }

        buttonsContainer.appendChild(hideBtn);
        buttonsContainer.appendChild(deleteBtn);

        // return the div containg the data
        return container;
    };

    // delete article
    const deleteArticle = () => {
        const deleteButtons = document.querySelectorAll(".btn-article");
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                const id = deleteButton.parentNode.parentNode.dataset.id;
                const userId = deleteButton.parentNode.parentNode.dataset.userId;
                // delete article message
                if (confirm("you sure you want to delete this article")) runDeleteUser(id, userId);
            });
        });
    };

    // hide article
    const hideArticles = () => {
        const hideButtons = document.querySelectorAll(".btn-article-hide");
        hideButtons.forEach((hideButton) => {
            hideButton.addEventListener("click", (e) => {
                const id = hideButton.parentNode.parentNode.dataset.id;
                e.preventDefault();
                // hide article warning message
                if (confirm("you sure you want to hide this article")) hideArticle(id);
            });
        });
    }

    // hide article from the db
    const hideArticle = (id) => {
        db.ref(`articles/${id}`).update({
            isHidden: true
        });
    };

    // delete article from the db
    const runDeleteUser = async (id, userId) => {
        const articleSnapshot = await db.ref(`articles/${id}/tags`).once("value")
        const articleData = articleSnapshot.val()

        // delete article from tag if there is tag associated with this article
        if (!!articleData) {
            db.ref(`tags`).once("value", (snapshot) => {
                snapshot.forEach(childsnapshot => {
                    const tagName = childsnapshot.key
                    childsnapshot.forEach(articlesSnapshot => {
                        const snapshotId = articlesSnapshot.key
                        const articleId = articlesSnapshot.val()
                        console.log(articleId == id)
                        if (articleId == id) {
                            db.ref(`tags/${tagName}/${snapshotId}`).remove()
                        }
                    })
                })
            });

        }


        // delete article from user data
        db.ref(`users/${userId}/articles`).once("value", (snapshot) => {
            snapshot.forEach(childSnapshot => {
                const snapshotId = childSnapshot.key
                const articleId = childSnapshot.val()
                if (articleId === id) db.ref(`users/${userId}/articles/${snapshotId}`).remove()
            })
        })

        // delete article it self
        db.ref(`articles/${id}`).remove()
    };

    // fetching articles from the db 
    await db.ref(`articles`).on("value", (snapshot) => {
        const container = document.querySelector(".items-container");
        container.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const userObj = childSnapshot.val();
            const id = childSnapshot.key;
            const name = userObj.tagline;
            const isHidden = userObj.isHidden;
            const userId = userObj.uid;
            container.appendChild(createArticlsElements(name, id, userId, isHidden));
        });
        deleteArticle();
        hideArticles();
    });
};

articles();