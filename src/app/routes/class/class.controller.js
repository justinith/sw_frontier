(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('ClassCtrl', ClassCtrl);


    function ClassCtrl() {
        var vm = this;

        var id = 123; //from query parameters

        var mockData = {
            userId: "123",
            categoryId: 1,
            step: 1,
            steps:  [
                { 
                    videoUrl: "youtube",
                    description: "description",
                    type: "upload",
                    complete: true
                 }
            ]
        }

        var userData = getDataForUser(id);

        setPageData();
        
        function getDataForUser(userId) {
            // calls to the DB
            return mockData;
        }

        function setPageData() {
            vm.title = "Example Title";
            // vm.videoUrl = userData.steps[0].videoUrl;
            var url = "http://www.youtube.com/embed/0Bmhjf0rKe8";
            vm.videoUrl = url;

        }

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
                userCurrentlyAtThisTab: true
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
    }

} ());















