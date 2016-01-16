(function () {
    Parse.initialize("JIfQYPUWWSYqHKyZ67GSSnl1xZ4JUeDb9Eb66JcI", "LtHuNTsnXczKg6RcP81RjytAvvqeOdzcbfs2na5L");
    function AppRun($rootScope, $state) {
        // Route management
        var stateChangeStart = $rootScope.$on('$stateChangeStart', function (e, toState, toStateParams) {
            var currentUser = Parse.User.current();
            if(toState.name == 'app.home' && currentUser){
                e.preventDefault();
                $state.go('app.dash');
            } else if(toState.name != 'app.home' && !currentUser){
                e.preventDefault();
                $state.go('app.home');
            }
        });
    }

    angular
        .module('app')
        .run(AppRun);
}());