(function () {
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
    }

    angular
        .module('app')
        .run(AppRun);
}());