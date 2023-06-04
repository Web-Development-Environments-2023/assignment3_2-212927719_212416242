var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");


/**
 * An asynchronous function that retrieves the details of a recipe with the given ID and sends it as a response.
 */
router.get("/singlerecipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.recipeid);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * Asynchronously retrieves a random recipe with the specified amount of details from the database.
 */
router.get("/random", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRandomDetails(req.query.amount);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * An asynchronous function that retrieves the details of a list of recipes based on their IDs.
 */
router.get("/listofrecipes", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getlistRecipesDetails(req.query.ids);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


/**
 * An asynchronous function that retrieves recipe details based on the given search parameters.
 * @param {Object} req - The request object containing the search parameters.
 * @param {string} req.query.query - The search query string.
 * @param {number} req.query.limit - The maximum number of results to return.
 * @param {string} req.query.cuisine - The cuisine type to filter by.
 * @param {string} req.query.diet - The diet type to filter by.
 * @param {string} req.query.intolerances - The intolerances to filter by.
 * @param {Object} res - The response object to send the retrieved recipe details.
 * @param {Function} next - The next middleware function
 */
router.get("/search", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getSearchedRecipesDetails(req.query.query, req.query.limit, req.query.cuisine,
      req.query.diet, req.query.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * Async function that retrieves the instructions for a recipe with the given ID and sends it as a response.
 */
router.get("/instructions", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeInstrctions(req.query.recipeid);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
