const User = require('../users/user-model')

async function checkUsernameFree(req, res, next) {

    const user = await User.findBy({username: req.body.username})

    if (user.length === 1) {
      next({ status: 422, message: "username taken" });
    } else {
      next();
    }
  }

async function checkUsernameExists(req, res, next) {

    const user = await User.findBy({username: req.body.username})

    console.log(user);

    if (user.length === 1) {
        next();
    } else {
        next({ status: 422, message: "invalid credentials" });
    }
  }

function validateData(req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        next({ status: 400, message: 'username and password required' })
    } return next()
}

module.exports = {
    checkUsernameExists,
    checkUsernameFree,
    validateData
}