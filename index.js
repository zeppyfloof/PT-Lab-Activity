const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let userData = require("./library.json");

app.get("/users", (req, res) => {
  res.json(userData.users);
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  newUser.Id = userData.users.length + 1;
  userData.users.push(newUser);

  fs.writeFileSync("./library.json", JSON.stringify(userData, null, 2));

  res.json(newUser);
});

app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userData.users.find((u) => u.Id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = userData.users.findIndex((u) => u.Id === userId);

  if (userIndex !== -1) {
    userData.users.splice(userIndex, 1);

    fs.writeFileSync("./library.json", JSON.stringify(userData, null, 2));

    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const userIndex = userData.users.findIndex((user) => user.Id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the user data
  userData.users[userIndex] = { ...userData.users[userIndex], ...updatedUser };

  fs.writeFileSync("./library.json", JSON.stringify(userData, null, 2));

  res.json({ message: "User updated successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
