(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('DashCtrl', DashCtrl);


    function DashCtrl($scope, $q) {

        var vm = this;
        var currentUser = Parse.User.current();

        console.log(currentUser);
        vm.list = [];
        vm.description = 'Welcome to Frontier';

        vm.selectClass = selectClass;
        init ();

        function init() {
            getCategories();
        }

        function getCategories(){
            var Category = Parse.Object.extend('Category');
            var query = new Parse.Query(Category);
            query.find().then(function(success){
                console.log(success[0].attributes);
                vm.list = success;
                $scope.$digest();
                console.log('query success', success);
            }, function(err){
                alert('Error loading Categories');
                console.log('query err', err);
            });
        }


        function selectClass(category){
            console.log(category);
            getCategoryById(category.id)
                .then(function(res){
                    console.log('select class err', res);
                }, function(){
                    console.log('select class err', err);
                });
                //.catch(function(err){
                //    console.log('error', err)
                //});
        }

        function getCategoryById(id){
            var Category = Parse.Object.extend('UserClasses');
            var query = new Parse.Query(Category);

            query.equalTo('userId', currentUser.id);
            query.equalTo('categoryId', id);

            return query.find();
        }

    }

} ());