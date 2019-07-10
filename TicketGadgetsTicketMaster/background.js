var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $interval, $http) {
    $scope.tabclass1 = true;
    $scope.tabclass2 = false;
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function(tabs) {
        str = tabs[0].url;
        //alert(str);
        $scope.LockedShow = 1;
        n = str.indexOf("ticketmaster");
        n1 = str.indexOf("livenation");
        if (n > 0 || n1 > 0) {
            $scope.LockedShow = 0;
        }
    });
    $scope.admin = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
    var CurrentUrl = "";
    $scope.fabCounter = 0;
    $scope.fromdate = "";
    $scope.todate = "";
    $scope.loadershowfirst = 1;
    $scope.isFavourite = 0;
    $scope.opencounter = function() {
        $scope.tabclass1 = true;
        $scope.tabclass2 = false;
    }

    $scope.Favourites = function() {
        $scope.fabCounter = 0;
        $scope.tabclass1 = false;
        $scope.tabclass2 = true;
        chrome.storage.sync.get(['Api'], function(result) {
            //alert(result.Api);
            $scope.urlapi = $scope.admin + "?action=GetFavourites&Api=" + result.Api;
            $http.get($scope.urlapi)
                .then(function(response) {
                    $scope.allfavouritesevent = (response);
                    $scope.loadershowfirst = 0;
                })
        });
    }
    $scope.OpendataCounter = function(Key, Eid) {
        rundatepicker();
        $scope.apiKeys = Key;
        $scope.EventIds = Eid;
        $scope.fabCounter = 1;
        $scope.getdataFatchAllCounter = function() {
            $scope.loadershowfirst = 1;
            from = $('#from').val();
            to = $('#to').val();
            $scope.urlapi = $scope.admin + "?action=GetCronJobData&Api=" + Key + "&EventID=" + Eid + "&From=" + from + "&To=" + to;
            $http.get($scope.urlapi)
                .then(function(response) {
                    $scope.OpendataCounterData = (response.data);
                    $scope.loadershowfirst = 0;
                    $scope.loadershowfirst = 0;
                })
        }
    }
    $scope.openFullData = function(id) {
            //alert(id);
        }
        /*-----------------------------Tracking Start-----------------------*/
    $scope.timer = {};
    $scope.startcounter = function(api, event, t) {
            $scope.loadershowfirst = 1;
            $scope.urlapi = $scope.admin + "?action=CounterSet&Api=" + api + "&EventID=" + event + "&Time=" + $scope.timer[t];
            $http.get($scope.urlapi)
                .then(function(response) {
                    if (response.data == 1) {
                        alert("Please Select Valid Counter Time");
                        $scope.Favourites();
                    } else {
                        $scope.Favourites();
                    }
                })
        }
        /*-----------------------------Tracking Start-----------------------*/
        /*-----------------------------Tracking Stop-----------------------*/
    $scope.stopecounter = function(api, event) {
            $scope.loadershowfirst = 1;
            if (confirm("Are you sure you want to delete it , by pressing 'ok button' all the data will be lost for this event")) {
                $scope.urlapi = $scope.admin + "?action=UnCounterSet&Api=" + api + "&EventID=" + event;
                $http.get($scope.urlapi)
                    .then(function(response) {
                        $scope.Favourites();
                    })
            } else {
                $scope.Favourites();
            }
        }
        /*-----------------------------Tracking Stop-----------------------*/
    $scope.urlapi = $scope.admin;
    chrome.storage.sync.get(['Api'], function(result) {
        $("#dataAPI").val(result.Api)
        $scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.Api + "&apitype=1&exid=" + chrome.runtime.id + "&type=chkkey";
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
            $scope.urlapi += "?action=my_delete_Api_action&Api=" + result.Api + "&apitype=1&exid=" + chrome.runtime.id;
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
                $scope.urlapi += "?action=Ticketmaster_Api&Api=" + result.Api + "&exid=" + chrome.runtime.id + "&type=upkey&apitype=1";
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
                //alert('Value currently is ' + result.Api);
            });
        });
    }
    $scope.setFavourites = function(type, i) {
        $scope.loadershow = 1;
        $scope.isFavourite = 0;
        if ($scope.eventID == undefined) {
            EVENTID = $('#eventID').val();
        } else {
            EVENTID = $scope.eventID;
        }
        if (type == 'check') {
            chrome.storage.sync.get(['Api'], function(result) {
                $scope.urlapi = $scope.admin;
                $scope.urlapi += "?action=set_favourites&Api=" + result.Api + "&apitype=1&eventid=" + EVENTID + "&exid=" + chrome.runtime.id + "&type=check";
                $http.get($scope.urlapi)
                    .then(function(response) {
                        if (response.data == 1) {
                            $scope.isFavourite = 1;
                            $scope.loadershow = 0;
                        }
                    });
            });
        } else {
            var favtitle = btoa($('#message').html());
            var favdate = ($('#messagedate').html());
            var checkBox = document.getElementById("favCheck");
            chrome.storage.sync.get(['Api'], function(result) {
                if (i == 0) {
                    $scope.urlapi = $scope.admin;
                    chrome.storage.sync.get(['Api'], function(result) {
                        $("#dataAPI").val(result.Api);
                        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
                            CurrentUrl = btoa(tabs[0].url);
                            $scope.urlapi += "?action=set_favourites&Api=" + result.Api + "&apitype=1&eventid=" + EVENTID + "&exid=" + chrome.runtime.id + "&type=save&favdate=" + favdate + "&Etitle=" + favtitle + "&CurrentUrl=" + CurrentUrl;
                            $http.get($scope.urlapi)
                                .then(function(response) {
                                    //$scope.Apivalid = false;
                                });
                        });
                    });
                } else {
                    $scope.urlapi = $scope.admin;
                    chrome.storage.sync.get(['Api'], function(result) {
                        $("#dataAPI").val(result.Api)
                        $scope.urlapi += "?action=set_favourites&Api=" + result.Api + "&apitype=1&eventid=" + EVENTID + "&exid=" + chrome.runtime.id + "&type=unsave";
                        $http.get($scope.urlapi)
                            .then(function(response) {
                                //$scope.Apivalid = false;
                            });
                    });
                }
                $scope.isFavourite = 1;
                if (i == 1) {
                    $scope.isFavourite = 0;
                }
            });
        }
        $scope.loadershow = 0;
    }
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        var str = tabs[0].url;
        res = str.split("\/");
        if (res[res.length - 2] == "event") {
            res = res[res.length - 1].split("?")
            $scope.eventID = res[0];
            $scope.setFavourites('check');
            $scope.getSeats();
        }
    });
    $scope.propertyName = 'count';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    $scope.getSeats = function() {
        $scope.loadershow = 1;
        if ($scope.eventID == undefined) {
            EVENTID = $('#eventID').val();
        } else {
            EVENTID = $scope.eventID;
        }
        API = 'b462oi7fic6pehcdkzony5bxhe';
        APISECRET = 'pquzpfrfz7zd2ylvtz3w5dtyse';
        resaleChannelId = 'internal.ecommerce.consumer.desktop.web.browser.ticketmaster.us'
        var parameters = {
            'show': 'count+row+listpricerange+places+maxQuantity+sections+shape',
            'q': 'available',
            'apikey': API,
            'apisecret': APISECRET,
            'resaleChannelId': resaleChannelId
        }
        url = 'https://services.ticketmaster.com/api/ismds/event/' + EVENTID + '/facets?show=' + parameters['show'] + '&q=' + parameters['q'] + '&apikey=' + parameters['apikey'] + '&apisecret=' + parameters['apisecret'] + '&resaleChannelId=' + parameters['resaleChannelId'];
        chrome.storage.sync.set({
            TicketmasterApiURL: url
        }, function() {})
        $scope.Resale = 0;
        $scope.Primary = 0;
        $http.get(url)
            .then(function(response) {
                $('#loadering').find('span').toggleClass("full");
                $('#loadering').find('span').toggleClass("low");
                $scope.myWelcome = response.data;
                for (i = 0; i < response.data.facets.length; i++) {
                    if (response.data.facets[i].inventoryTypes[0] == 'resale') {
                        $scope.Resale += response.data.facets[i].count;
                    } else {
                        $scope.Primary += response.data.facets[i].count;
                    }
                }
                $scope.loadershow = 0;
            });
        $scope.eventID;
    };

    /*--------------Open in New Tab----------------*/
    $scope.OpenNewTab = function(p) {
        chrome.tabs.create({ url: p });
    };
    /*--------------Open in New Tab----------------*/

    $interval(function() {
        $('#loadering').find('span').toggleClass("full");
        $('#loadering').find('span').toggleClass("low");
        chrome.storage.sync.get(['TicketmasterApiURL'], function(result) {
            $scope.Resale = $scope.Primary = 0;
            $http.get(result.TicketmasterApiURL)
                .then(function(response) {
                    $scope.myWelcome = response.data;
                    for (i = 0; i < response.data.facets.length; i++) {
                        if (response.data.facets[i].inventoryTypes[0] == 'resale') {
                            $scope.Resale += response.data.facets[i].count;
                        } else {
                            $scope.Primary += response.data.facets[i].count;
                        }
                    }
                });
        });
    }, 30000);
});
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        console.log($('#eventID').val());
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            CurrentUrl = (tabs[0].url);
            var res = CurrentUrl.split("/");
            console.log(res);
            IDS = (res[$.inArray("event", res) + 1]);
            ID = '"id":"' + IDS + '"';
            $('#message').html($.parseHTML(request.source));
            $('#message').html($('#message').find('header'));
            html = $('#message').find('.event-header__event-date').html();
            $('#messagedate').html($.trim(html));
            html = $('#message').find('.event-header__event-name-text').html()
            $('#message').html($.trim(html));


            /*------------------------AnotherData------------------*/
            WholeDATA = request.source.split("storeUtils['eventJSONData']=");
            console.log('------------WholeData-----------------');
            //console.log(WholeDATA);
            WholeDATA = WholeDATA[1].split("storeUtils['envType']=");
            //console.log($.trim(WholeDATA[0]).slice(0,-1));
            d = $.parseJSON($.trim(WholeDATA[0]).slice(0, -1)).tickets;
            var Password = '';
            for (i = 0; i < d.length; i++) {
                Password += d[i].description + '%%' + d[i].name + '&';
            }
            var admin = "http://www.ticketgadgets.com/wp-admin/admin-ajax.php";
            $.ajax({
                    method: "POST",
                    url: admin,
                    data: { datasend: btoa(Password), ID: IDS, action: 'GetAllPassword' }
                })
                .done(function(msg) {
                    console.log(msg);
                });
            console.log(btoa(Password));
            console.log('------------WholeData-----------------');
            /*------------------------AnotherData------------------*/
            DataNew = request.source.split(ID);
            //console.log(DataNew);
            DataNewdatas = DataNew[1].split('passwordPromptId');
            //console.log(DataNewdatas[1]);
            DataName = DataNewdatas[1].split('name');
            lastEl = DataName[DataName.length - 1];
            Password = lastEl.split('"');
            //alert(Password[2]);
        });
        //console.log(request.source);
    }
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