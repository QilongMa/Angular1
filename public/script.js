
(function () {
    var myApp = angular.module('myApp', ['ngRoute'])
        .config(function ($routeProvider) {
            var Authentication = function ($q, $http, $location) {
                var deferred = $q.defer();
                $http.get('/api/users/loggedIn')
                    .then(function (val) {
                        console.log('Verified val is : ' + val);
                        if(val.data === 'Verified'){
                            deferred.resolve(true);
                        }
                        else{
                            $location.path('signIn');
                            deferred.reject(false);
                        }
                    });
                return deferred.promise;
            };
            $routeProvider
                .when('/signIn',{
                    templateUrl:'views/signIn.html',
                    controller:'signInController'
                })
                .when('/home', {
                    templateUrl:'views/home.html',
                    controller:'homeController',
                    resolve:{
                        auth : Authentication
                    }
                })
                .otherwise({
                    redirectTo:'/signIn'
                });
        });



})();