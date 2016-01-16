(function () {
    'use strict';

    angular
        .module ('app.routes')
        .controller ('HomeCtrl', HomeCtrl);


    function HomeCtrl() {
        var vm = this;

        vm.login = login;

        init ();

        function init() {
            console.log('Hello!');

        }




            function login(){
                console.log(login);
            }

    }

} ());