
(function () {
    angular.module('myApp').factory('Authentication', Authentication);

    function Authentication() {
        var auth = {};
        auth.grantAuth = grantAuth;
        auth.checkAuth = checkAuth;
        auth.removeAuth = removeAuth;

        return auth;

        function grantAuth(users) {
            var session = users;
            setData(session);
        }

        function checkAuth() {
            if(getData()){
                return getData();
            }
            return false;
        }

        function removeAuth() {
            if(getData()) {
                localStorage.removeItem('sessions');
            }
        }
        function getData() {
            return JSON.parse(localStorage.getItem('sessions'));
        }

        function setData(users) {
            localStorage.setItem('sessions', JSON.stringify(users));
        }

    }

})();