(function () {
    'use strict';

    function AppRoute ($stateProvider, $urlRouterProvider) {
        // Redirects to 404 page if the requested page doesn't exist
        $urlRouterProvider.otherwise('/404');

        // Redirects to /#/ path if no path is given in the url
        // ex: (cardinal.trialomics.com) will redirect to (cardinal.trialomics.com/#/)
        $urlRouterProvider.when('', '/home');


        var base = {
            routes: 'app/routes/'
        };

        $stateProvider
            // Parent state. All other states trace back to this one.


            // Login and signup
            .state('app', {
                abstract: true,
                templateUrl: base.routes + 'template/index.tpl.html',
                controller: 'IndexCtrl as index',
                url: '/'
            })
            .state('app.home', {
                url: 'home',
                templateUrl: base.routes + 'home/home.tpl.html',
                controller: 'HomeCtrl as HomeCtrl'
            //
            })
            // logout
            .state('app.logout', {
                url: 'logout',
                controller: function($state, CurrentUserStore){
                    CurrentUserStore.logout().then(function(){
                        $state.go('app');
                    }, function(){
                        alert('Error logging out.');
                    });
                }
            })

            // select skill
            .state('app.skill-selector', {
                url: 'selectSkill',
                controller: 'SkillSelectorCtrl as SkillCtrl'
            })

            // View Class
            .state('app.class', {
                url: 'class?id',
                templateUrl: base.routes + 'class/class.tpl.html',
                controller: 'ClassCtrl as ClassCtrl'
            })
            .state('app.signup', {

            })
            // login
            // signup
            // intrest page
            // course page
            //      summarization, na

            // Home, Explore Logout
            // complete page
            // premium page
            .state('app.NotFound', {
                url: '404',
                templateUrl: base.routes + 'NotFoundPage/NotFoundPage.tpl.html'
            })
    }


    angular
        .module('app.routes', [])
        .config(AppRoute);
}());