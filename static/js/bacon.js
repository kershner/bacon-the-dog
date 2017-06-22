var bacon = {};

bacon.config = {
    s3BaseUrl       : '',
    heroVideoKey    : '',
    bucketName      : '',
    wrapper         : $('.images-wrapper'),
    step            : 15,
    imageUrls       : []
};

bacon.init = function() {
    bacon.config.wrapper.masonry({
        'isFitWidth'    : true
    });

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
    var numImages = bacon.config.wrapper.find('.img').length,
        index = numImages - 1 < 0 ? 0 : numImages - 1,
        tmpImagesArray = bacon.config.imageUrls.slice(index, index + bacon.config.step);

    for (var i=0; i<tmpImagesArray.length; i++) {
        var imageUrl = tmpImagesArray[i],
            lastPeriod = imageUrl.lastIndexOf('.') + 1,
            extension = imageUrl.slice(lastPeriod, imageUrl.length);

        if (extension !== 'mp4') {
            var html = '<div class="img"><img src="' + imageUrl + '"></div>';
            bacon.config.wrapper.append(html);
        }
    }

    bacon.config.wrapper.masonry('layout');
}

function videInit() {
    var heroUrl = bacon.config.s3BaseUrl + '/' + bacon.config.bucketName + '/' + bacon.config.heroVideoKey;
    $('.vide').vide({
        mp4 : heroUrl
    })
}
