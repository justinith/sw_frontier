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
(function () {
    'use strict';

    function AppRoute ($stateProvider, $urlRouterProvider) {
        // Redirects to 404 page if the requested page doesn't exist
        $urlRouterProvider.otherwise('/404');

        // Redirects to /#/ path if no path is given in the url
        // ex: (cardinal.trialomics.com) will redirect to (cardinal.trialomics.com/#/)
        $urlRouterProvider.when('', '/home');
        $urlRouterProvider.when('/', '/home');


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
                        $state.go('app.home');
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
                $state.go('app.explorer');
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
            getCategoryById: getCategoryById,
            uploadClassFile: uploadClassFile
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
                    if(!res){
                        return $q.reject(res);
                    }
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

        function uploadClassFile(file, classId, stepNumber){
            return tableObject('ClassFiles')
                .set('file',new Parse.File(file.name,file))
                .set('classId', classId)
                .set('stepNumber', stepNumber)
                .save()
                .then (generateSuccessResponse, generateErrorResponse);

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
        .controller ('ClassCtrl', ClassCtrl);


    function ClassCtrl($q, $scope, $state, Api, Upload) {

        var vm = this;

        //
        var selectedCategory = $state.params.id;

        vm.selectedTab = {};
        vm.steps = [];
        vm.category = {};
        vm.class = {};
        vm.uploading = false;


        vm.upload = upload;
        vm.getStepClass = getStepClass;
        vm.completeTask = completeTask;
        vm.changeTask = changeTask;
        vm.nextStep = nextStep;
        vm.setDone = setDone;
        vm.tryPremium = tryPremium;
        vm.submitFeedback = submitFeedback;

        init ();


        function init() {
            loadClass ();
        }

        function getStepClass(index) {
            if (index < vm.selectedTab.index) {
                return 'completed';
            } else if (index === vm.selectedTab.index) {
                return 'active';
            }
            return '';
        }


        function loadClass() {
            $q.all ([
                    Api.getClassByCategoryId (selectedCategory),
                    Api.getCategoryById (selectedCategory.id)
                ])
                .then (function (res) {
                    vm.class = res[0];
                    vm.steps = res[0].attributes.steps.map (function (obj, i) {
                        obj.index = i;
                        return obj;
                    });
                    vm.category = res[1];
                    vm.selectedTab = _.chain (vm.steps)
                        .filter (function (step) {
                            return !step.complete;
                        })
                        .first ()
                        ._wrapped;

                    
                }, function (err) {
                    
                })
        }

        function nextStep() {
            var currentIndex = vm.selectedTab.index;
            var nextIndex = currentIndex + 1;
            vm.steps[currentIndex].complete = true;
            //if (!vm.steps.finished) {
                vm.selectedTab = vm.steps[nextIndex];
            completeTask();
            //}
        }

        function upload(file, currentStep) {
            vm.uploading = true;
            Api.uploadClassFile (file, vm.class.id, vm.selectedTab.index).then (function(){
                vm.uploading = false;
                swal({
                    title: 'Thank you for Uploading',
                    text: "Someone will look at your work and get back to you as soon as possible",
                    confirmButtonColor: "#fbaf5d",
                    confirmButtonText: "Continue"
                }, function(){
                    $state.go('app.explorer');
                })
            }, function (err) {
                vm.uploading = false;
            })

        }


        function changeTask(index) {
            if (!vm.steps.finished) {
                vm.selectedTab = vm.steps[index];
            }
        }

        function completeTask() {
            Api.getClassByCategoryId (selectedCategory).then (function (classObj) {
                classObj.set ('steps', vm.steps);
                classObj.save ();
            }, function () {

            })
        }

        function setDone() {
            // check if the user's premium is done
            var obj = Parse.User.current().fetch({
              success: function(myObject) {
                // The object was refreshed successfully.
                var premium = myObject.attributes.premium;
                if (premium === undefined) {
                    myObject.set("premium", false);
                    myObject.save(null, {
                        success: function(data) {
                            
                        },
                        error: function(data, error){
                            
                        }
                    });
                }
                else if (premium === false) {
                    
                }
                else if (premium === true ) {
                    
                }

              },
              error: function(myObject, error) {
                // The object was not refreshed successfully.
                // error is a Parse.Error with an error code and message.
              }
            });
        }

        function tryPremium() {
            //set premium to true
            console.log("try Premium")
            var obj = Parse.User.current();
            obj.set("premium", true);
            obj.save(null, {
                success: function(data) {
                    
                },
                error: function(data, error){
                    
                }
            });
        }

        function submitFeedback() {
            
            

            var Feedback = Parse.Object.extend("Feedback");
            var feedback = new Feedback();

            feedback.set("userId", Parse.User.current().id);
            feedback.set("feedback", vm.feedbackData);
            vm.feedbackData = "";
            feedback.save(null, {
                success: function(data) {

                    swal({
                        title: 'Thank you for the Feedback',
                        confirmButtonColor: "#fbaf5d",
                        confirmButtonText: "Close"
                    });
                    
                },
                error: function(data, error) {
                    
                }
            });
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
        .controller ('ExplorerCtrl', ExplorerCtrl);


    function ExplorerCtrl($scope, $state, Api) {
        var vm = this;
        var currentUser = Parse.User.current ();
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
                vm.list.push (success[0]);
                $scope.$digest ();
            }, function (err) {
                alert ('Error loading Categories');
            });
        }


        function selectClass(category) {
            Api.getClassByCategoryId (category.id)
                .then (function (res) {
                        
                        
                        viewClass (category);
                    },
                    function (err) {
                        createClass (category)
                            .then (function () {
                                
                                viewClass (category);
                            });
                    });
        }

        function viewClass(category) {
            $state.go ('app.class', {id: category.id});
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

        vm.sendInterests = function (data) {
            
            var Interests = Parse.Object.extend("Interests");
            var interests = new Interests();

            interests.set("professions", data);
            vm.interests = "";

            interests.save(null, {
              success: function(data) {
                // Execute any logic that should take place after the object is saved.
                
              },
              error: function(data, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                
              }
            });
        }

        vm.selectByIcon = function() {
            selectClass(vm.list[0]);
        }


    }

} ());
(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('FeedbackCtrl', FeedbackCtrl);


    function FeedbackCtrl() {

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
        .controller ('HomeCtrl', HomeCtrl);


    function HomeCtrl($state) {
        var vm = this;
        vm.toggle = true;

        vm.login = login;
        vm.signUp = signUp;

        init ();

        function init() {
            

        }

            function signUp(info){
                
                Parse.User.signUp(info.email, info.password).then(function(res){
                    
                    $state.go('app.explorer');
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
    function IndexCtrl ($state) {
        var vm = this;





    }

    angular
        .module('app')
        .controller('IndexCtrl', IndexCtrl);
}());