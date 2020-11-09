// get uid from the cookies  
const uid = Cookies.get("uid");

//if user not logedin redirect him to the home page
auth.onAuthStateChanged((user) => {
    if (!uid || !user) {
        // displayMessage("topCenter", "error", "you have to be signed in to access this page, you are now being redirected", 3000)
        // location.href = "index.html"
    } else {
        db.ref(`users/${uid}/isAdmin`).once("value", (snapshot) => {
            if (snapshot.val()) menuNavigationSwitch("admin")
            else menuNavigationSwitch("user")
        })
    }
})

// add article functionality
const runArticle = () => {

    const getDisplay = (item) => getComputedStyle(item).display;

    //writers and tags and editor functionalities
    const tagsArray = [];
    const writerArray = [];
    const editorArray = [];

    const tags = ({
        containerSelector,
        inputSelector,
        buttonSelector,
        maxNumber,
        arrayOfValues,
        toLowerCase
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
                if (toLowerCase) {
                    if (arrayOfValues.indexOf(addItemInput.value.toLowerCase()) !== -1) return
                    arrayOfValues.push(addItemInput.value.toLowerCase());
                } else {
                    if (arrayOfValues.indexOf(addItemInput.value) !== -1) return
                    arrayOfValues.push(addItemInput.value);
                }

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
        toLowerCase: true
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


    //run the text editor
    CKEDITOR.replace("editor1");

    // select forms and buttons 
    const addArticleForm = document.querySelector(".article-form-container");
    const addArticleButton = document.querySelector(".publish-button");
    const articleContent = document.querySelector("#article-content");
    const articletime = document.querySelector("#reading-time");

    // adding image and viewing it.
    const articleImageView = () => {
        const articleImageInput = document.querySelector("#articleImage");
        const createImageContainer = (src) => {
            const imgContainerDiv = document.createElement('div')
            const imgEle = document.createElement('img')
            const iconEle = document.createElement('i')

            imgEle.src = src
            imgContainerDiv.classList.add("input-file-image")

            iconEle.classList.add("fas", "fa-times", "input-file-close-icon")
            imgContainerDiv.appendChild(imgEle)
            imgContainerDiv.appendChild(iconEle)
            return imgContainerDiv
        }
        articleImageInput.addEventListener("change", () => {
            var reader = new FileReader();
            reader.onload = function (e) {
                const articleImage = document.querySelector(".input-image")
                articleImage.classList.add("input-image-with-image")
                articleImage.innerHTML = ``;
                articleImage.appendChild(createImageContainer(e.target.result))
            };
            reader.readAsDataURL(articleImageInput.files[0]);

        });
        removeArticleImage()
    }

    // remove article image
    const removeArticleImage = () => {

        document.querySelector('.input-image').addEventListener("click", (e) => {
            const removeIconBtn = document.querySelector(".input-file-close-icon")
            if (!!removeIconBtn) {
                e.preventDefault()
                removeIconBtn.addEventListener("click", (e) => {
                    e.preventDefault()
                    const articleImageInput = document.querySelector("#articleImage");
                    const articleImage = document.querySelector(".input-image")
                    articleImage.classList.remove("input-image-with-image")
                    articleImageInput.files[0] = ""
                    articleImage.innerHTML = `<svg enable-background="new 0 0 420.8 420.8" version="1.1" viewBox="0 0 420.8 420.8"
                              xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="m406.8 96.4c-8.4-8.8-20-14-33.2-14h-66.4v-0.8c0-10-4-19.6-10.8-26-6.8-6.8-16-10.8-26-10.8h-120c-10.4 0-19.6 4-26.4 10.8s-10.8 16-10.8 26v0.8h-66c-13.2 0-24.8 5.2-33.2 14-8.4 8.4-14 20.4-14 33.2v199.2c0 13.2 5.2 24.8 14 33.2 8.4 8.4 20.4 14 33.2 14h326.4c13.2 0 24.8-5.2 33.2-14 8.4-8.4 14-20.4 14-33.2v-199.2c0-13.2-5.2-24.8-14-33.2zm-6.8 232.4h-0.4c0 7.2-2.8 13.6-7.6 18.4s-11.2 7.6-18.4 7.6h-326.4c-7.2 0-13.6-2.8-18.4-7.6s-7.6-11.2-7.6-18.4v-199.2c0-7.2 2.8-13.6 7.6-18.4s11.2-7.6 18.4-7.6h77.2c6 0 10.8-4.8 10.8-10.8v-11.6c0-4.4 1.6-8.4 4.4-11.2s6.8-4.4 11.2-4.4h119.6c4.4 0 8.4 1.6 11.2 4.4s4.4 6.8 4.4 11.2v11.6c0 6 4.8 10.8 10.8 10.8h77.2c7.2 0 13.6 2.8 18.4 7.6s7.6 11.2 7.6 18.4v199.2z" />
                              <path
                                d="m210.4 130.8c-27.2 0-52 11.2-69.6 28.8-18 18-28.8 42.4-28.8 69.6s11.2 52 28.8 69.6c18 18 42.4 28.8 69.6 28.8s52-11.2 69.6-28.8c18-18 28.8-42.4 28.8-69.6s-11.2-52-28.8-69.6-42.4-28.8-69.6-28.8zm54.4 153.2c-14 13.6-33.2 22.4-54.4 22.4s-40.4-8.8-54.4-22.4c-14-14-22.4-33.2-22.4-54.4s8.8-40.4 22.4-54.4c14-14 33.2-22.4 54.4-22.4s40.4 8.8 54.4 22.4c14 14 22.4 33.2 22.4 54.4 0.4 21.2-8.4 40.4-22.4 54.4z" />
                              <circle cx="352.8" cy="150" r="19.6" />
                            </svg>`
                })
            }
        })
    }

    articleImageView()

    // add article functionality
    const addArticle = async () => {
        // get article body 
        const article = CKEDITOR.instances.editor1.getData();
        articleContent.innerHTML = article;

        // get the est. time to read the article
        $("#article-content").readingTime({
            readingTimeAsNumber: true,
            readingTimeTarget: $("#reading-time"),
        });

        //select article data 
        const name = addArticleForm["name"];
        const tagline = addArticleForm["tagline"];
        const description = addArticleForm["description"];
        const articelImage = addArticleForm["publication_avatar"];

        const twiiter = addArticleForm["twitter"];
        const facebook = addArticleForm["facebook"];
        const instagram = addArticleForm["instagram"];
        const email = addArticleForm["email"];

        const image = articelImage.files[0]

        const est = articletime.innerHTML;

        // handling erros
        const errorMessages = () => {
            let emptyValues = 0;
            const errorInput = (ele, errorMessage) => {
                if (ele.value === "") {
                    const inputInfo = ele.parentNode.querySelector(".input-text");
                    const tip = inputInfo.innerHTML;
                    const err = errorMessage;
                    const errClass = "input-text-err";
                    emptyValues++;
                    inputInfo.classList.add(errClass);
                    inputInfo.innerHTML = err;
                    ele.addEventListener("change", () => {
                        inputInfo.innerHTML = tip;
                        inputInfo.classList.remove(errClass);
                    });
                }
            };
            if (!image) {
                emptyValues++;
            }
            if (article === "") {
                emptyValues++;
                const errArea = document.querySelector("#article-err-message");
                const errorMessage = "Please Write the Article body";
                const articleBodyInput = document.querySelector("#editor1");
                errArea.innerHTML = errorMessage;
            }

            errorInput(name, "Name is Required");
            errorInput(tagline, "tagline is Required");
            errorInput(description, "description is Required");

            return emptyValues;
        };

        let imgUrl


        //adding image data
        const getImageUrl = async () => {
            const storageRef = firebase.storage().ref(`articles`)
            const fileName = `${new Date()}_${image.name}`
            const metaData = {
                contentType: image.type,
            }
            const driverImageUrl = await storageRef
                .child(fileName)
                .put(image, metaData)
                .then(async (snapshot) => await snapshot.ref.getDownloadURL())

            return imgUrl = driverImageUrl
        }

        if (image) await getImageUrl()

        // saving all the data inside an object 
        const articleObj = {
            name: name.value,
            tagline: tagline.value,
            description: description.value,
            twiiter: twiiter.value,
            facebook: facebook.value,
            instagram: instagram.value,
            email: email.value,
            est,
            image: imgUrl,
            views: 0,
            tags: tagsArray,
            writer: writerArray,
            editor: editorArray,
            article,
            uid,
            isHidden: true
        };

        //return the object with the number of errors
        return {
            article: articleObj,
            numberOfErrors: errorMessages(),
        };
    };

    // save articles to the db
    const addArticleToDb = async (articleObj) => {
        // make a var to store article id in
        // connncet to the db and then save it  
        let articleId
        await db
            .ref(`articles`)
            .push(articleObj)
            .then((snapshot) => {
                id = snapshot.key;
                db.ref(`users/${uid}/articles`).push(id);
                return articleId = id
            });

        // return the id
        return articleId
    };

    addArticleForm.addEventListener("submit", (e) => e.preventDefault());

    const saveNewTags = async (tags, articleId) => {
        tags.forEach((tag) => {
            db.ref(`tags/${tag}`).push(articleId)
        })
        return articleId
    }

    const mailingWriters = async (articleName, articleLink) => {
        const editorsArray = ["Adrian"]
        if (editorsArray.length <= 0) return
        
        // loop over the writers to mail them
        const usersDBConnection = await db.ref(`users`) 
        const usersSnapshot = await usersDBConnection.once("value")
        const userWithEmailAndTagname = []
        
        await usersSnapshot.forEach( async (userSnapshot)=>{
            usersSnapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val()
                const email = userData.email
                const tagName = userData.tagName
                userWithEmailAndTagname.push({email,tagName})
            });
        })

        
        
        editorsArray.forEach(async (editorName) => {
            userWithEmailAndTagname.forEach((userObj)=>{
                const email = userObj.email
                const tagName = userObj.tagName
                if(!email && !tagName) return
                const editorNameClean = editorName.trim().toLowerCase()
                const userTaglineClean = userObj.tagName.trim().toLowerCase()
                if( editorNameClean !== userTaglineClean) return 
                
                
                Email.send({
                    Host : "smtp.sendgrid.com",
                    SecureToken: "ed9c86d7-8655-49fd-b860-04abd4a85c9a",
                    To : 'zeyadzaher02@gmail.com',
                    From: "zeyadzaher02@gmail.com",
                    To: email,
                    Subject: `You have just been tagged in an article`,
                    Body: `<p>you can visit it now </p>`
                })
            })
        })
        
    }
    addArticleButton.addEventListener("click", async (e) => {

        addArticleButton.disabled = true
        loadLoader("show")
        e.preventDefault();
        const articleReturn = await addArticle()
        const article = articleReturn.article;
        const errorsInArticle = articleReturn.numberOfErrors;

        if (errorsInArticle > 0) return;
        const saveTagsAndArticle = async () => {
            return await saveNewTags(article.tags, await addArticleToDb(article))
        }

        if (article.tags.length > 0) {
            const id = await saveTagsAndArticle()
            // await mailingWriters(article.tagline, `https://rwrite.netlify.app/articleview.html?id=${id}`)
            console.log(article.tagline,`https://rwrite.netlify.app/articleview.html?id=${id}`)
            displayMessage("bottomLeft", "success", "Article Has Been Submited Successfully", 4000)
            // addArticleForm.reset();
            loadLoader("hide")
            addArticleButton.disabled = false
            // location.href = `/articleview.html?id=${id}`
        } else {
            const id = await addArticleToDb(article)
            // await mailingWriters(article.tagline, `https://rwrite.netlify.app/articleview.html?id=${id}`)
            console.log(article.tagline,`https://rwrite.netlify.app/articleview.html?id=${id}`)
            displayMessage("bottomLeft", "success", "Article Has Been Submited Successfully", 4000)
            addArticleButton.disabled = false
            loadLoader("hide")
            // addArticleForm.reset();
            // location.href = `/articleview.html?id=${id}`
        }
    });


    CKEDITOR.instances.editor1.on("change", () => {
        const errArea = document.querySelector("#article-err-message");
        errArea.innerHTML = "";
    });
};
runArticle();