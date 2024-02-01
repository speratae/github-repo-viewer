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
  name: string;
  description: string;
  languages_url: string;
}

function App() {

  const [user, setUser] = useState<User>({name:'', login:'', bio:''});
  const [repositories, setRepositories] = useState<Repo[]>([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser('Ruth12mak');
        setUser(userData);
        console.log('User data:', userData);
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
        console.log('User repos:', repos);
        setRepositories(repos);
      } catch(error: any) {
        throw new Error(error.message);
      }
  
    }
    getRepositories();
  },[])

  
  return (
    <div className="App">
      <h1>User</h1>
      <p>{JSON.stringify(user)}</p>
      <p>{user.name}</p>
      <p>{user.login}</p>
      <p>{user.bio}</p>
      <h1>Repositories</h1>
      {repositories.map((repository) => (
        <p key={repository.name}> {repository.name} {repository.description} {repository.languages_url}</p>
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
