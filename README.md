# automart
[![Build Status](https://travis-ci.org/ola357/automart.svg?branch=develop)](https://travis-ci.org/ola357/automart) [![Coverage Status](https://coveralls.io/repos/github/ola357/automart/badge.svg?branch=develop)](https://coveralls.io/github/ola357/automart?branch=develop)

Auto Mart is an online marketplace for automobiles of diverse makes, model or body type.

## Deployed on heroku
[https://olaoluwa-automart.herokuapp.com](https://olaoluwa-automart.herokuapp.com)

## Base URL
[https://olaoluwa-automart.herokuapp.com/api/v1](https://olaoluwa-automart.herokuapp.com/api/v1)

## Branch Deployed on heroku for autograder
* ch-autogradr-167307331

## Documentation on Swagger
[https://olaoluwa-automart.herokuapp.com/api-docs](https://olaoluwa-automart.herokuapp.com/api-docs)

## Endpoints for Available for autograder on Heroku
User sign up
* POST: /auth/signup
User sign in
* POST: /auth/signin
User(Seller) create a car ad (Authentication Needed)
* POST: /car
User(Seller) edit car ad status (Authentication Needed)
* PATCH: /car/:car_id/status
User(Seller) edit car ad price (Authentication Needed)
* PATCH: /car/:car_id/price
User can get all car ads (Authentication Needed)
* GET: /car
User can get a specific car ad (Authentication Needed)
* GET: /car/:car_id
User(Buyer) can create a purchase order (Authentication Needed)
* POST: /order
User(Buyer) can edit a purchase order (Authentication Needed)
* PATCH: /order/:order_id/price
User(Admin) can delete a car ad (Authentication and Authorization Needed)
* DELETE: /car/:car_id

## Features
* User can sign up
* User can sign in
* User(seller) can post a car sale advertisement
* User(buyer) can make a purchase order
* User (buyer) can update the price of his/her purchase order
* User (seller) can mark his/her posted AD as sold.
* User (seller) can update the price of his/her posted AD.
* User can view a specific car.
* User can view all unsold cars.
* User can view all unsold cars within a price range.
* User can view all cars of a specific body type.
* Admin can delete a posted AD record.
Admin can view all posted ads whether sold or unsold.

## Technologies used
This application makes use of latest technologies and is developed with Nodejs. 
* Express
* Javascript (ES6)
* Mocha and Chai for testing
* ESlint (using airbnb style guide)
* Babel 
* Swagger for documentation

## Installation

```
git clone https://github.com/ola357/automart.git
```
* Open in favourite editor
* In the project directory, run 
```
	npm install
```
* Create a postgres database and run the models
* Set up .env variables
* Testing, run 
```
	npm test
```
* Run: npm start to lauch app


## Contributing
* Fork project and raise a Pull Request

