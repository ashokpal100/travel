//===============================Angular module ================================
//==============================================================================
var app = angular.module('pal', ['ui.router','ngMaterial','ngMessages','angular-media-preview','palService','ui-notification']);
//================================APP ROUTES ===================================
//==============================================================================
//==============================================================================
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'views/home.html'
        })
        .state('login', {
            url: '/login',
            views: {
                '': { templateUrl: 'views/login.html',controller:'loginController'},
                'navbar@login': {templateUrl: 'views/navbar.html',controller:'navbarController'}
            } 
        })
        .state('signup', {
            url: '/signup',
            views: {
                '': { templateUrl: 'views/signup.html',controller:'signupController'},
                'navbar@signup': {templateUrl: 'views/navbar.html',controller:'navbarController'}
            } 
       })
        .state('emailVerified', {
            url: '/emailVerified/:hash',
             views: {
                '': { templateUrl: 'views/emailVerified.html',controller:'emailVerifiedController'},
                'navbar@emailVerified': {templateUrl: 'views/navbar.html',controller:'navbarController'}
            }
        })
        .state('signup.user', {
            url: '/usersignup',
            templateUrl: 'views/signup/user.html',
            controller: 'usersignupController'
        })
        .state('signup.travel', {
            url: '/travelsignup',
            templateUrl: 'views/signup/travel.html',
            controller: 'travelsignupController'
        })
         .state('userdash', {
            url: '/userdash',
            templateUrl: 'views/userdash/userdash.html',
            controller: 'userdashController'
        })
        .state('userdash.home', {
            url: '/home',
            templateUrl: 'views/userdash/home/dashHome.html',
            controller: 'dashHomeController'
        })
        .state('userdash.home.rides', {
            url: '/rides',
            templateUrl: 'views/userdash/home/homeLinks/dashHomeRides.html',
            controller: 'dashHomeRidesController'
        })
        .state('userdash.profile', {
            url: '/profile',
            templateUrl: 'views/userdash/profile/dashProfile.html',
            controller: 'dashProfileController'
        })
        .state('userdash.profile.info', {
            url: '/info',
            templateUrl: 'views/userdash/profile/profileLinks/info.html',
            //controller: 'infoController'
        });
});
//=========================APP CONTROLLERS======================================
//==============================================================================
//==============================================================================
app.controller('loginController', function($scope,$state,$location,palSrv,Notification) {
$scope.user={};
    // var z=0.1+0.2;
    // console.log(z);
    // console.log(0.1+0.2);//0.30000000000000004
    // console.log(0.3);//0.3
    // var x=5;
    // console.log(x);
    // y=10;
    // console.log(y);

$scope.emailMsg='No user found!!....';
$scope.passMsg='password not match!!....';
    $('#passMsg1').hide();
    $('#emailMsg1').hide();
    
    $scope.login= function(){
      console.log();
        if (($scope.user.email!=undefined) && ($scope.user.password!=undefined)) {
          palSrv.login($scope.user).success(function(data, status, headers, config)
        {
          //localStorage.removeItem("id");
            console.log(data);
            //palSrv.setValue($scope.user.id);
            //$rootScope.$broadcast('myCustomEvent', $scope.user);
            //console.log($scope.user);
             if(data==1){
                
                 $('#emailMsg1').show();
                 $('#passMsg1').hide();
             }else if(data==2){
              
                 $('#passMsg1').show();
                 $('#emailMsg1').hide();
             }
             else if(data.emailverify==0){
              $('#emailMsg1').hide();
              $('#passMsg1').hide();
              Notification.error({message: 'Email is not veridied', 
                      delay: 5000,
                      positionY: 'bottom', 
                      positionX: 'center'
                    });
             }
             else{
                palSrv.setValue(data.id);
                $state.go('userdash');
             };
        });
        }else{
              $('#emailMsg1').hide();
              $('#passMsg1').hide();
             Notification.error({message: 'Please Fills the fields', 
                      delay: 5000,
                      positionY: 'bottom', 
                      positionX: 'center'
                    });
        }
    };
});
app.controller('signupController', function($scope,$state) {
    if($state.current.name == "signup")
     {
         $state.go('signup.user');
     }

});
app.controller('dashProfileController', function($scope,$state) {

    console.log("i am inside profile");

    if($state.current.name == "userdash.profile")
     {
         $state.go('userdash.profile.info');
     }

});
app.controller('emailVerifiedController', function($scope,$state,$stateParams, palSrv) {
     $scope.hash  = $stateParams.hash;

     palSrv.update($scope.hash).success(function(response){
             console.log(response);
         });
     $scope.login = function(){
      $state.go('login');
     }

});
app.controller('userdashController', function($scope,$state,palSrv) {

    console.log("i am inside userdash");
     var id=palSrv.getValue();
      palSrv.dataById(id).success(function(response)
        {
          //console.log(response);
          $scope.user=response;
          console.log($scope.user.fname);
        });
     if($state.current.name == "userdash")
     {
         $state.go('userdash.home');
     }
});
app.controller('dashHomeController', function($scope,$state) {

    console.log("i am inside home");
     if($state.current.name == "userdash.home")
     {
         $state.go('userdash.home.rides');
     }
});
app.controller('dashHomeRidesController', function($scope,$state) {

    console.log("i am inside rides");
});
app.controller('usersignupController', function($scope,$http,$filter, $window, $location, palSrv,Notification,$state) {
    $scope.user = {};

    //$scope.myModel = files[0];
    // $scope.dp_options = {
    // lang : 'en',
    // sort_days : ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    // short_months : ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
    // }
    var jsonvalue = '2015-08-12T05:00:00.000Z';
    $scope.time = new Date(jsonvalue);
    $scope.parsed = $filter('date')($scope.time, "yyyy-MM-dd HH:mm:ss");

     $scope.signup= function(){

        var file_ext=["image/png","image/jpg","image/jpeg","image/gif"];
        var file_type_ok=true;
        var file = $scope.myFile;

        console.log(file);

        console.log($scope.user);

        var file_size=Math.round(file.size/1024);

        file_ext.forEach(function(element, index)
        {
            if(element===(file.type).toLowerCase()){
                file_type_ok=false;
            }
        });
        var fd = new FormData();
        fd.append('fname',$scope.user.fname);
        fd.append('lname',$scope.user.lname);
        fd.append('mobileNumber',$scope.user.mobileNumber);
        fd.append('email',$scope.user.email);
        fd.append('password',$scope.user.password);
        fd.append('dob',$scope.user.dob);
        fd.append('file' , file);
        console.log(fd);

        if(file_size>500)
        {
            Notification.error({message: 'Upload image file below 500 KB.', 
                      delay: 5000,
                      positionY: 'bottom', 
                      positionX: 'center'
                    });
        }
        else if(file_type_ok){
            Notification.error({message: 'Only accept image files', 
                      delay: 5000,
                      positionY: 'bottom', 
                      positionX: 'center'
                    });
        }
       
        else{
            $http.post("/signup", fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(data, status, headers, config) {
              console.log("response======",data);
                if(data){
                    Notification.success({message: 'Registration successfully !', 
                      delay: 5000,
                      positionY: 'bottom', 
                      positionX: 'center'
                    });
                    $state.go('login');
                    //$window.location.href = "/";
                }else{
                    
                }
            })
            .error(function(){
                alert("Connection Error");
            });
        }
        
    };
     
}); 
app.controller('navbarController', function($scope,$state) {


}); 
app.controller('travelsignupController', function($scope,$state) {

    $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

 
  $scope.format = 'dd-MMMM-yyyy';
}); 
//=================== APP DIRECTIVES=================================
//===================================================================
//===================================================================
app.directive('uniqueUsername', function($http) {
      return {
           restrict: 'AE',
           require: 'ngModel',
           link: function (scope, element, attrs, ngModel) {
                element.bind('blur', function (e) {
                    ngModel.$setValidity('unique', true);
                    
                    if(scope.user.email==undefined){} 
                    else
                    {       //console.log("else",scope.user.email);
                            $http.get("/api/checkUnique/" + element.val()).success(function(data, status, headers, config) {
                              if (data=="notAvailable") {
                                  ngModel.$setValidity('unique', false);
                              }else{
                                ngModel.$setValidity('unique', true);
                              }
                           });
                    };
                });
           }
      };
})
app.directive('nxEqualEx', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});

