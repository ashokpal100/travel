//===============================Angular module ================================
//==============================================================================
var app = angular.module('pal', ['ui.router','ngMaterial','ngMessages','angular-media-preview','palService']);
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
        });
});
//=========================APP CONTROLLERS======================================
//==============================================================================
//==============================================================================
app.controller('loginController', function($scope,$state,$location) {

    $scope.login = function(){
         $location.path("/userdash");
    }
});
app.controller('signupController', function($scope,$state) {
    if($state.current.name == "signup")
     {
         $state.go('signup.user');
     }

});
app.controller('userdashController', function($scope,$state) {

    console.log("i am inside userdash");
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
app.controller('usersignupController', function($scope,$http,$filter, $window, $location, palSrv) {

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
    
      //console.dir(this.files[0]);
        console.log($scope.user);
        palSrv.signup($scope.user).success(function(response){
            console.log(response);
             if(response==1){
                $scope.emailMsg="User already registered.";
                //$location.path("/usersignup");
             }
             else if(response==2){
                //$location.path("/signupSuccess");
                alert("success");
             };  
        });
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
                            $http.get("/api/checkUnique/" + element.val()).success(function(data) {
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