const db = require("../../data/dbConfig");

function find() {
  return db("users");
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users").where("id", user_id).first();
}

async function add(newUser) {
  const [id] = await db("users").insert(newUser);
  return findById(id);
}

module.exports = {
  add,
  find,
  findBy,
  findById,
};
