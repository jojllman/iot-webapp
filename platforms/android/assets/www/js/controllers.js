angular.module('app.controllers', [])
  
.controller('deviceTabCtrl', function($scope) {
	$scope.tasks = [
    { title: 'Collect coins' },
    { title: 'Eat mushrooms' },
    { title: 'Get high enough to grab the flag' },
    { title: 'Find the Princess' }
  	];
})
   
.controller('eventTabCtrl', function($scope) {

})
   
.controller('userManagementTabCtrl', function($scope) {

})
      
.controller('loginCtrl', function($scope) {

})
 
.controller('deviceListCtrl', function($scope) {
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true
})