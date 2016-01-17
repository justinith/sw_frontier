(function () {
    'use strict';
    angular
        .module('app', [
        'ui.router',
            'app.routes',
            'ngSanitize',
            'ngRoute',
        //'ngTable',
            'ui.bootstrap'
    ]);
}());
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
            .state('app.explorer', {
                url: 'explorer',
                templateUrl: base.routes + 'explorer/explorer.tpl.html',
                controller: 'ExplorerCtrl as ExplorerCtrl'
            })
            // logout
            .state('app.logout', {
                url: 'logout',
                controller: function($state){
                    Parse.User.logOut().then(function(res){
                        
                    }, function(err){
                        
                    })

                }
            })

            // select skill
            .state('app.skill-selector', {
                url: 'selectSkill',
                controller: 'SkillSelectorCtrl as SkillCtrl'
            })

            // View Class
            .state('app.class', {
                url: 'class/:id',
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
(function () {
    Parse.initialize("JIfQYPUWWSYqHKyZ67GSSnl1xZ4JUeDb9Eb66JcI", "LtHuNTsnXczKg6RcP81RjytAvvqeOdzcbfs2na5L");
    function AppRun($rootScope, $state) {
        // Route management
        var stateChangeStart = $rootScope.$on('$stateChangeStart', function (e, toState, toStateParams) {
            var currentUser = Parse.User.current();
            if(toState.name == 'app.home' && currentUser){
                e.preventDefault();
                $state.go('app.dash');
            } else if(toState.name != 'app.home' && !currentUser){
                e.preventDefault();
                $state.go('app.home');
            }
        });
    }

    angular
        .module('app')
        .run(AppRun);
}());
(function () {
    'use strict';

    angular
        .module ('app')
        .factory ('Api', Api);


    function Api($q) {
        function generateErrorResponse(response) {
            return $q.reject (response);
        }

        function generateSuccessResponse(response) {
            return $q.when (response)
        }

        function queryTable(table) {
            return new Parse.Query (Parse.Object.extend (table));
        }

        function tableObject(tableName) {

            var Table = Parse.Object.extend (tableName);
            return new Table ();
        }

        return {
            createClass: createClass,
            getClassByCategoryId: getClassByCategoryId,
            setUserPrimaryClass: setUserPrimaryClass,
            getCategoryById: getCategoryById
        };

        function createClass(params) {
            var currentUser = Parse.User.current ();
            if (!currentUser) {
                return $q.reject ('User Not Logged In');
            }
            var userClasses = tableObject ('UserClasses');
            userClasses.set ('userId', currentUser.id);
            _.each (params, function (obj, key) {
                userClasses.set (key, obj);
            });
            return userClasses.save ()
                .then (generateSuccessResponse, generateErrorResponse);
        }

        function getCategoryById(categoryId){
            return queryTable('Category')
                .equalTo('id', categoryId)
                .first()
                .then(generateSuccessResponse, generateErrorResponse);
        }
        function getClassByCategoryId(categoryId) {
            var currentUser = Parse.User.current ();
            return queryTable ('UserClasses')
                .equalTo ('userId', currentUser.id)
                .equalTo ('categoryId', categoryId)
                .first ()
                .then (function (res) {
                    return generateSuccessResponse (res);
                }, generateErrorResponse);
        }

        function setUserPrimaryClass(classId) {
            return Parse
                .User
                .current ()
                .fetch ()
                .then (function (user) {
                    return user
                        .set ('primaryClass', classId)
                        .save ()
                        .then (generateSuccessResponse, generateErrorResponse);
                }, generateErrorResponse);
        }
    }

} ());
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
(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('DashCtrl', DashCtrl);


    function DashCtrl() {

        var vm = this;

        init ();

        function init() {

        }

    }

} ());
(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('ClassCtrl', ClassCtrl);


    function ClassCtrl($q, $scope, $state, Api) {

        var vm = this;
        var selectedCategory = $state.params.id;
        vm.selectedTab = {};
        vm.steps = [];
        vm.category = {};

        init();


        function init(){
            loadClass();
        }

        vm.getStepClass = function(index, completed){
            var classes = completed ? 'completed': '';
            var previous = vm.steps[index - 1];
            if(!completed && (!previous || vm.steps[index - 1].complete)){
                classes += ' active';
            }
            return classes;
        };


        function loadClass(){
            $q.all([
                    Api.getClassByCategoryId(selectedCategory),
                    Api.getCategoryById(selectedCategory.id)
            ])
                .then(function(res){
                    vm.steps = res[0].attributes.steps;
                    vm.category = res[1];
                    vm.selectedTab = _.chain(vm.steps)
                        .filter(function(step){
                            return !step.complete;
                        })
                        .first();
                }, function(err){
                    
                })
        }

        function nextStep(currentStep){

        }

        function uploadFile(){

        }



        
    }

} ());
















(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('HomeCtrl', HomeCtrl);


    function HomeCtrl($state) {
        var vm = this;

        vm.login = login;
        vm.signUp = signUp;

        init ();

        function init() {
            

        }



            function signUp(info){
                
                Parse.User.signUp(info.email, info.password).then(function(res){
                    console.log('signup success', res)
                }, function(err){
                    
                });

            }
            function login(info){
                Parse.User.logIn(info.email, info.password).then(function(res){
                    $state.go('app.explorer');
                    
                }, function(err){
                    
                });
                
            }



    }

} ());
(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('ExplorerCtrl', ExplorerCtrl);


    function ExplorerCtrl($scope, $state, Api) {
        var vm = this;
        var currentUser = Parse.User.current ();

        //
        //
        //
        vm.list = [];
        vm.description = 'Welcome to Frontier';

        vm.selectClass = selectClass;
        init ();

        function init() {
            getCategories ();
        }

        function getCategories() {
            var Category = Parse.Object.extend ('Category');
            var query = new Parse.Query (Category);
            query.find ().then (function (success) {
                vm.list = success;
                $scope.$digest ();
            }, function (err) {
                alert ('Error loading Categories');
            });
        }


        function selectClass(category) {
            Api.getClassByCategoryId (category.id)
                .then (
                    viewClass,
                    function (err) {
                        createClass (category)
                            .then (function () {
                                viewClass (category.attribute);
                            });
                    });
        }

        function viewClass(category) {
            $state.go ('app.class', {tree: category.id});
        }

        function createClass(category) {
            return Api.createClass ({
                categoryId: category.id,
                steps: category.attributes.steps.map (function (obj) {
                    obj.complete = false;
                    return obj;
                })
            });
        }

    }

} ());
(function () {
    'use strict';
    function IndexCtrl ($state) {
        var vm = this;





    }

    angular
        .module('app')
        .controller('IndexCtrl', IndexCtrl);
}());