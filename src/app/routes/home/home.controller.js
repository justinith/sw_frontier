(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('HomeCtrl', HomeCtrl);


    function HomeCtrl($state) {
        console.log(Parse);
        var vm = this;

        vm.login = login;
        vm.signUp = signUp;

        init ();

        function init() {
            console.log('Hello!');

        }



            function signUp(info){
                console.log('signup', info);
                Parse.User.signUp(info.email, info.password).then(function(res){
                    console.log('signup success', res)
                }, function(err){
                    console.log('signup err', err);
                });

            }
            function login(info){
                Parse.User.logIn(info.email, info.password).then(function(res){
                    $state.go('app.dash');
                    console.log('login success', res);
                }, function(err){
                    alert('Login Failed');
                    console.log('login error', err);
                });
                console.log(login);
            }

    }

} ());