import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { fetchUser } from './api/userRequest';
import { fetchRepositories } from './api/repoRequest';

interface User {
  name: string;
  login: string;
  bio: string;
}

interface Repo {
  id: number;
  name: string;
  description: string;
  languages_url: string;
}

interface Language {
  [language: string]: number; // index that is a string and a value that is a number
}

function App() {

  const [user, setUser] = useState<User>({name:'', login:'', bio:''});
  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<{ [repository: string]: Language }>({}); // key is the repo name
                                                                                      // or else the languages state will be set for each repository, and the rendering part of the code will display the combined languages of all repositories.

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser('Ruth12mak');
        setUser(userData);
        //console.log('User data:', userData);
      } catch (error: any) {
        console.error('Error fetching user:', error.message);
      }
    };

    getUser();
  }, []);


  useEffect(() => {
    const getRepositories = async () => {
      try {
        const repos = await fetchRepositories('Ruth12mak');
        //console.log('User repos:', repos);
        setRepositories(repos);
      } catch(error: any) {
        throw new Error(error.message);
      }
  
    }
    getRepositories();
  },[])

  useEffect(() => {
    const fetchLanguages = async (repository: Repo) => {
      try {
        const response = await fetch(`${repository.languages_url}`);
        const languages = await response.json();
        console.log('Repo:', repository);
        console.log('Languages:', languages);
        console.log(response);
        setLanguages((prevLanguages) => ({ // just using setLanguages was making the languages overwrite
          ...prevLanguages, // cerates a copy of the prev state
          [repository.name]: languages, // creates new object with value fetched
        }));
      } catch(error: any) {
        throw new Error(error.message);
      }
    };

    repositories.forEach(repository => {
      fetchLanguages(repository);
    })

  },[repositories]) // called when repository change

  
  return (
    <div className="App">
      <h1>User</h1>
      <p>{JSON.stringify(user)}</p>
      <p>{user.name}</p>
      <p>{user.login}</p>
      <p>{user.bio}</p>
      <h1>Repositories</h1>
      {repositories.map((repository) => (
        <div key={repository.id}> 
          <p>{repository.name} {repository.description}</p>
          {languages[repository.name] && (
          <span>
            Languages: {Object.keys(languages[repository.name]).join(', ')}
          </span>
        )}
        </div>
      ))}
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
