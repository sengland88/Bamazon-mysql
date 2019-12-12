const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
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
  console.log("Welcome to Bamazon! Below are the items we have for sale.");
  runProgram();
});

function runProgram() {
  connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
    if (err) throw err;
    console.table(res);

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
          message: "Please select the item you'd like to purchase"
        },
        {
          type: "input",
          name: "amount",
          message: "How many would you like to purchase?",
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

        if (chosenItem.stock_quantity >= parseInt(data.amount)) {
          let newQuanity = chosenItem.stock_quantity - parseInt(data.amount);

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuanity
              },
              {
                product_name: chosenItem.product_name
              }
            ],
            function(error) {
              if (error) throw err;

              if (parseInt(data.amount) > 1) {
                console.log(
                  `You just purchased ${data.amount} ${
                    chosenItem.product_name
                  }s for $${parseInt(data.amount) *
                    parseInt(chosenItem.price)}!`
                );
              } else {
                console.log(
                  `You just purchased ${data.amount} ${
                    chosenItem.product_name
                  } for $${parseInt(data.amount) * parseInt(chosenItem.price)}!`
                );
              }
              restart();
            }
          );
        }

        if (chosenItem.stock_quantity < parseInt(data.amount)) {
          console.log("Insufficient Amount — Unable to fulfill request");
          console.log(
            `Currently, we only have ${chosenItem.stock_quantity} in stock.`
          );
          inquirer
            .prompt([
              {
                type: "confirm",
                message: "Would you like to purchase the remaining stock?",
                name: "confirm"
              }
            ])
            .then(function(data) {
              if (data.confirm) {
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: 0
                    },
                    {
                      product_name: chosenItem.product_name
                    }
                  ],
                  function(error) {
                    if (error) throw err;

                    let plural = parseInt(data.amount) > 1 ? "s" : "";

                    if (parseInt(data.amount) > 1) {
                      console.log(
                        `You just purchased ${data.amount} ${
                          chosenItem.product_name
                        }${plural} for $${parseInt(data.amount) *
                          parseInt(chosenItem.price)}!`
                      );
                    }
                    restart();
                  }
                );
              }
            });
        }
      })
      .catch(function(error) {
        console.log("!!!!!!!!!!!!!!!!!!!!!");
        console.log(error);
        console.log("!!!!!!!!!!!!!!!!!!!!!");
        console.log("\n Looks like we've encounter an issue.");
        restart();
      });
  }); // connection end bracket
}

function restart() {
  console.log("\n\n");

  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to make another purchase?",
        name: "confirm",
        default: true
      }
    ])
    .then(function(response) {
      if (response.confirm) {
        runProgram();
      } else {
        connection.end();
      }
    });
}