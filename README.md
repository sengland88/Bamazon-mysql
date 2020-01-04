# Bamazon-mysql

<h2>Project Name</h2>

Bamazon — for Customers and Managers

<h2>Concept</h2>

Bamazon is a node.js application that utilizes mySQL to display product to a user. Depending on which file you run — either app or manager — you can either purchase or control the inventory.

<h2>Project Overview</h2>

Created with node.js, Bamazon is an application that utilizes mySQL and several NPM packages to collect information on various inquirers. Inquirers can include, depending on the file the user is running, purchasing a product (app.js — customer view) or inventory control (manager.js — manager) To make for a better user experience, I opted to provide the user with a list to scroll through rather than making a numerical selection. NPM packages used are inquirer and mysql.

<h2>Process</h2>

<h3>Customer (app.js)</h3>

Once the app is ran, a welcome message is displayed and then the products. I console.table the response. I also do a for loop on the response to create a raw list for the user to select from (rather than inputting an item number). Once the the user makes a selection, it will ask the quantity.

If the quantity is larger than the quantity request, it will allow it and update the mysql database. However, if the request quantity is larger than the current stock, it will alert the user that the request amount exceeds current stock but then ask them if they'd like to purchase the remaining stock. 

Once the purchase it completed, the user will get a receipt with the total what they purchased. 

A restart run function will then be triggered and ask the user if they'd like to make another purchase.

<h3>Manager (manager.js)</h3>

Once the app is ran, it will ask the user for their name, which will then be used to display a personalized message, welcoming them to the app. 

The app will ask the user what they would like to do:

- View Products for Sale
- View Low Inventory
- Add Inventory
- Add New Product
- Sign Out

This utilizes a switch statement to handle what the user inputs and triggers a function with the appropriate action. 

- If the user selects "view products for sale," the app will display all products with a stock quantity greater than zero and then ask the user once again what they would like to do via running the main function (with the switch statement)

- If the user selects "low inventory," the app will display all products with a stock quantity less than 25. The user will be asked if they would like to add inventory to the system, go back to the main menu or sign out. If the user opts to add inventory, it will ask run the addinventory function (that is a part of the original switch statement). If not, the user will be able to return to the main menu or sign out of the system. 

- If the user selects "add inventory," they will be asked to select the item they would like to add inventory to and then also to provide a quantity. If the product was added successfully, the user will be notified and then asked what they would like to do once again. 

- If the user selects "add new product," they will be asked for the product name, department number and the price of the product. Please note that there is not currently any validation to check to see if a product already exists. If the product name already exists, it alerts the user that it already exists and informs them they will need to update the inventory quantity instead. It will then ask them if they would like to do that, return to main menu or sign out.

- If the user selects "sign out," they will execute the connection server.

<h2>URL</h2>
Please note that because this application is a command line application, I have provided a link to video demostrations. 
http://bit.ly/39HinTh
