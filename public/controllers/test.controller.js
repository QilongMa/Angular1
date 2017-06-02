angular.module('myApp')
    .directive('detail', function (UserService) {
        return {
            restrict: 'EA',
            templateUrl: 'views/trainee.html',
            replace: true,
            scope:{
                user : '=tUser'
            },
            link: function (scope, elem, attrs) {
                scope.showme = false;
                scope.toggle = function () {
                    scope.showme = !scope.showme;
                };
            }
        }
    })
    .controller('testController', testController);

function testController($scope, UserService) {
    console.log('Test controller');
    UserService.getAll()
        .then(function (val) {
            $scope.users = val;
        });
}