angular.module('palService', []).service('palSrv', function($http) {
    return {
    			login : function(data) {
    				return $http.post('/login', data);
    			},
                dataById : function(id) {
                    return $http.get('/getDataById/'+id);
                },
                update : function(data) {
                    return $http.put('/emailVerified/'+data);
                },
                forgot : function(data) {
                    return $http.post('/forgotPass', data);
                },
                logoutUser : function(data) {
                    return $http.get('/logout');
                },
                getValue: function () {
                    return localStorage.getItem("id");
                },
                setValue: function(id) {
                    localStorage.setItem("id", id);
                },
                getAdd : function() {
                    return $http.get('/getAddress');
                },
                getBike : function() {
                    return $http.get('/getBike');
                }
            }       
});