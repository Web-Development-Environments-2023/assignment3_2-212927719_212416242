var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils");


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
})


router.get("/search", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getSearchedRecipesDetails(req.query.query, req.query.limit, req.query.cuisine,
      req.query.diet, req.query.intolerances);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/instructions", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeInstrctions(req.query.recipeid);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// router.get("/familyRecipes", async (req, res, next) => {
//   try {
//     // const recipes_id = await recipe_utils.getFamilyRecipes();
//     recipes_id_array = [];
//     // recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array

//     const results = await recipe_utils.getlistRecipesDetails(recipes_id_array);
//     res.status(200).send(results);
//   } catch (error) {
//     next(error);
//   }
// });


router.get('/familyRecipes', async (req, res, next) => {
  try {
    user="6"
    const recipes = await user_utils.getUserRecipes(user);
    formatedRecipes = [];
    for (const recipe of recipes) {
      formatedRecipes.push(recipes_utils.formatDBrecipe(recipe,user));
    }
    returnJson = {
      amount: recipes.length,
      recipes: formatedRecipes
    };
    res.status(200).send(returnJson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
