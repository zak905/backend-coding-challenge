"use strict";

/******************************************************************************************

Expenses controller

******************************************************************************************/

var app = angular.module("expenses.controller", []);

app.controller("ctrlExpenses", ["$rootScope", "$scope", "config", "restalchemy", function ExpensesCtrl($rootScope, $scope, $config, $restalchemy) {
	// Update the headings
	$rootScope.mainTitle = "Expenses";
	$rootScope.mainHeading = "Expenses";

	// Update the tab sections
	$rootScope.selectTabSection("expenses", 0);

	var restExpenses = $restalchemy.init({ root: $config.apiroot }).at("expenses");

	$scope.dateOptions = {
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd/mm/yy"
	};

	$scope.currencies = ["GBP", "EUR"];

	$scope.currency = $scope.currencies[0];

	$scope.displayCurrency = $scope.currencies[0];

	var loadExpenses = function() {
		// Retrieve a list of expenses via REST
		restExpenses.get({currency: $scope.displayCurrency}).then(function(expenses) {
			$scope.expenses = expenses;
		});

	}

	$scope.saveExpense = function() {
		if ($scope.expensesform.$valid) {
			// Post the expense via REST
			restExpenses.post($scope.newExpense, {currency: $scope.currency}).then(function() {
				// Reload new expenses list
				loadExpenses();
			});
		}
	};

	$scope.clearExpense = function() {
		$scope.newExpense = {};
	};

	$scope.currencyChanged = function() {
		loadExpenses();
	};

	$scope.updateVat = function() {
		$scope.newExpense.vat = parseFloat(Number($scope.newExpense.amount) * 0.2).toFixed(2) ;
	};

	$scope.getCurrencySymbol = function() {
		switch($scope.displayCurrency) {
		  case "GBP":
		  return "£";
		  	break;
		  case "EUR":
		  return "€";
		  break;
		  
		}
	};


	// Initialise scope variables
	loadExpenses();
	$scope.clearExpense();
}]);
