(function () {
    Parse.initialize("JIfQYPUWWSYqHKyZ67GSSnl1xZ4JUeDb9Eb66JcI", "LtHuNTsnXczKg6RcP81RjytAvvqeOdzcbfs2na5L");
    function AppRun($rootScope, $state) {
        // Route management
        //var stateChangeStart = $rootScope.$on('$stateChangeStart', function (e, toState) {
        //    if (CurrentUserStore.isLoggedIn === false) {
        //        CurrentUserStore.checkUser().then(function() {
        //            if(toState.name === 'app') {
        //                $state.go('app.admin', {});
        //            }
        //        }, function () {
        //            $state.go('app', {});
        //        })
        //    } else if(toState.name === 'app'){
        //        $state.go('app.admin', {});
        //    }
        //});
        var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
        testObject.save({foo: "bar"}).then(function(object) {
          alert("yay! it worked");
        });
    }

    angular
        .module('app')
        .run(AppRun);
}());