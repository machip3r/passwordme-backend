const router = require("express").Router();

const crypto = require("crypto-js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const User = require("../model/User.js");
const Passwords = require("../model/Passwords.js");

const schemaRegister = Joi.object({
  username: Joi.string().min(8).max(30).required(),
  email: Joi.string().min(10).max(100).required().email(),
  password: Joi.string().min(10).max(150).required(),
});
const schemaLogin = Joi.object({
  username: Joi.string().min(8).max(30).required(),
  password: Joi.string().min(5).max(150).required(),
});

router.post("/register", async (request, result) => {
  let encryptedEmail = encrypt(request.body.email),
    encryptedPassword = encrypt(request.body.password);

  const existentUser = await User.findOne({
      username: request.body.username,
    }),
    existentEmail = await User.findOne({
      email: encryptedEmail,
    }),
    { error } = schemaRegister.validate(request.body);

  if (error)
    return result.status(400).json({ error: error.details[0].message });
  if (existentUser)
    return result.status(400).json({
      error: "Usuario no disponible",
    });
  if (existentEmail)
    return result.status(400).json({
      error: "Correo electrónico no disponible",
    });

  const userData = new User({
    username: request.body.username,
    email: encryptedEmail,
    password: encryptedPassword,
  });

  try {
    const userSaved = await userData.save(),
      passwordsData = new Passwords({
        id_user: userSaved._id,
        passwords: [],
      });

    await passwordsData.save();

    let encryptedUsername = encrypt(userSaved.username);

    const token = jwt.sign(
        {
          id: userSaved._id,
          username: userSaved.username,
        },
        process.env.SECRET_TOKEN
      ),
      id_user = userSaved._id,
      username = encryptedUsername;

    result.header("AuthToken", token).json({
      error: null,
      data: { token, id_user, username },
    });
  } catch (error) {
    result.status(400).json({ error });
  }
});

router.post("/login", async (request, result) => {
  const existentUser = await User.findOne({
      username: request.body.username,
    }),
    { error } = schemaLogin.validate(request.body);

  if (error)
    return result.status(400).json({ error: error.details[0].message });
  if (!existentUser)
    return result.status(400).json({
      error: "Usuario no existe o es incorrecto",
    });

  let decryptedPassword = decrypt(existentUser.password);

  if (decryptedPassword != request.body.password)
    return result.status(400).json({
      error: "Contraseña incorrecta",
    });

  try {
    let encryptedUsername = encrypt(existentUser.username);

    const token = jwt.sign(
        {
          id: existentUser._id,
          username: encryptedUsername,
        },
        process.env.SECRET_TOKEN
      ),
      id_user = existentUser._id,
      username = encryptedUsername;

    result.header("AuthToken", token).json({
      error: null,
      data: { token, id_user, username },
    });
  } catch (error) {
    result.status(400).json({ error });
  }
});

const encrypt = (text) =>
  crypto.AES.encrypt(text, process.env.SECRET_TOKEN).toString();

const decrypt = (ciphertext) =>
  crypto.AES.decrypt(ciphertext, process.env.SECRET_TOKEN).toString(
    crypto.enc.Utf8
  );

module.exports = router;
