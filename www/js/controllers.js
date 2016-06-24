angular.module('app.controllers', [])
  
.controller('deviceTabCtrl', function($scope, $ionicListDelegate, $ionicModal, GatewayFactory) {
  	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true;
	$scope.devices = GatewayFactory.devices;
	$scope.groups = GatewayFactory.groups;
	console.log($scope.devices);

	$ionicModal.fromTemplateUrl('templates/writeDataModal.html', function(modal) {
    	$scope.modal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$ionicModal.fromTemplateUrl('templates/setOwnerModal.html', function(modal) {
    	$scope.ownerModal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$ionicModal.fromTemplateUrl('templates/setGroupModal.html', function(modal) {
    	$scope.groupModal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$ionicModal.fromTemplateUrl('templates/newNFCModal.html', function(modal) {
    	$scope.nfcModal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$scope.shownItem = null;
	$scope.toggleItem = function(item) {
	    if ($scope.isItemShown(item)) {
	      $scope.shownItem = null;
	    } else {
	      $scope.shownItem = item;
	    }
  	};
  	$scope.isItemShown = function(item) {
	    return $scope.shownItem === item;
	};
	$scope.doRefresh = function() {
		$scope.shownItem = null;
		GatewayFactory.queryDeviceList();
		GatewayFactory.queryGroupUserList();
		$scope.devices = GatewayFactory.devices;
		$scope.groups = GatewayFactory.groups;
	};
	$scope.onOwnerClick = function(device) {
		$scope.lastDevice = device;
		console.log(device);
		$scope.openOwnerModal();
	};
	$scope.onGroupClick = function(device) {
		$scope.lastDevice = device;
		console.log(device);
		$scope.openGroupModal();
	};
	$scope.onWriteClick = function(channel) {
		$scope.lastChannel = channel;
		console.log(channel);
		$scope.openModal();
	};
	$scope.onReadClick = function(channel) {
		GatewayFactory.readChannelData(channel);
	};
	$scope.onNFCClick = function() {
		$scope.openNFCModal();
	};
	$scope.openModal = function() {
    	$scope.modal.show();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	}; 
	$scope.openOwnerModal = function() {
    	$scope.ownerModal.show();
	};
	$scope.closeOwnerModal = function() {
	    $scope.ownerModal.hide();
	};
	$scope.openGroupModal = function() {
    	$scope.groupModal.show();
	};
	$scope.closeGroupModal = function() {
	    $scope.groupModal.hide();
	};
	$scope.openNFCModal = function() {
		$scope.hostname = '';
		$scope.ssid = '';
		$scope.password = '';
		$scope.masterkey = '';
    	$scope.nfcModal.show();
	};
	$scope.closeNFCModal = function() {
	    $scope.nfcModal.hide();
	    nfc.unshare( function(){ }, function(){ alert("unshare Fail."); } );
	    nfc.removeNdefListener($scope.onNFCRead);
	};
	$scope.onValueEnter = function(inputValue) {
		$scope.modal.hide();
	    GatewayFactory.writeChannelData($scope.lastChannel, inputValue);
	    console.log($scope.lastChannel);
	    $scope.lastChannel = null;
	    console.log(inputValue);
	}; 
	$scope.setDeviceOwner = function(user) {
		$scope.ownerModal.hide();
	    GatewayFactory.setDeviceOwner($scope.lastDevice, user);
	    console.log($scope.lastDevice);
	    $scope.lastDevice = null;
	    console.log(user);
	};
	$scope.setDeviceGroup = function(group) {
		$scope.groupModal.hide();
	    GatewayFactory.setDeviceGroup($scope.lastDevice, group);
	    console.log($scope.lastDevice);
	    $scope.lastDevice = null;
	    console.log(group);
	};
	$scope.isAdmin = function() {
		return GatewayFactory.isAdmin();
	}; 
})

.controller('newNFCCtrl', function($rootScope, $scope, GatewayFactory){
	$scope.hostname = '';
	$scope.ssid = '';
	$scope.password = '';
	$scope.masterkey = '';

	$scope.onNFCRead = function(nfcEvent) {
		alert("Read started!");
        var tag = nfcEvent.tag,
        ndefMessage = tag.ndefMessage;
        payload = nfc.bytesToString(ndefMessage[0].payload).substring(3);
        data = payload.split( "|" );
        GatewayFactory.nfcdata = data;
        alert("Read OK! Now touch the IoT device.");
        $rootScope.$broadcast('nfcEvent');
	};

	$scope.$on('nfcEvent', function (event) {
		$scope.hostname = GatewayFactory.nfcdata[0];
		$scope.ssid = GatewayFactory.nfcdata[1];
		$scope.password = GatewayFactory.nfcdata[2];
		$scope.masterkey = GatewayFactory.nfcdata[3];
		$scope.sendNFC();
	});

	$scope.$on('nfcEventClose', function (event) {
		$scope.closeNFCModal();
	});
	
	$scope.requestNFC = function() {
	    GatewayFactory.startNFC();
	    nfc.removeNdefListener($scope.onNFCRead);
    	nfc.addNdefListener(
        $scope.onNFCRead,
        function() {}  );
	};
	$scope.sendNFC = function() {
		hostname = $scope.hostname;
		wifi_ssid = $scope.ssid;
		wifi_pass = $scope.password;
		master_key = $scope.masterkey;
		data = hostname + "|" + wifi_ssid + "|" + wifi_pass + "|" + master_key ;
		nfc.unshare( function(){ }, function(){ alert("unshare Fail."); } );
	    var message = [
	        ndef.textRecord(data)
	    ];
	    nfc.share(message, function(){
	    	$rootScope.$broadcast('nfcEventClose');
	    }, function(){
	    	$rootScope.$broadcast('nfcEventClose');
	    });
	};
})
   
.controller('eventTabCtrl', function($scope, $ionicModal, GatewayFactory) {
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true;
	$scope.events = GatewayFactory.events;
	console.log($scope.events);

	$ionicModal.fromTemplateUrl('templates/newEventModal.html', function(modal) {
    	$scope.modal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$scope.shownItem = null;
	$scope.toggleItem = function(item) {
	    if ($scope.isItemShown(item)) {
	      $scope.shownItem = null;
	    } else {
	      $scope.shownItem = item;
	    }
  	};
  	$scope.isItemShown = function(item) {
	    return $scope.shownItem === item;
	};
	$scope.doRefresh = function() {
		$scope.shownItem = null;
		GatewayFactory.queryEventList();
		$scope.events = GatewayFactory.events;
	};
	$scope.newEvent = function() {
		$scope.openModal();
	};
	$scope.openModal = function() {
		console.log($scope.conditions);
    	$scope.modal.show();
	};
	$scope.closeModal = function() {
		console.log('Modal close');
		$scope.events = GatewayFactory.events;
	    $scope.modal.hide();
	}; 
})

.controller('newEventCtrl', function($scope, $ionicListDelegate, GatewayFactory){
	console.log($ionicListDelegate.$getByHandle('ifList'));
	console.log($ionicListDelegate.$getByHandle('thenList'));

	$scope.devices = GatewayFactory.devices;
	$scope.conditions = [];
	$scope.execs = [];

	$scope.addIfCondition = function(device, channel, operator, value) {
		var condition = {};
		condition.device = device;
		condition.channel = channel;
		condition.operator = $scope.cloneObject(operator);
		condition.value = $scope.cloneObject(value);
		console.log(condition);
		$scope.conditions.push(condition);
		console.log($scope.conditions);
		console.log(device.name + '.' + channel.topic + operator + value);
	};
	$scope.addThenCondition = function(device, channel, operator, value) {
		var exec = {};
		exec.device = device;
		exec.channel = channel;
		exec.operator = $scope.cloneObject(operator);
		exec.value = $scope.cloneObject(value);
		console.log(exec);
		$scope.execs.push(exec);
		console.log($scope.execs);
		console.log(device.name + '.' + channel.topic + operator + value);
	};
	$scope.createEvent = function(eventName, eventRepeat, eventPeriod) {
		console.log(eventName);
		console.log(eventRepeat);
		console.log(eventPeriod);
		console.log($scope.conditions);
		var event = {};
		event.name = eventName;
		event.repeat = eventRepeat;
		event.period = eventPeriod;
		event.if = '';
		for(idx in $scope.conditions) {
			var condition = $scope.conditions[idx];
			console.log(condition);
			if(event.if == '') {
				event.if = '(' + '#CHANNEL$(' + condition.channel.id + ')' + condition.operator;
			}
			else {
				event.if = event.if + ' && (' +  '#CHANNEL$(' + condition.channel.id + ')' + condition.operator;
			}

			if(condition.channel.type == 'Boolean') {
				event.if = event.if + '#BOOL$(';
			}
			else if(condition.channel.type == 'Short') {
				event.if = event.if + '#SHORT$(';
			}
			else if(condition.channel.type == 'Integer') {
				event.if = event.if + '#INT$(';
			}
			else if(condition.channel.type == 'String') {
				event.if = event.if + '#STR$(';
			}
			event.if = event.if + condition.value + '))';
		}

		event.then = '';
		for(idx in $scope.execs) {
			var exec = $scope.execs[idx];
			if(event.then == '') {
				event.then = '(' + '#CHANNEL$(' + exec.channel.id + ')' + exec.operator;
			}
			else {
				event.then = event.then + ' && (' +  '#CHANNEL$(' + exec.channel.id + ')' + exec.operator;
			}

			if(exec.channel.type == 'Boolean') {
				event.then = event.then + '#BOOL$(';
			}
			else if(exec.channel.type == 'Short') {
				event.then = event.then + '#SHORT$(';
			}
			else if(exec.channel.type == 'Integer') {
				event.then = event.then + '#INT$(';
			}
			else if(exec.channel.type == 'String') {
				event.then = event.then + '#STR$(';
			}
			event.then = event.then + exec.value + '))';
		}
		console.log(event.if);
		console.log(event.then);

		GatewayFactory.addEvent(event);

		$scope.conditions = [];
		$scope.execs = [];
		$scope.events = GatewayFactory.events;
		$scope.closeModal();
	};
	$scope.cloneObject = function(obj) {
	    if (obj === null || typeof obj !== 'object') {
	        return obj;
	    }

	    var temp = obj.constructor(); // give temp the original obj's constructor
	    for (var key in obj) {
	        temp[key] = cloneObject(obj[key]);
	    }

	    return temp;
	};
})
   
.controller('userManagementTabCtrl', function($scope, $ionicModal, GatewayFactory) {
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.listCanSwipe = true;
	$scope.groups = GatewayFactory.groups;
	console.log($scope.groups);

	$ionicModal.fromTemplateUrl('templates/newUserModal.html', function(modal) {
    	$scope.modal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$ionicModal.fromTemplateUrl('templates/newGroupModal.html', function(modal) {
    	$scope.groupmodal = modal;
	  	}, {
	    // Use our scope for the scope of the modal to keep it simple
	    scope: $scope,
	    // The animation we want to use for the modal entrance
	    animation: 'slide-in-up'
	}); 

	$scope.shownItem = null;
	$scope.toggleItem = function(item) {
	    if ($scope.isItemShown(item)) {
	      $scope.shownItem = null;
	    } else {
	      $scope.shownItem = item;
	    }
  	};
  	$scope.isItemShown = function(item) {
	    return $scope.shownItem === item;
	};
	$scope.doRefresh = function() {
		GatewayFactory.queryGroupUserList();
		$scope.groups = GatewayFactory.groups;
	};
	$scope.isAdmin = function() {
	    return GatewayFactory.isAdmin();
  	};

	$scope.newUser = function() {
		$scope.openModal();
	};
	$scope.newGroup = function() {
		$scope.openGroupModal();
	};
	$scope.openModal = function() {
    	$scope.modal.show();
	};
	$scope.closeModal = function() {
		console.log('Modal close');
		$scope.groups = GatewayFactory.groups;
	    $scope.modal.hide();
	}; 
	$scope.openGroupModal = function() {
    	$scope.groupmodal.show();
	};
	$scope.closeGroupModal = function() {
		console.log('Modal close');
		$scope.groups = GatewayFactory.groups;
	    $scope.groupmodal.hide();
	}; 
})

.controller('newUserCtrl', function($scope, GatewayFactory) {
	$scope.createUser = function(username, password, passwordCheck, group) {
		if(angular.isDefined(username) 
			&& angular.isDefined(password) 
			&& angular.isDefined(passwordCheck)
			&& angular.isDefined(group)) {
			if(password == passwordCheck) {
				GatewayFactory.addUser(username, password, group);
				$scope.closeModal();
			}
		}
	};
})

.controller('newGroupCtrl', function($scope, GatewayFactory) {
	$scope.createGroup = function(groupName) {
		if(angular.isDefined(groupName)) { 
			GatewayFactory.addGroup(groupName);
			$scope.closeGroupModal();
		}
	};
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
						GatewayFactory.queryDeviceList();
						GatewayFactory.queryEventList();
						GatewayFactory.queryGroupUserList();
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