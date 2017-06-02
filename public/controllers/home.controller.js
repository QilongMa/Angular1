(function () {
    var myApp = angular.module('myApp')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', 'UserService', 'Authentication', '$http', '$location'];
    function homeController($scope, UserService, Authentication, $http, $location) {
        console.log('Home controller');
        $scope.userView = 'views/AddTrainee.html';
        $scope.nav = nav;
        $scope.AddTranee = AddTranee;
        $scope.logOut = logOut;

        function nav(path) {
            $scope.userView = path;
        }
        function AddTranee() {
            var trainee = $scope.user;
            var client_array = $scope.user.clientcall.split(',');
            console.log(client_array);
            // trainee.clientcall = client_array;

            console.log(trainee);
            UserService.addTrainee(trainee)
                .then(function (val) {
                    if (val === 'Success') {
                        console.log('Success to add trainee');
                        $scope.user = {};
                        alert('User saved');
                    }
                    else {
                        console.log('Fail to add trainee');
                    }
                });
        }

        function logOut() {
            $http.get('/logout').then(function (val) {
               $location.path('signIn');
            });
        }
    }
})();