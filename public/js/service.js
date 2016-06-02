angular.module('palService', []).service('palSrv', function($http) {
    return {
                signup : function(data) {
    				return $http.post('/signup', data);
    			},
    			login : function(data) {
    				return $http.post('/login', data);
    			},
                dataById : function(id) {
                    return $http.get('/getDataById/'+id);
                },
                update : function(id, data) {
                    return $http.put('/password/'+id, data);
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