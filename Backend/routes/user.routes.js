module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../controllers/auth.js");

  var router = require("express").Router();
  var upload = require("../multer/upload.js");

  // Create a new User
  router.post("/", upload.single("file"), users.create);

  // Retrieve all User
  router.get("/", users.findAll);

  router.get("/count",  users.countUser);

  // Retrieve a single User with id
  router.get("/:id", auth.isAuthenticated, users.findOne);

  // Update a User with id
  router.put("/:id", auth.isAuthenticated, users.update);

  // Sign in
  router.post("/signin", auth.signin);

  // Delete a User with id
  router.delete("/:id", users.delete);

  // // Create a new User
  // router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
