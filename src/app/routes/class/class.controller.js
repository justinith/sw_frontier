(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('ClassCtrl', ClassCtrl);


    function ClassCtrl($q, $scope, $state, Api, Upload) {

        var vm = this;
        var selectedCategory = $state.params.id;
        vm.selectedTab = {};
        vm.steps = [];
        vm.category = {};
        vm.class = {};


        vm.upload = upload;

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
                    vm.class = res[0];
                    vm.steps = res[0].attributes.steps.map(function(obj, i){
                        obj.index = i;
                        return obj;
                    });
                    vm.category = res[1];
                    vm.selectedTab = _.chain(vm.steps)
                        .filter(function(step){
                            return !step.complete;
                        })
                        .first()
                        ._wrapped;
                }, function(err){
                    console.log('Error', err);
                })
        }

        function nextStep(currentStep){

        }
        function upload(file, currentStep){
            console.log({a:vm.selectedTab});
            Api.uploadClassFile(file, vm.class.id, vm.selectedTab.index).then(function(res){
                console.log('success', res)
            },function(err){
                console.log('error', err)
            })

        }


        
    }

} ());















