angular.module('app.services', [])

.factory('GatewayFactory', ['$http', '$rootScope', function($http, $rootScope){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	var URL = 'http://140.118.126.238:6680/REST/app/gateway/';
	var SERVICE_KEY = 'f80ebc87-ad5c-4b29-9366-5359768df5a1';
	var gateway = {};

	gateway.authToken = '';
	gateway.admin = false;
	gateway.users = [];
	gateway.groups = [];
	gateway.devices = [];
	gateway.events = [];

	gateway.isLogin = function() {
		return gateway.authToken.length != 0;
	};
	gateway.isAdmin = function() {
		return gateway.admin == true;
	};
	gateway.login = function(username, password) {
		$http({
            method: 'POST',
            url: URL + 'login',
            headers: {
				'service_key': SERVICE_KEY
			},
			transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
            data: {
                username: username,
                password: password
            }
        })
        .then(function successCallback(response) {
        	console.log('login success');
        	console.log(response);
		    gateway.authToken = response.data.auth_token;
		    gateway.admin = response.data.admin;
		    console.log(gateway);
		}, function errorCallback(response) {
			// called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log(response);
		});
	};
	gateway.logout = function() {
		if(gateway.isLogin()) {
			$http({
	            method: 'POST',
	            url: URL + 'logout',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				}
	        })
	        .then(function successCallback(response) {
			    gateway.authToken = '';
			    gateway.admin = false;
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};
	gateway.queryUserList = function() {
		if(gateway.isLogin() && gateway.isAdmin()) {
			$http({
	            method: 'GET',
	            url: URL + 'query-user-list',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				}
	        })
	        .then(function successCallback(response) {
			    gateway.users = response.data.users;

			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};
	gateway.queryGroupList = function() {
		if(gateway.isLogin() && gateway.isAdmin()) {
			$http({
	            method: 'GET',
	            url: URL + 'query-group-list',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				}
	        })
	        .then(function successCallback(response) {
			    gateway.groups = response.data.groups;
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};
	gateway.queryEventList = function() {
		if(gateway.isLogin()) {
			$http({
	            method: 'GET',
	            url: URL + 'query-event-list',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				}
	        })
	        .then(function successCallback(response) {
	        	console.log(response.data.user_events);
			    gateway.events = response.data.user_events[0].events;
			    $rootScope.$broadcast('scroll.refreshComplete');
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};
	gateway.queryDeviceList = function() {
		if(gateway.isLogin()) {
			$http({
	            method: 'GET',
	            url: URL + 'query-device-list',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				}
	        })
	        .then(function successCallback(response) {
			    gateway.devices = response.data.devices;
			    $rootScope.$broadcast('scroll.refreshComplete');
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};

	gateway.writeChannelData = function(channel, value) {
		if(gateway.isLogin()) {
			$http({
	            method: 'POST',
	            url: URL + 'write-channel-data',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				},
				transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
			    },
				data: {
					channel_id: channel.id,
					type: channel.type,
					value: value
				}
	        })
	        .then(function successCallback(response) {
			    channel.value = value;
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};

	gateway.readChannelData = function(channel) {
		if(gateway.isLogin()) {
			$http({
	            method: 'POST',
	            url: URL + 'read-channel-data',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				},
				transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
			    },
				data: {
					channel_id: channel.id
				}
	        })
	        .then(function successCallback(response) {
			    channel.value = response.data.value;
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};
	gateway.addEvent = function(event) {
		if(gateway.isLogin()) {
			$http({
	            method: 'POST',
	            url: URL + 'add-event',
	            headers: {
					'service_key': SERVICE_KEY,
					'auth_token': gateway.authToken
				},
				transformRequest: function(obj) {
			        var str = [];
			        for(var p in obj)
			        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			        return str.join("&");
			    },
				data: {
					name: event.name,
					if: event.if,
					then: event.then,
					repeat: event.repeat,
					period: event.period
				}
	        })
	        .then(function successCallback(response) {
			    gateway.events.push(event);
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
			    // or server returns response with an error status.
			});
    	}
	};

	return gateway;
}])

.service('BlankService', [function(){

}]);

