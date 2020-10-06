const uid = Cookies.get("uid")
auth.onAuthStateChanged((user) => {
    db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
        if (!user || !uid || !snapshot.val()) {
            location.href = "../index.html"
        }
    })
})

const users = async () => {
    const createUsersElements = (name, id, isAdmin) => {
        const container = document.createElement("div");
        const nameEle = document.createElement("p");
        const buttonsContainer = document.createElement("div");
        const deleteBtn = document.createElement("button");
        const adminBtn = document.createElement("button");
        container.dataset.id = id;

        // if the same user
        if (id === uid) {
            nameEle.innerHTML = `${name} (you)`;
        } else {
            nameEle.innerHTML = name;
            buttonsContainer.appendChild(deleteBtn)
            buttonsContainer.appendChild(adminBtn)
        }


        deleteBtn.innerHTML = "Remove";
        if (isAdmin) {
            adminBtn.innerHTML = "remove Admin";
            adminBtn.classList.add("btn", "hide", "btn-remove-admin");
        } else {
            adminBtn.innerHTML = "Make Admin";
            adminBtn.classList.add("btn", "hide", "btn-make-admin");
        }

        container.classList.add("item-container");
        deleteBtn.classList.add("btn", "delete", "btn-user");
        buttonsContainer.classList.add("buttons-container");

        container.appendChild(nameEle);
        container.appendChild(buttonsContainer);

        return container;
    };

    const deleteUser = () => {
        const deleteButtons = document.querySelectorAll(".btn-user");
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", (e) => {
                const id = deleteButton.parentNode.parentNode.dataset.id;
                e.preventDefault();
                if (confirm("you sure")) runDeleteUser(id);
            });
        });
    };

    // make admin
    const makeAdmin = () => {
        const makeAdminButtons = document.querySelectorAll(".btn-make-admin");
        makeAdminButtons.forEach((makeAdminButton) => {
            makeAdminButton.addEventListener("click", (e) => {
                const id = makeAdminButton.parentNode.parentNode.dataset.id;
                e.preventDefault();
                // hide article warning message
                if (confirm("you sure you want to make this user admin")) runMakeAdmin(id);
            });
        });
    }
    // turn user to admin in db
    const runMakeAdmin = (id) => {
        db.ref(`users/${id}`).update({
            isAdmin: true
        });
    };

    // make admin
    const removeAdmin = () => {
        const makeAdminButtons = document.querySelectorAll(".btn-remove-admin");
        makeAdminButtons.forEach((makeAdminButton) => {
            makeAdminButton.addEventListener("click", (e) => {
                const id = makeAdminButton.parentNode.parentNode.dataset.id;
                e.preventDefault();
                // hide article warning message
                if (confirm("you sure you want to make this user admin")) runRemoveAdmin(id);
            });
        });
    }
    // turn user to admin in db
    const runRemoveAdmin = (id) => {
        db.ref(`users/${id}`).update({
            isAdmin: false
        });
    };

    const runDeleteUser = (id) => {
        db.ref(`users/${id}`)
            .child("articles")
            .once("value", (snapshot) => {
                snapshot.forEach((articleSnapshot) => {
                    const articleId = articleSnapshot.val();
                    db.ref(`articles/${articleId}`).remove();
                });
            });
        db.ref(`users/${id}`).remove();
    };

    await db.ref(`users`).on("value", (snapshot) => {
        const container = document.querySelector(".items-container");
        container.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const userObj = childSnapshot.val();
            const id = childSnapshot.key;
            const name = userObj.name;
            const isAdmin = userObj.isAdmin;
            container.appendChild(createUsersElements(name, id, isAdmin));
        });
        deleteUser();
        makeAdmin()
        removeAdmin()
    });
};

users();