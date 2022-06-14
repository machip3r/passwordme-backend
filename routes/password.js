const router = require("express").Router();

const Passwords = require("../model/Passwords.js");
const Category = require("../model/Category.js");

const ClearbitLogo = require("clearbit-logo");

router.get("/", async (request, result) => {
  let passwords = await Passwords.findOne({
      id_user: request.user.id,
    }),
    categories = await Category.find({
      id_user: request.user.id,
    });

  result.json({
    error: null,
    data: {
      categories: categories,
      passwords: passwords,
    },
  });
});

router.post("/addPassword", async (request, result) => {
  let logo = new ClearbitLogo(),
    passwordsList = request.body;

  let passwords = await Passwords.findOne({
    id_user: passwordsList.id_user,
  });

  if (passwordsList.passwordArray.url != "")
    passwordsList.passwordArray.urlLogo = await logo.image(
      passwordsList.passwordArray.url,
      { size: 100 }
    );

  await Passwords.updateOne(
    { id_user: passwordsList.id_user },
    { $push: { list: passwordsList.passwordArray } }
  );

  const message = "OK";

  result.json({
    error: null,
    data: { message },
  });
});

module.exports = router;
