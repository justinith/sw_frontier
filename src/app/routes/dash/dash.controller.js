(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('DashCtrl', DashCtrl);


    function DashCtrl($scope, $state, Api) {
        var vm = this;
        var currentUser = Parse.User.current ();

        //console.log(currentUser.fetch());
        //console.log({a:Parse.User});
        //console.log({a:currentUser});
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

    }

} ());