angular.module('app.controllers', [])
  
.controller('deviceTabCtrl', function($scope, $ionicListDelegate) {
	$scope.tasks = [
    { title: 'Collect coins' },
    { title: 'Eat mushrooms' },
    { title: 'Get high enough to grab the flag' },
    { title: 'Find the Princess' }
  	];
  	$ionicListDelegate.shouldShowDelete = true;
	$ionicListDelegate.shouldShowReorder = true;
	$ionicListDelegate.listCanSwipe = false;
})
   
.controller('eventTabCtrl', function($scope) {

})
   
.controller('userManagementTabCtrl', function($scope) {

})
      
.controller('loginCtrl', function($scope) {

})