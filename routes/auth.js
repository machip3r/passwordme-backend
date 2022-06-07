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
  const { error } = schemaRegister.validate(request.body);
  const existentUser = await User.findOne({
    username: request.body.username,
  });
  const existentEmail = await User.findOne({
    email: request.body.email,
  });

  if (error)
    return result.status(400).json({ error: error.details[0].message });
  if (existentUser)
    return result.status(400).json({
      error: "Username unavailable",
    });
  if (existentEmail)
    return result.status(400).json({
      error: "Email unavailable",
    });

  let encryptedPassword = encrypt(request.body.password);

  const userData = new User({
    username: request.body.username,
    email: request.body.email,
    password: encryptedPassword,
  });

  try {
    const userSaved = await userData.save();

    const passwordsData = new Passwords({
      id_user: userSaved._id,
      passwords: [],
    });

    await passwordsData.save();

    result.json({
      error: null,
      data: userSaved,
    });
  } catch (error) {
    result.status(400).json({ error });
  }
});

router.post("/login", async (request, result) => {
  const { error } = schemaLogin.validate(request.body);
  const existentUser = await User.findOne({
    username: request.body.username,
  });

  if (error)
    return result.status(400).json({ error: error.details[0].message });
  if (!existentUser)
    return result.status(400).json({
      error: "Incorrect username",
    });

  let decryptedPassword = decrypt(existentUser.password);

  if (decryptedPassword != request.body.password)
    return result.status(400).json({
      error: "Incorrect password",
    });

  const token = jwt.sign(
    {
      id: existentUser._id,
      username: existentUser.username,
    },
    process.env.SECRET_TOKEN
  );

  result.header("AuthToken", token).json({
    error: null,
    data: { token },
  });
  try {
  } catch (error) {
    result.status(400).json({ error });
  }
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
