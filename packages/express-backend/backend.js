// backend.js
import express from "express";
import cors from "cors";
import user from "./user-services.js"

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

app.get("/users", (req, res) => { /*DONE*/
const name = req.query.name;
if (name != undefined) {
    user.findUserByName(name).then((result) => {
      result = { users_list: result };
      res.send(result);
    })
} else {
    user.getUsers().then((result) => {
      result = { users_list: result };
      res.send(result);
    });
}
});

const findUserById = (id) => /*DONE*/
  users["users_list"].find((user) => user["id"] === id);

/*Search By Id and Job*/
app.get("/users/:_id/:job", (req, res) => {
  const id = req.params["_id"];
  const job = req.params["job"];

  // Use Promise.all to execute both functions concurrently
  Promise.all([
    user.findUserById(id),
    user.findUserByJob(job)
  ])
  .then(([userById, userByJob]) => {
    if (userById && userByJob) {
      // If both results are found, return either (I chose by id becuase it is more likely to be unique)
      user.findUserById(id).then((result) =>{ if (result === undefined) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }})
    } else {
      // If any result is missing, send 404
      res.status(404).send("Resource not found.");
    }
})});

app.get("/users/:_id", (req, res) => { /*DONE*/
    const id = req.params["_id"]; //or req.params.id
    user.findUserById(id).then((result) =>{ if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
})}
);

app.post("/users", (req, res) => { /*DONE*/
    const userToAdd = req.body;
    user.id = `${Math.random()}`;
    user.addUser(userToAdd).then((result) => {
      if(result !== undefined){
        res.status(201).send(result);
      }
      res.send();
    })
});

/*Delete A User*/

const removeUser = (id) => {
    const index = users.users_list.findIndex(user => user.id === id);
    if (index !== -1) {
      // If user is found, remove it from the array
      users.users_list.splice(index, 1);
    }
};

app.delete("/users/:_id", (req, res) => {
    const id = req.params["_id"];
    user.findUserByIdAndDelete(id).then((result) => {
      if(result === undefined){
        res.status(404).send("Resource not found.");
      }
      else{
        res.status(204).send();
      }
    })
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});