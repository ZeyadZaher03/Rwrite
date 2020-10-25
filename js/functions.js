const menuNavigationSwitch = (role) => {
  const sideMenuContainer = document.querySelector(".sidemenu")
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
  const getProfileButton = () => {
    const sideMenuButtons = document.querySelectorAll('.sidemenu-link')
    return Array.from(sideMenuButtons).filter(sideMenuButton => sideMenuButton.innerHTML.toLocaleLowerCase() === "Profile".toLocaleLowerCase())[0]
  }
  const makeAdminPanelButton = () => {
    const sideMenuButtons = document.createElement('a')
    sideMenuButtons.href = "admin/index.html"
    sideMenuButtons.classList.add('sidemenu-link')
    sideMenuButtons.innerHTML = "Admin Dashboard"
    return sideMenuButtons
  }
  console.log(makeAdminPanelButton())
  if (role === "user") ""
  if (role === "admin") return sideMenuContainer.appendChild(makeAdminPanelButton())
  if (role === "guest") return getProfileButton().remove()
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
        provider.addScope("user_link");

        auth
          .signInWithPopup(provider)
          .then((result) => {
            const user = result.user;
            const uid = user.uid;
            const email = result.user.email;
            const name = result.user.displayName;
            const tagName = result.user.displayName;
            const profileImageUrl = result.user.photoURL;
            console.log(result);
            Cookies.set("uid", uid);
            Cookies.set("email", email);
            db.ref(`users/${uid}`).once("value", (res) => {
              if (res.val()) return;
              db.ref(`users/${uid}`).set({
                name,
                tagName,
                profileImageUrl,
                email,
              });
            });

            closeRegisterAnimation();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    };

    // const signInWithTwitter = () => {
    //   const twiiterLoginButton = document.querySelector(".register-twitter-login");
    //   twiiterLoginButton.addEventListener("click", (e) => {
    //       e.preventDefault()
    //       const provider = new firebase.auth.FacebookAuthProvider();
    //       provider.setCustomParameters({
    //         display: "popup",
    //       });
    //       auth.signInWithPopup(provider).then((result) => {
    //         const user = result.user;
    //         const username = result.additionalUserInfo.username;
    //         const uid = user.uid;
    //         const email = result.user.email;
    //         const name = result.user.displayName;

    //         db.ref(`users/${uid}`).once("value", (res) => {
    //           if (res.val()) return
    //           db.ref(`users/${uid}`).set({
    //             name,
    //             profileImageUrl,
    //             email,
    //           });
    //         });
    //       })
    //     })
    //     .catch(function (error) {
    //       var errorMessage = error.message;
    //     })
    // }
    registerPopup();
    signInWithFaceBook();
    // signInWithTwitter();
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
        return ["noText"];
      } else return await tagsNames.filter((tagName) => tagName.indexOf(searchValue) > -1);
    };

    // get all the articles assoc in this tag
    const matchingTagsArr = await matchesTags();

    // create search result
    const createSearchResultItem = (name, id) => {
      const item = document.createElement("a");

      item.innerHTML = name;
      item.href = `/articleview.html?id=${id}`;
      item.classList.add("search-content-list-link");
      return item;
    };

    // show search result
    const showSearchResult = (articleSnapshot) => {
      const articleUid = articleSnapshot.key;
      const articleData = articleSnapshot.val();
      const articleTagline = articleData.tagline;
      return searchContentList.appendChild(createSearchResultItem(articleTagline, articleUid));
    };

    // get search item data
    const getSearchedData = (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const articleId = childSnapshot.val();
        db.ref(`articles/${articleId}`).once("value", (articleSnapshot) => showSearchResult(articleSnapshot));
      });
    };

    if (!matchingTagsArr[0] === "noText") return (searchContentList.innerHTML = "");
    if (matchingTagsArr.length === 0) {
      searchContentList.innerHTML = "";
      return searchContentList.appendChild(createSearchResultItem("no result", "#"));
    }

    matchingTagsArr.forEach((tagId) => {
      searchContentList.innerHTML = "";
      db.ref(`tags/${tagId}`).once("value", (snapshot) => {
        if (snapshot.numChildren() > 0) return getSearchedData(snapshot);
        createSearchResultItem("no result", "#");
      });
    });
  };

  let timeout = null;
  searchInput.addEventListener("keyup", async (e) => {
    e.preventDefault();

    // on typing make the timer return to 1 s again
    clearTimeout(timeout);

    // Make a new timer for one secone then run the search function
    timeout = setTimeout(function () {
      runSearch(searchInput);
    }, 500);
  });
};
getArticlesByTag();

const displayMessage = (position, type, message, duration) => {
  let element;
  if (position === "topCenter") element = document.querySelector(".top-center-popup-message");
  else if (position === "bottomLeft") element = document.querySelector(".bottom-left-popup-message");
  else element = document.querySelector(".bottom-left-popup-message");

  const textContainer = element.querySelector("p");
  textContainer.innerHTML = "";
  textContainer.innerHTML = message;

  if (type === "error") {
    element.classList.add("bottom-left-popup-message--err");
    const elementIcon = element.querySelector(".popup-message-icon--error");
    elementIcon.classList.add("popup-message-icon--active");
  } 
  else if (type === "success") {
    element.classList.add("bottom-left-popup-message--succ");
    const elementIcon = element.querySelector(".popup-message-icon--success");
    elementIcon.classList.add("popup-message-icon--active");
  }

  element.classList.add("popup-message--active");
  
  setTimeout(() => {
    element.classList.remove("popup-message--active");
    textContainer.innerHTML = "";
  }, duration);
};


const loadLoader = (status) => {
  let element = document.querySelector(".article-sumbmition-container");
  if (status == "show") element.classList.add("article-sumbmition-container--active");
  if (status == "hide") element.classList.remove("article-sumbmition-container--active");
};