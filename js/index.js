authintication()
menuNavigationSwitch()


const tag = async () => {
    const parent = document.querySelector(".tags")
    const getDbTags = async () => {
        const tagRef = await db.ref(`tags`).once("value")
        const tags = []
        await tagRef.forEach((tag) => {
            tags.push(tag.val())
        })
        return tags
    }

    const tagFromDb = await getDbTags()

    const createTagLink = (name) => {
        const link = document.createElement("a")
        link.classList.add("tag-main-item")
        link.href = `section.html?tag=${name}`
        link.innerHTML = `#${name}`

        parent.appendChild(link)
    }
    tagFromDb.forEach((tag) => createTagLink(tag))

    // <a href="#" class="tag-main-item">#life Style</a>
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