var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");


router.get("/singlerecipe", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.query.recipeid);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRandomDetails(req.query.amount);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


router.get("/listofrecipes", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getlistRecipesDetails(req.query.ids);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


router.get("/search", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getSearchedRecipesDetails(req.query.query, req.query.limit, req.query.cuisine ,
       req.query.diet, req.query.intolerances );
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
