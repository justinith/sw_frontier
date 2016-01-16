(function () {
    'use strict';

    angular
        .module ('app')
        .directive ('youtubePlayer', youtubePlayer);


    function youtubePlayer() {
        /**
         * @name link
         * @desc Directive Link
         */
        function link(scope, elem, attrs) {
            scope.$watch(attrs.url, function(src){
                console.log(src);
                if(typeof src === 'string'){
                    elem.attr('src', src);
                }
            })
        }

        return {
            replace: true,
            link: link,
            template: '<iframe></iframe>'
        }
    }

} ());