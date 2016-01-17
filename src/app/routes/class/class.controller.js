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
                    console.log('Error', err);
                })
        }

        function nextStep(currentStep){

        }

        function uploadFile(){

        }



        
    }

} ());















