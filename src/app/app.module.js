(function () {
    'use strict';
    angular
        .module('app', [
        'ui.router',
            'app.routes',
            'ngSanitize',
            'ngRoute',
        //'ngTable',
            'ngFileUpload',
            'ui.bootstrap'
    ]);
}());