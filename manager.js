const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');

var userName;
var connection;
 

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "Please enter your name:"
    }
  ])
  .then(function(data) {
    userName = data.name;

    connection = mysql.createConnection({
      host: "localhost",

      // Your port; if not 3306
      port: 3306,

      // Your username
      user: "root",

      // Your password
      password: "@Root11",
      database: "bamazon"
    });

    connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
      console.log("\n")
      console.log(
        `Hello ${userName}! Welcome to the Bamazon Product Management System`);
      console.log("\n")
      runProgram();
    });
  });

  function createTable(res) {

    var table = new Table({
      head: ['Item', 'Product', 'Department', 'Price', 'Stock']
    , colWidths: [30, 30, 30, 30, 30]
    });
  
    for (let i = 0; i < res.length; i++ ) {
      table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
    }   
    console.log(table.toString())  
  }

function runProgram() {
  inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add Inventory",
          "Add New Product",
          "Sign out"
        ]
      }
    ])
    .then(function(data) {
      switch (data.choice) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add Inventory":
          addInventory();
          break;
        case "Add New Product":
          addProducts();
          break;
        case "Sign out":
          connection.end();
          break;
        default:
          console.log(
            "Im sorry — I do not recognize that command; please try again"
          );
          runProgram();
          break;
      }
    });
}

function viewProducts() {
  connection.query("SELECT * FROM products WHERE stock_quantity > 0 ", function(err,res) {
    if (err) throw err;

    createTable(res)

    console.log("\n");
    runProgram();
  }); // connection end brackets
}

function lowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 25 ", function(err,res) {
    if (err) throw err;

    console.log("Here are all the items that have a quantity of 25 or less.")
    console.log("\n");
    createTable(res)
    console.log("\n");

    inquirer
      .prompt([
        {
          name: "choice",
          type: "list",
          message: "What would you like to do?",
          choices: ["Add Inventory", "Go Back to Main Menu", "Sign out"]
        }
      ])
      .then(function(data) {
        switch (data.choice) {
          case "Add Inventory":
            addInventory();
            break;
          case "Go Back to Main Menu":
            runProgram();
            break;
          case "Sign out":
            connection.end();
            break;
          default:
            console.log(
              "Im sorry — I do not recognize that command; please try again"
            );
            runProgram();
            break;
        }
      });
  }); // connection end brackets
}

function addInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    createTable(res)

    var resArray = [];

    for (var i = 0; i < res.length; i++) {
      resArray.push(res[i].product_name);
    }

    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: resArray,
          message: "Which item would you like to add inventory to?"
        },
        {
          type: "input",
          name: "amount",
          message: "Please enter a quantity?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              console.log("\n\nPlease enter a number\n\n");
              return false;
            }
          }
        }
      ])
      .then(function(data) {
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === data.choice) {
            chosenItem = res[i];
          }
        }

        let amount =
          parseInt(data.amount) + parseInt(chosenItem.stock_quantity);

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: amount
            },
            {
              product_name: data.choice
            }
          ],
          function(error) {
            if (error) throw err;
            console.log("Product Updated!");
            console.log("\n");
            runProgram();
          }
        );
      }); // inquirer end bracket
  }); // connection end bracket
}

function addProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "item",
          message: "What is the name of your product?"
        },
        {
          type: "input",
          name: "department",
          message: "Which department does it belong to?"
        },
        {
          type: "input",
          name: "price",
          message: "What is the price of the product?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input",
          name: "quantity",
          message: "How many of the product did we receive?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input",
          name: "number",
          message: "Please create an unique item number?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            } else {
              return false;
            }
          }
        },
      ])
      .then(function(data) {   

        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === data.item || res[i].item_id === parseInt(data.number)) {

            if (res[i].product_name === data.item) {
              console.log("Product Already Exists")
              console.log("You will need to update the quantity instead")
            }

            if (res[i].item_id === parseInt(data.number)) {
              console.log("Unique item id already exists. Please start over.")
              addProducts()
              return
            }

            inquirer
            .prompt([
              {
                name: "choice",
                type: "list",
                message: "What would you like to do?",
                choices: ["Add Inventory", "Go Back to Main Menu", "Sign out"]
              }
            ])
            .then(function(data) {
              switch (data.choice) {
                case "Add Inventory":
                  addInventory();
                  break;
                case "Go Back to Main Menu":
                  runProgram();
                  break;
                case "Sign out":
                  connection.end();
                  break;
                default:
                  console.log(
                    "Im sorry — I do not recognize that command; please try again"
                  );
                  runProgram();
                  break;
              }
            });
            return
          }
        }

        console.log("Inserting a new product...\n");
        var query = connection.query(
          "INSERT INTO products SET ?",
          {
            item_id: data.number,
            product_name: data.item,
            department_name: data.department,
            price: data.price,
            stock_quantity: data.quantity
          },
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");

            console.log("Selecting all products...\n");
            connection.query("SELECT * FROM products", function(err, res) {
              if (err) throw err;
              createTable(res)
              runProgram();
            });
          }
        );
      });
  }); // connection end bracket
}