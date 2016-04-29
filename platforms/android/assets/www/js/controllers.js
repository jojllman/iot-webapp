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
      
.controller('loginCtrl', function($scope, $state, GatewayFactory, $interval, $timeout) {
	$scope.login = function(user) {
		if(angular.isDefined(user)) {
			if(angular.isDefined(user.username) && angular.isDefined(user.password)) {
				GatewayFactory.login(user.username, user.password);
				promise = $interval(function() {
					if(!GatewayFactory.isLogin()) {
						console.log('not login yet');
					}
					else {
						console.log('change to tabsController.deviceTab');
						$timeout(function() {
							$state.go('tabsController.deviceTab');
							console.log('change to tabsController.deviceTab');
						}, 100);
						$interval.cancel(promise);
					}
				}, 100, 100);
			}
		}
	};
})