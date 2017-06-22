var bacon = {};

bacon.config = {
    s3BaseUrl       : '',
    heroVideoKey    : '',
    bucketName      : '',
    imagesWrapper   : $('.images-wrapper'),
    step            : 15,
    imageUrls       : []
};

bacon.init = function() {
    // Isotope.js init
    bacon.config.imagesWrapper.isotope({
        itemSelector    : '.img',
        stagger         : '0.1s',
        initLayout      : true,
        masonry         : {
            isFitWidth  : true,
            gutter      : 5
        }
    });

    var color = randomColor();
    $('body').css({
        'background-color'  : color
    });

    backgroundColorChange();
    videInit();
    getImages(1);
    loadMore();
};

function backgroundColorChange() {
    setInterval(function () {
        var color = randomColor();
        $('body').css({
            'background-color'  : color
        });
    }, 3000);
}

function loadMore() {
    $('.load-more-btn').on('click', function() {
        getImages();
    });
}

function getImages(firstRun) {
    var numImages = bacon.config.imagesWrapper.find('.img').length,
        start = numImages - 1 < 0 ? 0 : numImages + 1,
        end = (start + bacon.config.step),
        tmpImagesArray = bacon.config.imageUrls.slice(start, end),
        html = '';

    for (var i=0; i<tmpImagesArray.length; i++) {
        var imageUrl = tmpImagesArray[i];
        html += '<div class="img"><img src="' + imageUrl + '"></div>';
    }

    var jQueryHtml = $(html);
    bacon.config.imagesWrapper.isotopeImagesReveal(jQueryHtml, firstRun);
}

function videInit() {
    var heroUrl = bacon.config.s3BaseUrl + '/' + bacon.config.bucketName + '/' + bacon.config.heroVideoKey;
    $('.vide').vide({
        webm : heroUrl
    })
}

// Isotope ImageReveal
// https://codepen.io/desandro/pen/bsHix
$.fn.isotopeImagesReveal = function($items, firstRun) {
    var iso = this.data('isotope'),
        itemSelector = iso.options.itemSelector,
        initial = firstRun ? 1 : 0;

    // hide by default
    $items.hide();

    // append to container
    this.append($items);

    $items.imagesLoaded().progress(function(imgLoad, image) {
        // get item
        // image is imagesLoaded class, not <img>, <img> is image.img
        var $item = $(image.img).parents(itemSelector);

        // un-hide item
        $item.show();

        // isotope does its thing
        iso.appended($item);

         if (initial) {
            bacon.config.imagesWrapper.isotope('layout');
        }

        // Recalculate number of images
        var numImages = bacon.config.imagesWrapper.find('.img').length,
            totalImages = bacon.config.imageUrls.length;

        if (numImages === totalImages - 1) {
            $('.load-more-btn').addClass('hidden');
        }
    });

    return this;
};