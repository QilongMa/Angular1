(function () {
    angular.module('myApp').factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.verifyLogIn = verifyLogIn;
        service.addTrainee = addTrainee;
        service.getAll = getAll;

        return service;

        function verifyLogIn(username, password) {
            return $http.post('/api/users/login', {'username':username, 'password':password}).then(handleSuccess, handleError);
        }

        function addTrainee(trainee) {
            return $http.post('/api/trainee/add', trainee).then(handleSuccess, handleError);
        }

        function getAll() {
            return $http.get('/api/trainee').then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(err) {
            return function () {
                return {success:false, message:'error from server'};
            }
        }
    }
})();