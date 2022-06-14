const router = require("express").Router();

const Passwords = require("../model/Passwords.js");

const crypto = require("crypto-js");
const ClearbitLogo = require("clearbit-logo");

router.get("/:id_user", async (request, result) => {
  let passwords = await Passwords.findOne({
    id_user: request.params.id_user,
  });

  result.json({
    error: null,
    data: {
      passwords: passwords == null ? null : passwords.list,
    },
  });
});

router.post("/addPassword", async (request, result) => {
  let logo = new ClearbitLogo(),
    passwordsList = request.body,
    theresStructure = await Passwords.findOne({
      id_user: passwordsList.id_user,
    });

  if (theresStructure == null) {
    let passwordsInitData = new Passwords({
      id_user: passwordsList.id_user,
      passwords: [],
    });

    await passwordsInitData.save();
  }

  let repeatedTitle = await Passwords.findOne({
    id_user: passwordsList.id_user,
    "list.title": passwordsList.passwordArray.title,
  });

  if (repeatedTitle)
    return result.status(400).json({
      error: "Ese contraseña ya existe, prueba con otro título",
    });

  if (passwordsList.passwordArray.url != "")
    passwordsList.passwordArray.urlLogo = await logo.image(
      passwordsList.passwordArray.url,
      { size: 500 }
    );

  if (
    passwordsList.passwordArray.urlLogo == "" ||
    passwordsList.passwordArray.urlLogo == null
  )
    passwordsList.passwordArray.urlLogo =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Grey_close_x.svg/1024px-Grey_close_x.svg.png";

  passwordsList.passwordArray.password = encrypt(
    passwordsList.passwordArray.password
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

router.post("/editPassword", async (request, result) => {
  let logo = new ClearbitLogo(),
    passwordsList = request.body;

  if (passwordsList.newPassword.url != "")
    passwordsList.newPassword.urlLogo = await logo.image(
      passwordsList.newPassword.url,
      { size: 500 }
    );

  if (
    passwordsList.newPassword.urlLogo == "" ||
    passwordsList.newPassword.urlLogo == null
  )
    passwordsList.newPassword.urlLogo =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Grey_close_x.svg/1024px-Grey_close_x.svg.png";

  passwordsList.newPassword.password = encrypt(
    passwordsList.newPassword.password
  );

  await Passwords.updateOne(
    {
      id_user: passwordsList.id_user,
      "list._id": passwordsList.newPassword._id,
    },
    {
      $set: {
        "list.$.id_category": passwordsList.newPassword.id_category,
        "list.$.title": passwordsList.newPassword.title,
        "list.$.username": passwordsList.newPassword.username,
        "list.$.email": passwordsList.newPassword.email,
        "list.$.password": passwordsList.newPassword.password,
        "list.$.notes": passwordsList.newPassword.notes,
        "list.$.url": passwordsList.newPassword.url,
        "list.$.urlLogo": passwordsList.newPassword.urlLogo,
        "list.$.date": passwordsList.newPassword.date,
      },
    }
  );

  const message = "OK";

  result.json({
    error: null,
    data: { message },
  });
});

router.post("/deletePassword", async (request, result) => {
  await Passwords.updateOne(
    { id_user: request.body.id_user },
    { $pull: { list: { _id: request.body.id_password } } }
  );

  const message = "OK";

  result.json({
    error: null,
    data: { message },
  });
});

router.post("/encryptPassword", async (request, result) => {
  let encryptedPassword = encrypt(request.body.password);

  result.json({
    error: null,
    data: { encryptedPassword },
  });
});

router.post("/decryptPassword", async (request, result) => {
  let decryptedPassword = decrypt(request.body.password);

  result.json({
    error: null,
    data: { decryptedPassword },
  });
});

const encrypt = (text) => {
  return crypto.AES.encrypt(text, process.env.SECRET_TOKEN).toString();
};

const decrypt = (ciphertext) => {
  return crypto.AES.decrypt(ciphertext, process.env.SECRET_TOKEN).toString(
    crypto.enc.Utf8
  );
};

module.exports = router;
