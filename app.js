(function () {
	'use strict';

	angular.module('NarrowItDownApp', [])
	       .controller('NarrowItDownController', NarrowItDownController)
	       .service('MenuSearchService', MenuSearchService)
	       .directive('foundItems', FoundItemsDirective);

	function FoundItemsDirective() {
		var ddo = {
			restrict: 'E',
			templateUrl: 'foundItems.html',
			scope: {
				foundItems: '<',
				onRemove: '&',
				searched: '<'
			}
		};

		return ddo;
	}

	NarrowItDownController.$inject = ['MenuSearchService'];

	function NarrowItDownController(MenuSearchService) {
		var ctrl = this;

		ctrl.searchTerm = "";
		ctrl.found = [];
		ctrl.searched = false;

		ctrl.searchMenu = function() {
			ctrl.searched = true;
			if (ctrl.searchTerm.trim() != "") {
				MenuSearchService.getMatchedMenuItems(ctrl.searchTerm.toLowerCase())
				.then(function(response) {
					ctrl.found = response;
				});
			} else {
				ctrl.found = [];
			}
		}

		ctrl.removeItem = function(itemIndex) {
			ctrl.found.splice(itemIndex, 1);
		}
	}

	MenuSearchService.$inject = ['$http'];

	function MenuSearchService($http) {
		var service = this;

		service.getMatchedMenuItems = function(searchTerm) {
			return $http({
				method: "GET",
				url: ("https://davids-restaurant.herokuapp.com/menu_items.json")
			})
			.then(function (result) {
			    // process result and only keep items that match
			    var foundItems = [];
			    for (var i = 0; i < result.data.menu_items.length; i++) {
			    	if (result.data.menu_items[i].description.indexOf(searchTerm) > -1) {
			    		foundItems.push(result.data.menu_items[i]);
			    	}
			    }
			    console.log("Found items: " + foundItems.length);
			    // return processed items
			    return foundItems;
			})
			.catch(function (error) {
		      console.log(error);
		    });
		}
	}

}) ();
