const router = require("express").Router();

const Passwords = require("../model/Passwords.js");
const Category = require("../model/Category.js");

/* const apiData = await this.axios.get("statistic/allTables/"); */

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

module.exports = router;