app.factory('imagePreview', function($log, $q, $mdDialog) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();
    if (file.type.split('/')[0] === 'image' || file.type.split('/')[1] === 'pdf') {
      if (file.size <= (800 * 1024)) {
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
      } else {
        $mdDialog.show(
          $mdDialog.alert()
          .clickOutsideToClose(false)
          .title('File size is large')
          .content('Please upload a file up to 800KB only ')
          .ok('Ok')
        );

        return deferred.promise;
      }
    } else {

      $mdDialog.show(
        $mdDialog.alert()
        .clickOutsideToClose(false)
        .title('Incorrect file format')
        .content('Only images are allowed ')
        .ok('Ok')
      );
      return deferred.promise;
    }
  };

  return {
    readAsDataURL: readAsDataURL
  };
});
app.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(event){
             scope.$apply(function(){
                var files = event.target.files;
                /* 
                    Writing the selected file name below the Upload image
                */  
                angular.element( document.querySelector( '#selectedFile' )).html(files[0].name);
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
}]);
app.directive('image', function($q) {
        var URL = window.URL || window.webkitURL;
        var createImage = function(url, callback) {
            var image = new Image();
            image.onload = function() {
                callback(image);
            };
            image.src = url;
        };

        var fileToDataURL = function (file) {
            var deferred = $q.defer();
            var reader = new FileReader();
            reader.onload = function (e) {
                deferred.resolve(e.target.result);
            };
            reader.readAsDataURL(file);
            return deferred.promise;
        };


        return {
            restrict: 'A',
            scope: {
                image: '=',
                resizeMaxHeight: '@?',
                resizeMaxWidth: '@?',
                resizeQuality: '@?',
                resizeType: '@?',
            },
            link: function postLink(scope, element, attrs, ctrl) {

                var doResizing = function(imageResult, callback) {
                    createImage(imageResult.url, function(image) {
                        var dataURL = resizeImage(image, scope);
                        imageResult.resized = {
                            dataURL: dataURL,
                            type: dataURL.match(/:(.+\/.+);/)[1],
                        };
                        callback(imageResult);
                    });
                };

                var applyScope = function(imageResult) {
                    scope.$apply(function() {
                        //console.log(imageResult);
                        if(attrs.multiple)
                            scope.image.push(imageResult);
                        else
                            scope.image = imageResult; 
                    });
                };


                element.bind('change', function (evt) {
                    //when multiple always return an array of images
                    if(attrs.multiple)
                        scope.image = [];

                    var files = evt.target.files;
                    for(var i = 0; i < files.length; i++) {
                        //create a result object for each file in files
                        var imageResult = {
                            file: files[i],
                            url: URL.createObjectURL(files[i])
                        };

                        fileToDataURL(files[i]).then(function (dataURL) {
                            imageResult.dataURL = dataURL;
                        });

                        if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                            doResizing(imageResult, function(imageResult) {
                                applyScope(imageResult);
                            });
                        }
                        else { //no resizing
                            applyScope(imageResult);
                        }
                    }
                });
            }
        };
    });
/*creating Directive to Upload file ends*/