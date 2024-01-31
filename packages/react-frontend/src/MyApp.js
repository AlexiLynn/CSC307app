// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  const [characters, setCharacters] = useState([]);
  return (
      <div className="container">
        <Table
          characterData={characters}
          removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
      </div>
  );

    function removeOneCharacter(index) {
      let id = characters[index].id;
      const promise = fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE"
      });
      promise.then((response) => {if(response.status === 204){
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      }})
    }
    
    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function postUser(person) {
      const promise = fetch("Http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
      return promise;
    }

    function updateList(person){ 
      postUser(person)
        .then(response => {
          if (response.status === 201) {
            return response.json();
          } else {
            console.error('Person not created:', response.status);
          }
        })
        .then((json) => setCharacters([...characters, json])) //We have to wait for json
        .catch((error) => {
          console.log(error);
        })
    }

}

export default MyApp;