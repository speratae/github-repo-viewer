import React, { useEffect, useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import { fetchRepositories } from './api/repoRequest';
import SearchUser from './components/searchUser';
import UserPage from './components/UserPage';
import { Route, Routes } from 'react-router-dom';
import { Repo, Language } from './utils/types';



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

    <Routes>
      <Route path='/' element={ <SearchUser/> }/>
      <Route path='/user/:username' 
      element={<UserPage />}
    />

    </Routes>
    
  );
}

export default App;
