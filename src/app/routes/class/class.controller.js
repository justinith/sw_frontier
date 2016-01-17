(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('ClassCtrl', ClassCtrl);


    function ClassCtrl($scope) {
        var vm = this;
        vm.tabs = [
            { 
                tabTitle: "1", 
                videoUrl: "http://www.youtube.com/embed/0Bmhjf0rKe8",
                showDescription: true,
                descriptionText: "Hello description Text",
                showUpload: true
            },
            {
                tabTitle: "2", 
                videoUrl: "http://www.youtube.com/embed/0Bmhjf0rKe8",
                showDescription: false,
                descriptionText: "Hello description Text2",
                showUpload: false
            },
            {
                tabTitle: "3", 
                videoUrl: "http://www.youtube.com/embed/0Bmhjf0rKe8",
                showDescription: true,
                descriptionText: "Hello description Text",
                showUpload: true,
            },
            {
                tabTitle: "4", 
                videoUrl: "http://www.youtube.com/embed/0Bmhjf0rKe8",
                showDescription: true,
                descriptionText: "Hello description Text",
                showUpload: false
            },
            {
                tabTitle: "5", 
                videoUrl: "http://www.youtube.com/embed/0Bmhjf0rKe8",
                showDescription: true,
                descriptionText: "Hello description Text",
                showUpload: false
            }];
        
        var categoryId = "scCgDCYLa6"; //from query parameters
        var currentUser = Parse.User.current();
        var userStr = JSON.stringify(currentUser);
        var userId = currentUser.id
        console.log("current user: " + userStr);
        console.log("user's objectId: " + userId);

        //get the category data for userId for this current category and populate it on the page
        var UserClasses = Parse.Object.extend("UserClasses");
        var query = new Parse.Query(UserClasses);
        query.equalTo("categoryId", categoryId);
        query.equalTo("userId", userId);
        query.find({
          success: function(object) {
            console.log("success");
            //check length is 1
            populateTabData(object[0]);
          },
          error: function(object, error) {
            console.log("errorr");
          }
        });

        vm.title = "Example Title";

        function populateTabData(tabData) {

            var data = tabData.toJSON();
            var steps = data.steps;

            for (var i=0; i< steps.length; i++) {
                console.log(steps[i]);
                var currentStep = steps[i];
                var currentTab = vm.tabs[i];

                //check which step we are on
                if (currentStep.complete === true) {
                    currentTab.userCurrentlyAtThisTab = false;
                }
                else {
                    currentTab.userCurrentlyAtThisTab = true; 
                }

                //set description and video
                currentTab.descriptionText = currentStep.description;
                currentTab.videoUrl = currentStep.videoUrl;
                console.log("done: " + i);;
                //check if upload or next

            }
            $scope.$digest();
        };
        
    }

} ());















