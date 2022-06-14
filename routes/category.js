const router = require("express").Router();

const Category = require("../model/Category.js");

router.get("/:id_user", async (request, result) => {
  try {
    let categoriesObject = await Category.find({
        id_user: request.params.id_user,
      }),
      categories = [];

    categoriesObject.forEach((element) => {
      categories.push(element.category);
    });

    result.json({
      error: null,
      data: { categories },
    });
  } catch (error) {
    result.status(400).json({ error });
  }
});

router.post("/addCategory", async (request, result) => {
  let existentCategory = await Category.findOne({
    category: request.body.category,
  });

  if (existentCategory)
    return result.status(400).json({
      error: "Ya hay una categoría igual",
    });

  try {
    const categoryData = new Category({
      id_user: request.body.id_user,
      category: request.body.category,
    });

    await categoryData.save();

    const message = "OK";

    result.json({
      error: null,
      data: { message },
    });
  } catch (error) {
    result.status(400).json({ error });
  }
});

router.post("/deleteCategory", async (request, result) => {
  result.json({
    error: null,
    data: {},
  });
});

module.exports = router;
