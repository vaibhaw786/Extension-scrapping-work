var app = angular.module('myApp', []);
app.filter('replace', [function() {

    return function(input, from, to) {

        if (input === undefined) {
            return;
        }

        var regex = new RegExp(from, 'g');
        return input.replace(regex, to);

    };


}]);

app.controller('myCtrl', function($scope, $interval, $http) {
    $scope.tabclass1 = true;
    $scope.tabclass2 = false;
    $scope.eventURL = "";
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        $scope.eventURL = tabs[0].url;
        str = $scope.eventURL;
        console.log(str);
        $scope.LockedShow = 1;
        n = str.indexOf("stubhub");
        n1 = str.indexOf("ticketmaster");
        n2 = str.indexOf("livenation");
        if (n > 0 || n1 > 0 || n2 > 0) {
            $scope.LockedShow = 0;
        }
        TabEventID($scope.eventURL);
    });
    $scope.admin = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
    var CurrentUrl = "";
    $scope.fabCounter = 0;
    $scope.fromdate = "";
    $scope.todate = "";

    $scope.loadershowfirst = 1;
    $scope.isFavourite = 0;

    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
            if (request.method == "getText") {
                console.log(sendResponse({ data: document.all[0].innerText, method: "getText" })); //same as innerText
            }
        }
    );

    chrome.runtime.onMessage.addListener(function(request, sender) {
        $('#message').hide();
        if (request.action == "getSource") {
            message.innerText = request.source;
            NEWJSON = request.source.split("storeUtils['eventJSONData']=");
            NEWJSON = $.trim(NEWJSON[1].split("storeUtils['envType']")[0]);
            NEWJSON = $.parseJSON(NEWJSON.substring(0, NEWJSON.length - 1));
            console.log(NEWJSON);
            $('#message').html($.parseHTML(message.innerText));
            var Title = $.trim($('#message').find('.event-header__event-name-text').html());
            var Dates = $('#message').find('.event-header__event-date').html();
            var Venu = $.trim($('#message').find('.event-header__event-location span').html());
            Venu = $.trim(Venu.split(',')[0]);
            var querys = $('#message').html();

            chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
                str = tabs[0].url;
                t1 = str.indexOf("ticketmaster");
                t2 = str.indexOf("livenation");
                if (t1 > 0 || t2 > 0) {

                    var Qurl = "https://www.stubhub.com/shape/search/catalog/events/v3?shstore=1&status=active |contingent&start=0&rows=200&spellCheck=true&includeNonEventEntities=false&geoExpansion=false&boostByCategory=true&lang=true&q=" + Title + "&edgeControlEnabled=true&sort=distance asc,eventDateLocal asc&reRankBy=relevance&excludeFromRadius=false&fieldList=id,ticketInfo,name,eventDateLocal,categories,groupings,performers,venue,eventInfoUrl,displayAttributes,notificationAttributes,urgencyMessage&improvedRelevancy=true&_=1562152449963";
                    console.log(Qurl);
                    $http.get(Qurl)
                        .then(function(response) {

                            var AllDATA = response.data.events;
                            console.log(Venu);
                            for (var i = 0; i < AllDATA.length; i++) {
                                EVENTDATE1 = new Date(NEWJSON.seoEventDate + '-0400');
                                EVENTDATE2 = new Date(AllDATA[i].eventDateLocal);
                                EVENTDATE1 = EVENTDATE1.getTime();
                                EVENTDATE2 = EVENTDATE2.getTime();
                                if (EVENTDATE1 == EVENTDATE2) {
                                    TabEventID('https://www.stubhub.com/' + AllDATA[i].webURI);

                                }
                            }
                        })
                } else {
                    $('#message').html("");
                }
            })
        }
    });





    function TabEventID(url) {
        str = url;
        result = str.split("/");
        console.log(result);
        var indexdata = result.indexOf("event");
        $scope.eventID = (result[(indexdata + 1)]);
        ID = $scope.eventID;
        urldV = 'https://www.stubhub.com/shape/search/inventory/v2/seller/listings?shstore=1&eventId=' + ID + '&sort=currentprice%20asc&start=0&rows=2000000&sectionStats=true&zoneStats=false&pricingSummary=false&deliveryTypeSummary=false&listingAttributeCategorySummary=false&quantitySummary=false&priceType=listingPrice&allSectionZoneStats=true&'
        $scope.loadershow = 1
            //$scope.urlapi= urldV;
        $http.get(urldV)
            .then(function(response) {

                $scope.ActiveDataShow = 1;
                $scope.ActiveData = (response.data);
                $scope.loadershow = 0;

            }, function(response) {
                $scope.ActiveData1 = (response.data);
                $scope.loadershow = 0;
            })

        $scope.hidden = "hidden";
        /*--------------Open in New Tab----------------*/
        $scope.loginurl = 'https://www.stubhub.com/my/profile';
        $scope.OpenNewTab = function(p) {
            chrome.tabs.create({ url: p });
        };
        /*--------------Open in New Tab----------------*/
        $scope.opencounter = function() {

            urldV = 'https://www.stubhub.com/shape/search/inventory/v2/seller/listings?shstore=1&eventId=' + ID + '&sort=currentprice%20asc&start=0&rows=2000000&sectionStats=true&zoneStats=false&pricingSummary=false&deliveryTypeSummary=false&listingAttributeCategorySummary=false&quantitySummary=false&priceType=listingPrice&allSectionZoneStats=true&'
            $scope.loadershow = 1
                //$scope.urlapi= urldV;
            $http.get(urldV)
                .then(function(response) {

                    $scope.ActiveDataShow = 1;
                    $scope.ActiveData = (response.data);
                    $scope.loadershow = 0;
                    $scope.SoldDataShow = 0;

                })
        }
        $scope.SouldData = function() {

            urldV = 'https://www.stubhub.com/shape/accountmanagement/sales/v1/event/' + ID + '?eventId=' + ID + '&start=0&rows=200000000&sort=PRICE%20Asc&priceType=listprice&&shstore=1';
            $scope.loadershow = 1
            $http.get(urldV).then(function(response) {
                $scope.ActiveDataShow = 0;
                $scope.SoldDataShow = 1;
                $scope.SoldData = (response.data.sales.sale);
                $scope.loadershow = 0;

            })
        }
    };



    /*-----------------------------Tracking Start-----------------------*/

    /*-----------------------------Tracking Start-----------------------*/
    /*-----------------------------Tracking Stop-----------------------*/

    /*-----------------------------Tracking Stop-----------------------*/

    $scope.urlapi = $scope.admin;
    chrome.storage.sync.get(['Api'], function(result) {
        $("#dataAPI").val(result.Api)
        $scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.Api + "&apitype=4&exid=" + chrome.runtime.id + "&type=chkkey";

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

    });


    $scope.deleteApi = function() {
        $scope.loadershowfirst = 1;
        $scope.urlapi = $scope.admin;
        chrome.storage.sync.get(['Api'], function(result) {
            $("#dataAPI").val(result.Api)
            $scope.urlapi += "?action=my_delete_Api_action&Api=" + result.Api + "&apitype=4&exid=" + chrome.runtime.id;
            $http.get($scope.urlapi)
                .then(function(response) {
                    $scope.Apivalid = false;
                    $scope.loadershowfirst = 0;
                });

        });



    }

    $scope.saveApi = function() {
        value = $("#dataAPI").val();
        $scope.loadershowfirst = 1;
        chrome.storage.sync.set({
            Api: value
        }, function() {
            $scope.urlapi = $scope.admin;
            //$scope.urlapi = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
            chrome.storage.sync.get(['Api'], function(result) {

                $scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.Api + "&exid=" + chrome.runtime.id + "&type=upkey&apitype=4";


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

            });
        });
    }






    $scope.propertyName = 'count';
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };




});




function onWindowLoad() {

    var message = document.querySelector('#message');
    chrome.tabs.executeScript(null, {
        file: "getPagesSource.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {

            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });
}



window.onload = onWindowLoad;