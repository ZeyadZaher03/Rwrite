authintication()
menuNavigationSwitch()
if (!Cookies.get("uid")) {
    location.replace("index.html")
}
const runArticle = () => {
    const getDisplay = (item) => getComputedStyle(item).display;

    const tagsArray = [];
    const writerArray = [];
    const editorArray = [];

    const tags = ({
        containerSelector,
        inputSelector,
        buttonSelector,
        maxNumber,
        arrayOfValues
    }) => {
        const container = document.querySelector(containerSelector);
        const addItemInput = document.querySelector(inputSelector);
        const addItembutton = document.querySelector(buttonSelector);

        const createElement = (item, index) => {
            const itemContainer = document.createElement("div");
            const itemName = document.createElement("p");
            const itemDelete = document.createElement("button");

            itemContainer.classList.add("article-item-style");
            itemName.classList.add = "";
            itemDelete.classList.add("deleteItem");

            itemDelete.innerHTML = "X";
            itemName.innerHTML = item;

            itemContainer.dataset.index = index;

            itemContainer.appendChild(itemName);
            itemContainer.appendChild(itemDelete);
            return itemContainer;
        };

        const deleteItem = () => {
            const divs = document.querySelectorAll(".article-item-style");
            divs.forEach((div) => {
                div.addEventListener("click", (e) => {
                    e.preventDefault();
                    const index = div.dataset.index;
                    arrayOfValues.splice(index, 1);
                    createElements();
                });
            });
        };

        const createElements = () => {
            container.innerHTML = "";
            arrayOfValues.forEach((item, index) => {
                container.appendChild(createElement(item, index));
            });
            deleteItem();
        };

        const inputItemVisAnimation = () => {
            addItemInput.style.display = "inline-block";
        };

        const inputItemHideAnimation = () => {
            addItemInput.style.display = "none";
        };

        addItembutton.addEventListener("click", (e) => {
            e.preventDefault();
            if (arrayOfValues.length >= maxNumber) return;
            if (getDisplay(addItemInput) == "none") return inputItemVisAnimation();
            if (!addItemInput.value) return;
            if (getDisplay(addItemInput) !== "none") {
                arrayOfValues.push(addItemInput.value);
                inputItemHideAnimation();
                createElements();
                addItemInput.value = "";
            }
        });
    };

    const addTagsOptions = {
        containerSelector: "#tagsContainer",
        inputSelector: "#addtagInput",
        buttonSelector: "#addtagButton",
        maxNumber: 5,
        arrayOfValues: tagsArray,
    };

    const addWritersOption = {
        containerSelector: "#writer-item-container",
        inputSelector: "#addWriterInput",
        buttonSelector: "#addWriterButton",
        maxNumber: 5,
        arrayOfValues: writerArray,
    };

    const addEditorsOption = {
        containerSelector: "#editor-item-container",
        inputSelector: "#addEditorInput",
        buttonSelector: "#addEditorButton",
        maxNumber: 5,
        arrayOfValues: editorArray,
    };

    tags(addTagsOptions);
    tags(addWritersOption);
    tags(addEditorsOption);


    CKEDITOR.replace("editor1");
    const addArticleForm = document.querySelector(".article-form-container");
    const addArticleButton = document.querySelector(".publish-button");
    const articleContent = document.querySelector("#article-content");
    const articletime = document.querySelector("#reading-time");

    const addArticle = () => {
        const article = CKEDITOR.instances.editor1.getData();
        articleContent.innerHTML = article

        $('#article-content').readingTime({
            readingTimeAsNumber: true,
            readingTimeTarget: $('#reading-time'),
        })

        const name = addArticleForm["name"];
        const tagline = addArticleForm["tagline"];
        const description = addArticleForm["description"];

        const twiiter = addArticleForm["twitter"];
        const facebook = addArticleForm["facebook"];
        const instagram = addArticleForm["instagram"];
        const email = addArticleForm["email"];

        const est = articletime.innerHTML
        const errorMessages = () => {
            let emptyValues = 0
            const errorInput = (ele, errorMessage) => {
                if (ele.value === "") {
                    const inputInfo = ele.parentNode.querySelector('.input-text')
                    const tip = inputInfo.innerHTML
                    const err = errorMessage
                    const errClass = "input-text-err"
                    emptyValues++
                    inputInfo.classList.add(errClass)
                    inputInfo.innerHTML = err
                    ele.addEventListener("change", () => {
                        inputInfo.innerHTML = tip
                        inputInfo.classList.remove(errClass)
                    })
                }
            }
            if (article === "") {
                emptyValues++
                const errArea = document.querySelector("#article-err-message")
                const errorMessage = "Please Write the Article body"
                const articleBodyInput = document.querySelector("#editor1");
                errArea.innerHTML = errorMessage
            }


            errorInput(name, "Name is Required")
            errorInput(tagline, "tagline is Required")
            errorInput(description, "description is Required")

            return emptyValues
        }


        const articleObj = {
            name: name.value,
            tagline: tagline.value,
            description: description.value,
            twiiter: twiiter.value,
            facebook: facebook.value,
            instagram: instagram.value,
            email: email.value,
            est,
            tags: tagsArray,
            writer: writerArray,
            editor: editorArray,
            article,
            uid: Cookies.get("uid")
        };

        return {
            article: articleObj,
            numberOfErrors: errorMessages()
        };
    };

    const addArticleToDb = async (articleObj) => {
        await db.ref(`articles`).push(articleObj).then((snapshot) => {
            id = snapshot.key
            db.ref(`users/${Cookies.get("uid")}/articles`).push(id)
        })
    }
    addArticleForm.addEventListener("submit", (e) => e.preventDefault());
    addArticleButton.addEventListener("click", (e) => {
        e.preventDefault();
        const article = addArticle().article
        const errorsInArticle = addArticle().numberOfErrors
        if (errorsInArticle > 0) return
        addArticleToDb(article)
        addArticleForm.reset()

    });

    CKEDITOR.instances.editor1.on('change', () => {
        const errArea = document.querySelector("#article-err-message")
        errArea.innerHTML = ""
    });
};
runArticle();