// authintication()
const getDisplay = (item) => getComputedStyle(item).display;

const tagsArray = [];
const writerArray = [];
const editorArray = [];

const tags = ({ containerSelector, inputSelector, buttonSelector, maxNumber, arrayOfValues }) => {
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

const runArticle = () => {
  CKEDITOR.replace("editor1");
  const addArticleForm = document.querySelector(".article-form-container");
  const addArticleButton = document.querySelector(".publish-button");

  const addArticle = () => {
    const name = addArticleForm["name"].value;
    const tagline = addArticleForm["tagline"].value;
    const description = addArticleForm["description"].value;

    const twiiter = addArticleForm["twitter"].value;
    const facebook = addArticleForm["facebook"].value;
    const instagram = addArticleForm["instagram"].value;
    const email = addArticleForm["email"].value;

    const article = CKEDITOR.instances.editor1.getData();

    const articleObj = {
      name,
      tagline,
      description,
      twiiter,
      facebook,
      instagram,
      email,
      tags: tagsArray,
      writer: writerArray,
      editor: editorArray,
      article,
    };

    return articleObj;
  };

  addArticleForm.addEventListener("submit", (e) => e.preventDefault());
  addArticleButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(addArticle());
  });
};
runArticle();

// addArticleFormButton.addEventListener("click", (e) => {
//

//
//     db.ref(`users/${uid}/articles`).push(articleObj)
//     e.preventDefault()
// })
