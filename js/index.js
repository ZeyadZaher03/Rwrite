authintication()
menuNavigationSwitch()



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