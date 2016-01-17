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

        init ();


        function init() {
            loadClass ();
        }

        function getStepClass(index) {
            if(index < vm.selectedTab.index){
                return 'completed';
            } else if(index === vm.selectedTab.index){
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

                    console.log(vm.selectedTab);
                }, function (err) {
                    console.log ('Error', err);
                })
        }

        function nextStep() {
            var nextIndex = vm.selectedTab.index + 1;
            if(!vm.steps.finished){
                vm.selectedTab = vm.steps[nextIndex];
            }
        }

        function upload(file, currentStep) {
            vm.uploading = true;
            console.log ({a: vm.selectedTab});
            Api.uploadClassFile (file, vm.class.id, vm.selectedTab.index).then (completeTask, function (err) {
                console.log ('error', err);
                vm.uploading = false;
            })

        }


        function changeTask(index) {
            //console.log(vm.steps)
            if(!vm.steps.finished){
                vm.selectedTab = vm.steps[index];
            }
        }

        function completeTask() {
            Api.getClassByCategoryId (selectedCategory).then (function (classObj) {
                var index = vm.selectedTab.index;
                var steps = angular.copy (classObj.attributes.steps);
                steps[index].complete = true;
                if(!steps[index + 1]){
                    classObj.set('finished', true);
                }
                classObj.set ('steps', steps);
                classObj.save ();

                vm.class = classObj;
                vm.steps = classObj.attributes.steps;
                vm.selectedTab = vm.steps[index];


                vm.uploading = false;
            }, function () {

                vm.uploading = false;
            })
        }


    }

} ());

//var a = [{
//    "complete": true,
//    "description": "description ux-design class 0",
//    "title": "Assignment 1: Define User Personas",
//    "type": "upload",
//    "videoUrl": "https://www.youtube.com/embed/5w0fQ1AN0Io"
//}, {
//    "complete": false,
//    "description": "description ux-design class 1",
//    "title": "Assignment 2: Create User Flow",
//    "type": "upload",
//    "videoUrl": "https://www.youtube.com/embed/ZR1PBCzIWXw"
//}, {
//    "complete": false,
//    "description": "description ux-design class 2",
//    "title": "Assignment 3: Sketch Low-Fi Mockups",
//    "type": "upload",
//    "videoUrl": "https://www.youtube.com/embed/rsbSXxiur1s"
//}, {
//    "complete": false,
//    "description": "description ux-design class 3",
//    "title": "You completed UX Design",
//    "type": "upload",
//    "videoUrl": "https://www.youtube.com/embed/rsbSXxiur1s"
//}]















