const router = require("express").Router();

const Passwords = require("../model/Passwords.js");
const Category = require("../model/Category.js");

router.get("/:id_user", async (request, result) => {
  try {
    let categoriesObject = await Category.find({
      id_user: request.params.id_user,
    });

    result.json({
      error: null,
      data: { categoriesObject },
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
  let oldListPasswords = await Passwords.find({
    "list.id_category": request.body.category,
  });

  if (typeof oldListPasswords[0] !== "undefined") {
    oldListPasswords[0].list.forEach(
      (element) =>
        (element.id_category = element.id_category.filter(
          (value) => value !== request.body.category
        ))
    );

    await Passwords.updateOne(
      { id_user: request.body.id_user },
      {
        list: oldListPasswords[0].list,
      }
    );
  }

  await Category.deleteOne({ _id: request.body.id_category });

  result.json({
    error: null,
    data: {},
  });
});

module.exports = router;
