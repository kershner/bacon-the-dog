var bacon = {};

bacon.config = {
    s3BaseUrl       : '',
    heroVideoKey    : '',
    bucketName      : '',
    imagesWrapper   : $('.images-wrapper'),
    loader          : $('.loader'),
    step            : 15,
    imageUrls       : []
};

bacon.init = function() {
    baconNameColors();
    videInit();

    // Isotope.js init
    bacon.config.imagesWrapper.isotope({
        itemSelector    : '.img',
        initLayout      : true,
        masonry         : {
            isFitWidth  : true,
            columnWidth : 10
        }
    });

    changeColorsInit();
    getImages(1);
    infiniteScroll();
};

function baconNameColors() {
    var element = $('.huge-bacon-name'),
        text = element.text(),
        finalHtml = '',
        tempHtml = '';

    for (var i=0; i<text.length; i++) {
        tempHtml = '<span class="colorwave animate-color" style="position: relative;">' + text[i] + '</span>';
        finalHtml += tempHtml;
    }
    $(element).empty().append(finalHtml);

    colorLetters();
    setInterval(function() {
        colorLetters();
    }, 4000);
}

function colorLetters() {
    $('.colorwave').each(function() {
        $(this).css({
            color   : randomColor()
        });
    });
}

function videInit() {
    var heroUrl = bacon.config.s3BaseUrl + '/' + bacon.config.bucketName + '/' + bacon.config.heroVideoKey;
    $('.vide').vide({
        webm : heroUrl
    })
}

function changeColorsInit() {
    changeColors();
    setInterval(function () {
        changeColors();
    }, 6000);
}

function changeColors() {
    var color = randomColor({
        luminosity  : 'light'
    });
    $('body').css({
        'background-color'  : color
    });
    color = randomColor();
    $('.load-more-btn').css({
        'background-color'  : color
    });
}

function getImages(firstRun) {
    var numImages = bacon.config.imagesWrapper.find('.img').length,
        start = numImages - 1 < 0 ? 0 : numImages,
        end = (start + bacon.config.step),
        tmpImagesArray = bacon.config.imageUrls.slice(start, end),
        html = '';

    for (var i=0; i<tmpImagesArray.length; i++) {
        var imageUrl = tmpImagesArray[i];
        html += '<a href="' + imageUrl + '" target="_blank" class="img"><img src="' + imageUrl + '"></a>';
    }

    var jQueryHtml = $(html);
    bacon.config.imagesWrapper.isotopeImagesReveal(jQueryHtml, firstRun);
}

function infiniteScroll() {
    $(window).on('scroll', function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height()){
            getImages();
        }
    });
}

// Isotope ImageReveal
// https://codepen.io/desandro/pen/bsHix
$.fn.isotopeImagesReveal = function($items, firstRun) {
    var iso = this.data('isotope'),
        itemSelector = iso.options.itemSelector,
        initial = firstRun ? 1 : 0;

    bacon.config.loader.removeClass('hidden');

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
    });

    // Recalculate number of images
    var numImages = bacon.config.imagesWrapper.find('.img').length,
        totalImages = bacon.config.imageUrls.length;

    if (numImages === totalImages) {
        bacon.config.loader.addClass('hidden');
    }

    return this;
};