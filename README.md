# README

## Cover and Cart

![img-01]()
![img-02]()
![img-03]()
![img-04]()

## Feature

### User
* Login, logout and sign up
* Read all items and their detail information
* Categorize items when reading all items
* Give comments to items
* Collect favorite items
* Look the newest 10 items
* Look the newest 10 comments
* Edit the own profile
* Check items which the user gave comments
* Can follow others
* Can add items to his cart
* Can draw discount coupons
* Can pay by using linePay

### Admin
* Only admin can use management system
* Can manage the information of items 
* Can manage the category of items 
* Can manage the administrative permission of users 
* Can create, update, delete coupons

## Initialize

```
git clone https://github.com/Chris-Chou518/shopping.git
```

### Set up database
We can refer config/config.json

```
create database shopping;
```

### Install
```
npm install
```

### create .env and set parameters 
```
touch .env
```

### Execute migration
```
npx sequelize db:migrate
```

### Run seed
```
npx sequelize db:seed:all  
```

### Execute application
```
npm run dev
```
App is listening on port 3000

## Default account

* First account wit administration：
  * email: root@example.com
  * password: 12345678
* The other accounts without administration：
  * email: user1@example.com
  * password: 12345678

  * email: user2@example.com
  * password: 12345678

### Prerequisites
  * Node: 14.16.0
  * Express: 4.18.2
  * Express-handlebars: 5.3.3
  * Sequelize: 6.30.0
  ...
Please refer package.json file for the other prerequisites. Thank you!