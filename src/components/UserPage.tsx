import { useEffect, useState } from 'react';
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
    useEffect(() => {
        if (location.state && location.state.user) {
          setUser(location.state.user);
        } else {
          // handle the case where user information is not available
          // redirect to the search page          
          navigate('/');
        }
      }, [location.state, navigate]);

      
    const getRepositories = async () => {
        try {
            if(user) {
                const repos = await fetchRepositories(user?.login);
                //console.log('User repos:', repos);
                setRepositories(repos);
            }
        } catch(error: any) {
            throw new Error(error.message);
        }
      
    }
    getRepositories();

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
  
    repositories.forEach(repository => {
        fetchLanguages(repository);
    })
      
      
    //const user = (location.state as { user: User }).user; //  cast the location.state to an object with a user property of type User
                                                        // .user: accesses the user property from the casted object
    console.log(user);

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
                            {repositories.map((repository) => (
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