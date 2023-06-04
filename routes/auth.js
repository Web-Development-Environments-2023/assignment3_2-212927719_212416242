var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const recipe_utils = require("./utils/recipes_utils");
const bcrypt = require("bcrypt");

/**
 * Registers a new user in the system.
 * @param {Object} req - The request object containing the user details.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.firstName - The first name of the new user.
 * @param {string} req.body.lastName - The last name of the new user.
 * @param {string} req.body.country - The country of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.confirmPassword - The confirmed password of the new user.
 * @param {string} req.body.email - The email of the new user.
 *
 */
router.post("/Register", async (req, res, next) => {
  try {
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      country: req.body.country,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      email: req.body.email,
      profilePic: req.body.profilePic
    }
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    if (user_details.username.length < 3 || user_details.username.length > 8)
      throw { status: 400, message: "username must be between 3 to 8 letters" }

    if (/^[A-Za-z]*$/.test(user_details.username))
      throw { status: 400, message: "username must be only letters" }

    if (user_details.password.length < 5 || user_details.password.length > 10)
      throw { status: 400, message: "username must be between 3 to 8 letters" }

    if (user_details.password == user_details.confirmPassword)
      throw { status: 400, message: "password and confirmPassword dont match" }
    
    if (/\d/.test(user_details.password))
      throw { status: 400, message: "password must contains at least on digit" }

    if (/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(user_details.password))
      throw { status: 400, message: "password must contains at least on special char" }
    
    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users(username, firstName, lastName, country, password, email) VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}')`
    );
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Handles a POST request to login a user.
 */
router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;


    // return cookie
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * Logs out the current user by resetting their session and sends a success message.
 */
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});



module.exports = router;