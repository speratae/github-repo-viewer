import { useCallback, useEffect, useState } from 'react';
import { Language, Repository, User } from '../utils/types'
import { fetchRepositories } from '../api/repoRequest';
import { useLocation, useNavigate } from 'react-router-dom';

function UserPage (  ) {

    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [languages, setLanguages] = useState<{ [repository: string]: Language }>({}); // key is the repo name
                                                                                      // or else the languages state will be set for each repository, and the rendering part of the code will display the combined languages of all repositories.


    const [searchedRepositories, setSearchedRepositories] = useState<string>(''); 
    const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]); 
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    //const [searchedRepo, setSearchedRepo] = useState<string>('');  

        
    useEffect(() => {
        const fetchData = async () => {
          try {
            if (location.state && location.state.user) {
              setUser(location.state.user);
    
              // fetch repositories
              const repos = await fetchRepositories(location.state.user.login);
              setRepositories(repos);
              setFilteredRepositories(repos);
    
              // fetch languages sequentially
              for (const repository of repos) {
                await fetchLanguages(repository);
              }
            } else {
              // handle the case where user information is not available
              // redirect to the search page
              navigate('/');
            }
          } catch (error: any) {
            console.error('Error:', error.message);
          }
        };
    
        fetchData();
      }, [location.state, navigate]);

      
    /* const getRepositories = async () => {
        try {
            if(user) {
                const repos = await fetchRepositories(user.login);
                //console.log('User repos:', repos);
                setRepositories(repos);
            }
        } catch(error: any) {
            throw new Error(error.message);
        }
      
    } */
    //getRepositories();

    const fetchLanguages = async (repository: Repository) => {
        try {
          const response = await fetch(`${repository.languages_url}`);
          const languages = await response.json();
          //console.log('Repo:', repository);
          //console.log('Languages:', languages);
          //console.log(response);
          setLanguages((prevLanguages) => ({ // just using setLanguages was making the languages overwrite
            ...prevLanguages, // cerates a copy of the prev state
            [repository.name]: languages, // creates new object with value fetched
          }));
        } catch(error: any) {
          throw new Error(error.message);
        }
      };
  
    /* const fetchAllLanguages = async () => {
        for (const repository of repositories) { // change for each bc its a function and not async
            await fetchLanguages(repository);
        }
    }; */
    //fetchAllLanguages();
      
    
    /* const searchRepositories = () => {
        const filtered = repositories.filter((repo) =>
          repo.name.includes(searchedRepo)
        );
        //console.log(filtered);
        setSearchedRepositories(filtered);
        //console.log(searchRepositories);
    }; 

    const filteredRepos = selectedLanguage
    ? repositories.filter((repo) => languages[repo.name]?.[selectedLanguage])
    : repositories; */
        
    const filterDisplayedRepositories = useCallback(() => {
        let filteredRepos = repositories;
        if (searchedRepositories) {
            filteredRepos = filteredRepos.filter((repo) => repo.name.includes(searchedRepositories));
        }
        if (selectedLanguage) {
            filteredRepos = filteredRepos.filter((repo) => languages[repo.name]?.[selectedLanguage]);
        }
        setFilteredRepositories(filteredRepos);
    }, [repositories, searchedRepositories, selectedLanguage, languages])

    const allLanguages = Object.values(languages) // takes the values of the languages object
        .flatMap(langObj => Object.keys(langObj)) // flatten the array of language objects into a single array of languages
        .filter((lang, index, self) => self.indexOf(lang) === index); // checks whether the current language is the first occurrence in the array

    //const user = (location.state as { user: User }).user; //  cast the location.state to an object with a user property of type User
                                                        // .user: accesses the user property from the casted object
    //console.log(user);
    //console.log(languages);

    const resetQuery = () => {
      setFilteredRepositories(repositories);
    }

    useEffect(() => {
      console.log('Selected Language (from state):', selectedLanguage);
      filterDisplayedRepositories();
    }, [selectedLanguage, filterDisplayedRepositories]);

    const setLanguageFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSelectedLanguage = e.target.value;
      setSelectedLanguage(newSelectedLanguage);
      console.log('Selected Language (from event):', newSelectedLanguage);
      console.log('Selected Language (from state):', selectedLanguage);
      filterDisplayedRepositories();
    };
    

    return (
        <>
            {user && (
                <>
                    <div>

                        <aside>
                            <h1>{user.name}</h1>
                            <p>{user.login}</p>
                            <p>{user.bio}</p>
                        </aside>

                        <div>
                        <h1>Repositories</h1>
                            <input
                            type='text'
                            value={searchedRepositories}
                            onChange={(e) => setSearchedRepositories(e.target.value)}
                            />
                            <button onClick={filterDisplayedRepositories}>Search</button>

                            <select
                            id="languageFilter"
                            value={selectedLanguage}
                            onChange={/* (e) => setSelectedLanguage(e.target.value) */  (e) => setLanguageFilter(e)}
                            >
                            <option value="">All Languages</option>
                            {allLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                {lang}
                                </option>
                            ))}
                            </select>

                            { (selectedLanguage || searchedRepositories) && (
                              <>
                              <p onClick={resetQuery}>Clear filter</p>
                              </>
                            )}

                            {filteredRepositories.map((repository) => (
                                <div key={repository.id}> 
                                    <p>{repository.name} {repository.description}</p>
                                    {languages[repository.name] && (
                                    <span>
                                        Languages: {Object.keys(languages[repository.name]).join(', ')}
                                    </span>
                                    )}
                                    <hr/>
                                </div>
                                
                            ))};
                        </div>
                    </div>
                </>
            ) }
        </>
        
    );
}

export default UserPage;