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

                    console.log (vm.selectedTab);
                }, function (err) {
                    console.log ('Error', err);
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
                            console.log("updated to false" );
                        },
                        error: function(data, error){
                            console.log("failed");
                        }
                    });
                }
                else if (premium === false) {
                    console.log("they've completed it already, don't do anything");
                }
                else if (premium === true ) {
                    console.log("don't do anything either");
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
                    console.log("updated to true" );
                },
                error: function(data, error){
                    console.log("failed");
                }
            });
        }

        function submitFeedback() {
            console.log("submittingFeedback");
            console.log(vm.feedbackData);

            var Feedback = Parse.Object.extend("Feedback");
            var feedback = new Feedback();

            feedback.set("userId", Parse.User.current().id);
            feedback.set("feedback", vm.feedbackData);
            vm.feedbackData = "";
            feedback.save(null, {
                success: function(data) {

                    swal({
                        title: 'Thank you for the Feedback',
                        confirmButtonText: "Close"
                    });
                    console.log("saved feedback");
                },
                error: function(data, error) {
                    console.log("failed to save feedback");
                }
            });
        }
    }
} ());