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
    videInit();
    getImages();
    loadMore();
};

function loadMore() {
    $('.load-more-btn').on('click', function() {
        getImages();
    });
}

function getImages() {
    var numImages = bacon.config.imagesWrapper.find('.img').length,
        index = numImages - 1 < 0 ? 0 : numImages - 1,
        tmpImagesArray = bacon.config.imageUrls.slice(index, index + bacon.config.step);

    console.log('Current Number of Images: ' + numImages);
    console.log('Current Start Index: ' + index);
    console.log('Current End Index: ' + index + bacon.config.step);
    for (var i=0; i<tmpImagesArray.length; i++) {
        var imageUrl = tmpImagesArray[i],
            lastPeriod = imageUrl.lastIndexOf('.') + 1,
            extension = imageUrl.slice(lastPeriod, imageUrl.length);

        if (extension !== 'mp4') {
            var html = '<div class="img"><img src="' + imageUrl + '"></div>';
            bacon.config.imagesWrapper.append(html);
        }
    }

    bacon.config.imagesWrapper.imagesLoaded(function() {
        // Destroy/re-init isotope grid if necessary
        if (bacon.config.imagesWrapper.data('isotope')) {
            bacon.config.imagesWrapper.isotope('destroy');
        }

        bacon.config.imagesWrapper.isotope({
            itemSelector    : '.img',
            masonry         : {
                isFitWidth  : true,
                gutter      : 5
            }
        });
    });

    return false;
}

function videInit() {
    var heroUrl = bacon.config.s3BaseUrl + '/' + bacon.config.bucketName + '/' + bacon.config.heroVideoKey;
    $('.vide').vide({
        mp4 : heroUrl
    })
}
