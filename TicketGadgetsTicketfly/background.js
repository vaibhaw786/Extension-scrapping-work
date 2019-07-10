var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $interval, $http) {

	$scope.propertyName = 'count';
	$scope.reverse = true;

	$scope.sortBy = function(propertyName) {
		$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
		$scope.propertyName = propertyName;
	};


	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    str = tabs[0].url;
    //alert(str);
    $scope.LockedShow=1;
    
    n1 = str.indexOf("ticketfly");
    	if(n1>0)
    	{
    		$scope.LockedShow=0;
    	}	
	});




	$scope.loadershowfirst = 1;
	$scope.urlapi = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
	chrome.storage.sync.get(['TicketflyApi'], function(result) {
		$("#dataAPI").val(result.TicketflyApi)
		$scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.TicketflyApi + "&apitype=2&exid=" + chrome.runtime.id + "&type=chkkey";
		$http.get($scope.urlapi)
			.then(function(response) {
				if (response.data == 1) {
					$scope.Apivalid = true;
				} else if (response.data == 2) {
					$scope.errormsg = "Please Enter Another key this key already used";
					$scope.Apivalid = false;
				} else {
					$scope.Apivalid = false;
				}
				$scope.loadershowfirst = 0;
			});
		//alert('Value currently is ' + result.TicketflyApi);
	});
	$scope.deleteApi = function() {
		$scope.loadershow = 1;
		$scope.urlapi = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
		chrome.storage.sync.get(['TicketflyApi'], function(result) {
			$("#dataAPI").val(result.TicketflyApi)
			$scope.urlapi += "?action=my_delete_Api_action&apitype=2&Api=" + result.TicketflyApi + "&exid=" + chrome.runtime.id;
			$http.get($scope.urlapi)
				.then(function(response) {


					$scope.Apivalid = false;
				});
			$scope.loadershow = 0;
		});



	}

	$scope.saveApi = function() {
		value = ($("#dataAPI").val());
		$scope.loadershowfirst = 1;
		chrome.storage.sync.set({
			TicketflyApi: value
		}, function() {
			$scope.urlapi = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
			//$scope.urlapi = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
			chrome.storage.sync.get(['TicketflyApi'], function(result) {

				$scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.TicketflyApi + "&apitype=2&exid=" + chrome.runtime.id + "&type=upkey";


				$http.get($scope.urlapi)
					.then(function(response) {

						if (response.data == 1) {
							$scope.Apivalid = true;
						} else if (response.data == 2) {
							$scope.errormsg = "Please Enter Another key this key already used";
							$scope.Apivalid = false;
						} else {
							$scope.errormsg = "Please Enter Valid Api Key";
							$scope.Apivalid = false;
						}
						$scope.loadershowfirst = 0;
					});
				//alert('Value currently is ' + result.TicketflyApi);
			});
		});
	}



	chrome.tabs.query({
		currentWindow: true,
		active: true
	}, function(tabs) {
		var apiid = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
		var str = tabs[0].url;

		NewUrl = apiid + "?action=Ticketfly_getEventID&url=" + tabs[0].url;
		$http.get(NewUrl)
			.then(function(response) {
				$scope.eventID = response.data;
				$scope.getSeats();

			});
	});



	$scope.getSeats = function() {
		$scope.loadershow = 1;

		if ($scope.eventID == "") {
			EVENTID = $('#eventID').val();
		} else {
			EVENTID = $scope.eventID;
		}


		url = 'https://www.ticketfly.com/purchase/selectSeats/map?eventId=' + EVENTID;

		chrome.storage.sync.set({
			TicketflyApiURL: url
		}, function() {})

		$scope.Resale = 0;
		$scope.Primary = 0;
		$http.get(url)
			.then(function(response) {
				$scope.myWelcome = response.data;
				$scope.loadershow = 0;
				$('#loadering').find('span').toggleClass("full");
				$('#loadering').find('span').toggleClass("low");
			});

		$scope.eventID
	};

	$interval(function() {

		$('#loadering').find('span').toggleClass("full");
		$('#loadering').find('span').toggleClass("low");
		chrome.storage.sync.get(['TicketflyApiURL'], function(result) {
			$scope.Resale = 0;
			$scope.Primary = 0;
			$http.get(result.TicketflyApiURL)
				.then(function(response) {
					$scope.myWelcome = response.data;
					$scope.loadershow = 0;
				});
		});

	}, 30000);



});