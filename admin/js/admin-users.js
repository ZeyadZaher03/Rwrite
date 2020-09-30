const users = async () => {
    const createUsersElements = (name, id) => {
        const container = document.createElement("div");
        const nameEle = document.createElement("p");
        const deleteBtn = document.createElement("button");

        container.dataset.id = id;
        nameEle.innerHTML = name;
        deleteBtn.innerHTML = "Remove";

        container.classList.add("item-container");
        deleteBtn.classList.add("btn", "delete", "btn-user");

        container.appendChild(nameEle);
        container.appendChild(deleteBtn);

        return container;
    };
    const deleteUser = () => {
        const deleteButtons = document.querySelectorAll(".btn-user");
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener("click", (e) => {
                const id = deleteButton.parentNode.dataset.id;
                e.preventDefault();
                if (confirm("you sure")) runDeleteUser(id);
            });
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
            container.appendChild(createUsersElements(name, id));
        });
        deleteUser();
    });
};

users();