(function () {
    'use strict';

    angular
        .module ('app')
        .factory ('Api', Api);


    function Api($q) {
        function generateErrorResponse(response) {
            return $q.reject (response);
        }

        function generateSuccessResponse(response) {
            return $q.when (response)
        }

        function queryTable(table) {
            return new Parse.Query (Parse.Object.extend (table));
        }

        function tableObject(tableName) {

            var Table = Parse.Object.extend (tableName);
            return new Table ();
        }

        return {
            createClass: createClass,
            getClassByCategoryId: getClassByCategoryId,
            setUserPrimaryClass: setUserPrimaryClass,
            getCategoryById: getCategoryById
        };

        function createClass(params) {
            var currentUser = Parse.User.current ();
            if (!currentUser) {
                return $q.reject ('User Not Logged In');
            }
            var userClasses = tableObject ('UserClasses');
            userClasses.set ('userId', currentUser.id);
            _.each (params, function (obj, key) {
                userClasses.set (key, obj);
            });
            return userClasses.save ()
                .then (generateSuccessResponse, generateErrorResponse);
        }

        function getCategoryById(categoryId){
            return queryTable('Category')
                .equalTo('id', categoryId)
                .first()
                .then(generateSuccessResponse, generateErrorResponse);
        }
        function getClassByCategoryId(categoryId) {
            var currentUser = Parse.User.current ();
            return queryTable ('UserClasses')
                .equalTo ('userId', currentUser.id)
                .equalTo ('categoryId', categoryId)
                .first ()
                .then (function (res) {
                    return generateSuccessResponse (res);
                }, generateErrorResponse);
        }

        function setUserPrimaryClass(classId) {
            return Parse
                .User
                .current ()
                .fetch ()
                .then (function (user) {
                    return user
                        .set ('primaryClass', classId)
                        .save ()
                        .then (generateSuccessResponse, generateErrorResponse);
                }, generateErrorResponse);
        }
    }

} ());