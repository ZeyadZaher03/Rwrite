authintication()
const menuButton = document.querySelector(".nav-menu")
const options = {
    isOpened: false
}
menuButton.addEventListener('click', (e) => {
    console.log(options)
    e.preventDefault()
    if (!options.isOpened) {
        anime({
            targets: ".sidemenu",
            left: ["-40rem", '0']
        })
        anime({
            targets: ".container",
            left: ["0", '40rem']
        })

        options.isOpened = true
    } else {
        anime({
            targets: ".sidemenu",
            left: ["0", '-40rem']
        })
        anime({
            targets: ".container",
            left: ["40rem", '0rem']
        })
        console.log("close")

        options.isOpened = false
    }

})

console.log(window.innerWidth < 800)
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