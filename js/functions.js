const menuNavigationSwitch = () => {
  const menuButton = document.querySelector(".nav-menu");
  const menuOptions = {
    isOpened: false,
  };
  const closeAnimation = () => {
    anime({
      targets: ".sidemenu",
      left: ["0", "-40rem"],
      easing: "easeInOutSine",
      duration: 200,
    });
    anime({
      targets: ".container",
      left: ["40rem", "0rem"],
      easing: "easeInOutSine",
      duration: 200,
    });
  };

  const openAnimation = () => {
    anime({
      targets: ".sidemenu",
      left: ["-40rem", "0"],
      easing: "easeInOutSine",
      duration: 300,
    });
    anime({
      targets: ".container",
      left: ["0", "40rem"],
      easing: "easeInOutSine",
      duration: 300,
    });
  };

  menuButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (!menuOptions.isOpened) {
      openAnimation();
      menuOptions.isOpened = true;
    } else {
      closeAnimation();
      menuOptions.isOpened = false;
    }
  });

  const search = () => {
    const searchInput = document.querySelector(".search_input");

    searchInput.addEventListener("keydown", () => {});
  };

  search();
};

const authintication = () => {
  auth.onAuthStateChanged((user) => {
    const uid = Cookies.get("uid");
    const registerButton = document.querySelector(".registerbutton");
    console.log("id", uid);
    console.log("user", user);

    if (!user || !uid) {
      Cookies.remove("uid");
      Cookies.remove("email");
      auth.signOut();
      registerButton.setAttribute("id", "LoginButton");
      registerButton.innerHTML = "Register / Log in";
      register();
    } else {
      registerButton.innerHTML = "Logout";
      registerButton.setAttribute("id", "logoutButton");
      logout();
    }
  });

  const logout = () => {
    const closeRegisterAnimation = () => {
      if (window.innerWidth < 800) {
        anime({
          targets: ".register-container",
          top: ["140", "110"],
          opacity: ["1", "0"],
          duration: 200,
          easing: "easeInOutQuad",
          complete() {
            authForm.style.display = "none";
          },
        });
      } else {
        anime({
          targets: ".register-container",
          top: ["170", "130"],
          opacity: ["1", "0"],
          duration: 200,
          easing: "easeInOutQuad",
          complete() {
            authForm.style.display = "none";
          },
        });
      }
    };
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth.signOut();
      Cookies.remove("uid");
      Cookies.remove("email");
      closeRegisterAnimation();
    });
  };

  const register = () => {
    const loginButton = document.querySelector("#LoginButton");
    const authForm = document.querySelector(".register-container");

    const closeRegisterAnimation = () => {
      if (window.innerWidth < 800) {
        anime({
          targets: ".register-container",
          top: ["140", "110"],
          opacity: ["1", "0"],
          duration: 200,
          easing: "easeInOutQuad",
          complete() {
            authForm.style.display = "none";
          },
        });
      } else {
        anime({
          targets: ".register-container",
          top: ["170", "130"],
          opacity: ["1", "0"],
          duration: 200,
          easing: "easeInOutQuad",
          complete() {
            authForm.style.display = "none";
          },
        });
      }
    };

    const openRegisterAnimation = () => {
      if (window.innerWidth < 800) {
        authForm.style.display = "flex";
        anime({
          targets: ".register-container",
          top: ["130", "150"],
          opacity: ["0", "1"],
          duration: 300,
          easing: "easeInOutQuad",
        });
      } else {
        authForm.style.display = "flex";
        anime({
          targets: ".register-container",
          top: ["150", "170"],
          opacity: ["0", "1"],
          duration: 300,
          easing: "easeInOutQuad",
        });
      }
    };

    const registerPopup = () => {
      const options = {
        loginRegPopupVis: false,
      };

      loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!options.loginRegPopupVis) {
          openRegisterAnimation();
          options.loginRegPopupVis = true;
        } else {
          closeRegisterAnimation();
          options.loginRegPopupVis = false;
        }
      });
    };

    const signInWithFaceBook = () => {
      const facebookLoginButton = document.querySelector(".register-facebook-login");
      facebookLoginButton.addEventListener("click", (e) => {
        e.preventDefault();
        const provider = new firebase.auth.FacebookAuthProvider();
        provider.setCustomParameters({
          display: "popup",
        });
        provider.addScope('user_link');


        auth
          .signInWithPopup(provider)
          .then((result) => {
            var user = result.user;
            var uid = user.uid;
            var email = result.user.email;
            var name = result.user.displayName;
            var profileImageUrl = result.user.photoURL;
            console.log(result);
            Cookies.set("uid", uid);
            Cookies.set("email", email);
            db.ref(`users/${uid}`).once("value", (res) => {
              db.ref(`users/${uid}`).set({
                name,
                profileImageUrl,
                email,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    };
    registerPopup();
    signInWithFaceBook();
  };
};

const getArticlesByTag = async () => {

  let searchInput = document.querySelector(".search_input");
  let searchContentList = document.querySelector("#searchContentList");
  if (window.innerWidth < 800) {
    searchInput = document.querySelector(".search_input-smallscreen");
    searchContentList = document.querySelector("#searchContentListSmallScreens");
  }
  const runSearch = async (searchInput) => {
    // get all tags names
    const getTagIdsByName = await db.ref(`tags`).once("value");
    const tagsObj = await getTagIdsByName.val();
    const tagsNames = [];
    for (const tag in tagsObj) await tagsNames.push(tag);

    // store search value
    const searchValue = searchInput.value.trim().toLowerCase();

    // get tags matching the search vlaue
    const matchesTags = async () => {
      if (!searchValue.trim()) {
        searchContentList.innerHTML = "";
        return [];
      } else return await tagsNames.filter((tagName) => tagName.indexOf(searchValue) > -1);
    };
    const matchingTagsArr = await matchesTags();
    // get all the articles assoc in this tag
    matchingTagsArr.forEach((tagId, index) => {
      db.ref(`tags/${tagId}`).once("value", (snapshot) => {
        snapshot.forEach(async (childSnapshot) => {
          searchContentList.innerHTML = "";
          const articleData = await db.ref(`articles/${childSnapshot.val()}`).once("value");
          const articleId = await articleData.key;
          const articleTagline = await articleData.val().tagline;
          console.log(index, articleTagline);
          const a = document.createElement("a");
          a.innerHTML = articleTagline;
          a.href = `/articleview.html?id=${articleId}`;
          a.classList.add("search-content-list-link");
          searchContentList.appendChild(a);
        });
      });
    });
  };

  let timeout = null;
  searchInput.addEventListener("keyup", async (e) => {
    e.preventDefault();
    clearTimeout(timeout);
    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(function () {
      runSearch(searchInput);
    }, 1000);
  });
  // check if there is any tags with this name
  // sort tags with
};
getArticlesByTag();


const displayMessage = (position, type, message, duration) => {
  let element
  if (position === "topCenter") element = document.querySelector(".bottom-left-popup-message")
  else if (position === "bottomLeft") element = document.querySelector(".bottom-left-popup-message")
  else element = document.querySelector(".bottom-left-popup-message")

  const textContainer = element.querySelector("p")
  textContainer.innerHTML = ""
  textContainer.innerHTML = message

  if (type === "error") {
    element.classList.add("bottom-left-popup-message--err")

    const elementIcon = element.querySelector(".popup-message-icon--error")
    elementIcon.classList.add("popup-message-icon--active")
  } else if (type === "success") {
    element.classList.add("bottom-left-popup-message--succ")
    const elementIcon = element.querySelector(".popup-message-icon--success")
    elementIcon.classList.add("popup-message-icon--active")
  }
  element.classList.add("bottom-left-popup-message--active")


  setTimeout(() => {
    element.classList.remove("bottom-left-popup-message--active")
  }, duration);
}
const loadLoader = (status) => {
  let element = document.querySelector(".article-sumbmition-container")
  if (status == "show") element.classList.add("article-sumbmition-container--active")
  if (status == "hide") element.classList.remove("article-sumbmition-container--active")
}