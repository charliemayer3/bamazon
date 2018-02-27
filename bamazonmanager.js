var mysql = require("mysql");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  port: 8889,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon"
});

function choosePath() {
	console.log("What would you like to do today?")
	inquirer.prompt([
	  {
	  	type: 'list',
  		name: 'choose',
  		message: 'Menu Options:',
  		choices: ['View Products for Sale', 'View Low Inventory', "Add to Inventory", "Add New Product"]
	  }
	]).then(function(answers) {
		console.log(answers.choose)
		if (answers.choose === "View Products for Sale") {
			showInventory()
		} else if (answers.choose === "View Low Inventory") {
			viewLowInventory()
		} else if (answers.choose === "Add to Inventory") {
			addInventory()
		} else if (answers.choose === "Add New Product") {
			addNewProduct()
		}
	})
}

function showInventory() {
	console.log("Here is the current inventory")
	connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			// console.log(res)
			console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
		console.log("-----------------------------------");
		choosePath()
	});
}

function viewLowInventory() {
	connection.query("SELECT * FROM products", function(err, res) {
		console.log("Here are the itmes which have a stock quantity below 5 units.")
		for (var i = 0; i < res.length; i++) {
			if (res[i].stock_quantity < 5) {
				console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
			}
		}
		console.log("-----------------------------------");
		inquirer.prompt([
		  {
		  	type: 'list',
	  		name: 'yesNo',
	  		message: 'Would you like to add more inventory of any of these products?',
	  		choices: ["Yes", "No"]
		  }
		]).then(function(answers) {
			if (answers.yesNo === "Yes") {
				addInventory()
			} else {
				choosePath()
			}
		})
	});
}

function addNewProduct() {
	inquirer.prompt([
	  	{
    		type: 'input',
    		name: 'product',
    		message: 'What product would you like to add?',
	  	}, {
    		type: 'input',
    		name: 'department',
    		message: 'What department would you like to add the item into?',
	  	}, {
	    	type: 'input',
	    	name: 'price',
	    	message: 'What price would you like to set for the item?',
	  	}, {
	    	type: 'input',
	    	name: 'inventory',
	    	message: 'How many units are being added to inventory?'
	  	}
	]).then(function(answers) {
		console.log("success")
		var query = connection.query(
			"INSERT INTO products SET ?",
    		{
      			product_name: answers.product,
      			department_name: answers.department,
      			price: answers.price,
      			stock_quantity: answers.inventory
    		},
		)
		console.log(answers.inventory + " units of " + answers.product + " added to the " + answers.department + " successfully.")
		choosePath()
	})
}

function addInventory() {
	var products = [];
	connection.query("SELECT * FROM products", function(err, res) {
		for (var i = 0; i < res.length; i++) {
			products.push(res[i].product_name)
		}
		inquirer.prompt([
		  {
	    	type: 'list',
	    	name: 'choose',
	    	message: 'What item would you like to add inventory to?',
	    	choices: products
		  }, {
	    	type: 'input',
	    	name: 'toAdd',
	    	message: 'What quantity would you like to add to inventory?'
		  }
		]).then(function(answers) {
			console.log("success")
			connection.query("SELECT * FROM products WHERE product_name=?", [answers.choose], function(err, res) {
				console.log(res[0].stock_quantity)
				console.log(answers.toAdd)
				console.log(answers.choose)
				var newStock = parseInt(res[0].stock_quantity) + parseInt(answers.toAdd);
				var query = connection.query(
					"UPDATE products SET ? WHERE ?",
					    [
					      	{
					        	stock_quantity: newStock
					      	},
					      	{
					        	product_name: answers.choose
					      	}
					    ]
				);
				console.log("Added " + answers.toAdd + " units " + answers.choose + " to inventory.\nNew invetory total is " + newStock)
				choosePath()
			});
		})
	});
}


choosePath()