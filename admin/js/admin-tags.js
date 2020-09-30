const articles = async () => {
    const createTagsElements = (name, id) => {
        const container = document.createElement("div");
        const buttonsContainer = document.createElement("div");
        const nameEle = document.createElement("p");
        const deleteBtn = document.createElement("button");

        container.dataset.id = id;
        nameEle.innerHTML = name;

        deleteBtn.innerHTML = "Remove";


        container.classList.add("item-container");
        buttonsContainer.classList.add("buttons-container");
        deleteBtn.classList.add("btn", "delete", "btn-tags");

        buttonsContainer.appendChild(nameEle);
        container.appendChild(nameEle);
        container.appendChild(buttonsContainer);
        buttonsContainer.appendChild(deleteBtn);

        return container;
    };
    const deleteTag = () => {
        const deleteButtons = document.querySelectorAll(".btn-tags");
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                const id = deleteButton.parentNode.parentNode.dataset.id;
                if (confirm("you sure")) runDeleteTag(id);
            });
        });
    };

    const runDeleteTag = (id) => {
        db.ref(`tags/${id}`).once("value", (snapshot) => {
            snapshot.forEach(childsnapshot => {
                const snapshotId = childsnapshot.key
                const articleId = childsnapshot.val()
                db.ref(`articles/${articleId}`).once("value", (articlesSnapshot) => {
                    const articleObj = articlesSnapshot.val()
                    const articleUser = articleObj.uid
                    db.ref(`users/${articleUser}/articles`).once("value", (userSnapshot) => {
                        userSnapshot.forEach(article => {
                            const articleSnapshotId = article.key
                            const articleId = article.val()
                            console.log(articleId)
                            if (articleId == articleId) {
                                db.ref(`users/${articleUser}/articles/${articleSnapshotId}`).remove()
                            }
                        });
                    })
                    db.ref(`articles/${articleId}`).remove()
                })

            })
            db.ref(`tags/${id}`).remove()
        })
    };



    await db.ref(`tags`).on("value", (snapshot) => {
        const container = document.querySelector(".items-container");
        container.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const id = childSnapshot.key;
            container.appendChild(createTagsElements(id, id));
        });
        deleteTag();
        // hideArticles();
    });
};

articles();