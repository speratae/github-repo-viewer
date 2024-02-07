import { useCallback, useEffect, useState } from 'react';
import { Language, Repository, User } from '../utils/types'
import { fetchRepositories } from '../api/repoRequest';
import { fetchLanguages } from '../api/langRequest';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/userPageStyle.css'
import NavBar from './NavBar';

/**
 * Represents a React component for the user page.
 * @function UserPage
 * @returns {JSX.Element} JSX markup for the search user component.
 */
function UserPage (  ) {

    // state hooks for managing user data and search functionality
    const location = useLocation(); // react router's location hook for accessing state
    const navigate = useNavigate(); // react router's navigate hook for navigation
    const [user, setUser] = useState<User | null>(null); // holds the user data retrieved from the the location state
    const [repositories, setRepositories] = useState<Repository[]>([]); // holds the list of repositories fetched from the api
    const [languages, setLanguages] = useState<{ [repository: string]: Language }>({}); // holds the languages used in repositories, with repository names as keys
    const [searchedRepositories, setSearchedRepositories] = useState<string>(''); // holds the input value for the searched repositories
    const [filteredRepositories, setFilteredRepositories] = useState<Repository[]>([]); // holds the list of repositories after filtering based on search or language selection
    const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // holds the selected programming language for filtering repositories.

    useEffect(() => {
        /**
       * Asynchronously fetches user data, repositories, and languages upon component mounting or state change.
       * @function fetchData
       * @returns {void}
       */
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
                const languages = await fetchLanguages(repository);
                setLanguages(prevLanguages => ({
                  ...prevLanguages,
                  [repository.name]: languages,
                }));
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
    
    /**
     * Filters displayed repositories based on search query or selected language.
     * @function filterDisplayedRepositories
     * @returns {void}
     */
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

    // extracting all unique languages used in repositories for filtering
    const allLanguages = Object.values(languages) // taking the values of the languages object
        .flatMap(langObj => Object.keys(langObj)) // flattening the array of language objects into a single array of languages
        .filter((lang, index, self) => self.indexOf(lang) === index); // checking whether the current language is the first occurrence in the array

    /**
     * Resets search and filter queries.
     * @function resetQuery
     * @returns {void}
     */
    const resetQuery = () => {
      setFilteredRepositories(repositories);
      setSearchedRepositories('');
      setSelectedLanguage('');
    }

    useEffect(() => {
      filterDisplayedRepositories();
    }, [selectedLanguage, filterDisplayedRepositories]);

    /**
     * Sets the selected language for filtering repositories.
     * @function setLanguageFilter
     * @param {React.ChangeEvent<HTMLSelectElement>} e - The event object.
     * @returns {void}
     */
    const setLanguageFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSelectedLanguage = e.target.value;
      setSelectedLanguage(newSelectedLanguage);
      filterDisplayedRepositories();
    };
    

    return (
        <>
            {user && (
                <>

                    <NavBar userLogin={user && user.login} />

                    <div className='container'>

                        <aside className='user-info'> {/* user data */}
                          <img src={user.avatar_url} alt='avatar'/>
                          <h2 className='bold-style'>{user.name}</h2>
                          <h3>{user.login}</h3>
                          <p>{user.bio}</p>
                        </aside>

                        <div className='repo-area'> {/* repository list */}
                          <div className='filter-area'>

                            <div className='search-area'> {/* search input field and button */}
                              <input
                              type='text'
                              value={searchedRepositories}
                              onChange={(e) => setSearchedRepositories(e.target.value)}
                              />
                              <button onClick={filterDisplayedRepositories}>
                              <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="1em" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007z" fill-rule="nonzero"/></svg>
                              </button>
                            </div>

                            <select
                            id="languageFilter"
                            value={selectedLanguage}
                            onChange={(e) => setLanguageFilter(e)}
                            >
                            <option value="">All Languages</option>
                            {allLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                {lang}
                                </option>
                            ))}
                            </select>

                            { (selectedLanguage || searchedRepositories) && (
                              <> {/* displays clear option if any of the filters hav a value set */}
                              <p onClick={resetQuery} className='clear-filter link-style'>Clear filter</p>
                              </>
                            )}
                          </div>

                          
                            {filteredRepositories.map((repository) => (

                                <div key={repository.id} className='card repo-card'> 

                                    <p className='title bold-style'>{repository.name}</p>
                                    <p className='description'>{repository.description}</p>

                                    {languages[repository.name] && (
                                        <span>
                                        {Object.keys(languages[repository.name]).map((language, index) => (
                                            <span key={index} className="language bold-style">{language}</span>
                                        ))}
                                        </span>
                                    )}

                                </div>
                                
                            ))}
                        </div>
                    </div>
                </>
            ) }
        </>
        
    );
}

export default UserPage;