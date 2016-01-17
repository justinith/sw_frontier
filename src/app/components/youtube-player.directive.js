(function () {
    'use strict';

    angular
        .module ('app')
        .directive ('youtubePlayer', youtubePlayer);


    function youtubePlayer($window) {
        /**
         * @name link
         * @desc Directive Link
         */
        function link(scope, elem, attrs) {
            var widthCurrent = elem.width();
            adjustHeight(widthCurrent);
            angular.element($window).on('resize', function(){
                var newWidth = angular.element(elem).width();
                if(widthCurrent != newWidth){
                    widthCurrent = newWidth;
                    adjustHeight(widthCurrent);
                }
            });
            function adjustHeight(width){
                elem.css('height', width *.625);
            }

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