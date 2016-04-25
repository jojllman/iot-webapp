angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.deviceTab', {
    url: '/page2',
    views: {
      'tab1': {
        templateUrl: 'templates/deviceTab.html',
        controller: 'deviceTabCtrl'
      }
    }
  })

  .state('tabsController.eventTab', {
    url: '/page3',
    views: {
      'tab2': {
        templateUrl: 'templates/eventTab.html',
        controller: 'eventTabCtrl'
      }
    }
  })

  .state('tabsController.userManagementTab', {
    url: '/page4',
    views: {
      'tab3': {
        templateUrl: 'templates/userManagementTab.html',
        controller: 'userManagementTabCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/page5')

  

});