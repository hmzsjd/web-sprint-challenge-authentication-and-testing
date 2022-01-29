const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { tokenBuilder } = require("./auth-token");

const User = require("../users/user-model");

const {
  checkUsernameExists,
  checkUsernameFree,
  validateData,
} = require("../middleware/auth-middleware");

router.post("/register", validateData, checkUsernameFree, (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  User.add(user)
    .then((u) => {
      res.status(201).json({
        id: u.id,
        username: u.username,
        password: u.password,
      });
    })
    .catch(next);
});

router.post(
  "/login",
  validateData,
  checkUsernameExists,
  async (req, res, next) => {
    let { username, password } = req.body;

    User.findBy({ username })
      .then((user) => {
        if (bcrypt.compareSync(password, user[0].password)) {
          const token = tokenBuilder(user);
          res.status(200).json({
            message: `welcome, ${user[0].username}`,
            token,
          });
        } else {
          next({ status: 401, message: "invalid credentials" });
        }
      })
      .catch(next);
  }
);

module.exports = router;
