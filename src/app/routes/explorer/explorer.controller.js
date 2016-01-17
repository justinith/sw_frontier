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
                        console.log (res);
                        console.log ('Hello1');
                        viewClass (category);
                    },
                    function (err) {
                        createClass (category)
                            .then (function () {
                                console.log ('class hello');
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
            console.log(data);
            var Interests = Parse.Object.extend("Interests");
            var interests = new Interests();

            interests.set("professions", data);
            vm.interests = "";

            interests.save(null, {
              success: function(data) {
                // Execute any logic that should take place after the object is saved.
                console.log('New object created with objectId: ' + data.id);
              },
              error: function(data, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                console.log('Failed to create new object, with error code: ' + error.message);
              }
            });
        }


    }

} ());