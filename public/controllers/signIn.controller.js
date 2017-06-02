(function () {
    angular.module('myApp')
        .controller('signInController', signInController);

    signInController.$inject = ['$scope', '$rootScope', '$http', 'UserService', '$location'];
    function signInController($scope,$rootScope, $http, UserService, $location) {
        $scope.logIn = logIn;

        function logIn() {
            console.log('log in :' + $scope.user.username);
            var username = $scope.user.username;
            var password = $scope.user.password;
            console.log(username + ': ' + password);
            UserService.verifyLogIn(username, password)
                .then(function (val) {
                    if(val === null){
                        console.log('User does not exist!');
                    }
                    else {
                        console.log(val);
                        $location.path('/home');
                    }
                })

        }
    }
})();