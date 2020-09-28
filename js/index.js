authintication()
menuNavigationSwitch()


const tag = async () => {
    const parent = document.querySelector(".tags")

    const createTagLink = (name) => {
        const link = document.createElement("a")
        link.classList.add("tag-main-item")
        link.href = `section.html?tag=${name}`
        link.innerHTML = `#${name}`

        parent.appendChild(link)
    }

    db.ref(`tags`).on("value", (snapshot) => {
        const tagsObj = snapshot.val()
        parent.innerHTML = ""
        for (const tag in tagsObj) createTagLink(tag)
    })
}

tag()

if (window.innerWidth < 800) {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 2,
        slidesToScroll: 1,
        draggable: true,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
    });
} else {
    new Glider(document.querySelector('.glider'), {
        slidesToShow: 5,
        slidesToScroll: 3,
        draggable: true,
        dots: '.dots',
        arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
        },
    });
}

// new Glider(document.querySelector('.glider'));