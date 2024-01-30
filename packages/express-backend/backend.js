// backend.js
import express from "express";
import cors from "cors";

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello to the person grading my assignment! I am happy you are here.");
});

const findUserByName = (name) => {
return users["users_list"].filter(
    (user) => user["name"] === name
);
};

app.get("/users", (req, res) => {
const name = req.query.name;
if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
} else {
    res.send(users);
}
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByIdAndJob = (id, job) =>
  users["users_list"].find((user) => user["id"] === id) && 
  users["users_list"].find((user) => user["job"] === job);

/*Search By Id and Job*/
app.get("/users/:id/:job", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  const job = req.params["job"];
  let result = findUserByIdAndJob(id, job);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});


app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.send();
});

/*Delete A User*/

const removeUser = (id) => {
    const index = users.users_list.findIndex(user => user.id === id);
    if (index !== -1) {
      // If user is found, remove it from the array
      users.users_list.splice(index, 1);
    }
};


app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        /*What goes here?*/
        removeUser(id);
        res.send("User deleted successfully.");
    }
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});