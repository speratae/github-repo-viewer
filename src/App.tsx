import React, { useEffect, useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import { fetchRepositories } from './api/repoRequest';
import SearchUser from './components/searchUser';


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

  const [repositories, setRepositories] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<{ [repository: string]: Language }>({}); // key is the repo name
                                                                                      // or else the languages state will be set for each repository, and the rendering part of the code will display the combined languages of all repositories.

  const [searchedRepositories, setSearchedRepositories] = useState<Repo[]>([]);



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

  useEffect(() => {
    const filtered = repositories.filter((repo) =>
      repo.name.includes('30')
    );
    setSearchedRepositories(filtered);
  }, [repositories]);

  
  return (
    <div className="App">

      <SearchUser/>

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
      <h1>Search</h1>
      {searchedRepositories.map((repository) => (
        <div key={repository.id}> 
          <p>{repository.name} {repository.description}</p>
          {languages[repository.name] && (
          <span>
            Languages: {Object.keys(languages[repository.name]).join(', ')}
          </span>
        )}
        </div>
      ))}
    </div>
  );
}

export default App;
