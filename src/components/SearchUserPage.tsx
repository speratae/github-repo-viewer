import React, { useState } from 'react';
import { fetchUser } from '../api/userRequest';
import { User } from '../utils/types'
import { useNavigate } from 'react-router-dom';
import '../css/searchPageStyle.css'
import '../css/cardStyle.css'
import NavBar  from './NavBar';

/**
 * Represents a React component for searching GitHub users.
 * @function SearchUser
 * @returns {JSX.Element} JSX markup for the search user component.
 */
function SearchUser() {

    // state hooks for managing user data and search functionality
    const [user, setUser] = useState<User | null>(null); // holds the user data retrieved from the api
    const [searchedUser, setSearchedUser] = useState<string>(''); // holds the input value for the searched user
    const [userFound, setUserFound] = useState<boolean>(true); // indicates if the searched user is found or not
    const navigate = useNavigate(); // react router's navigate hook for navigation

    /**
     * Asynchronously fetches user data from the GitHub API based on the searched username.
     * Sets the user state if found, otherwise sets userFound state to false.
     * @async
     * @function getUser
     * @returns {Promise<void>}
     */
    const getUser = async () => {
      try {
        const userData = await fetchUser(searchedUser);

        if (userData.message === 'Not Found') {
          setUserFound(false);
        } else {
          setUser(userData);
          setUserFound(true);
        }

      } catch (error: any) {
        throw new Error(error.message);
      }
    };

    /**
     * Navigates to the user page if user data is available.
     * @function navigateToUserPage
     * @returns {void}
     */
    const navigateToUserPage = () => {
      if (user) {
        console.log(user);
        navigate(`/user/${user.login}`, {state: {user} } );
      }
    };
    
    return (
      <div id='container'>

        <NavBar/>

        <div id='search-area'> {/* search input field and button */}

          <p className='bold-style'>Introduce a Github username</p>
          <div className='search-area'>
            <input
            type='text'
            value={searchedUser}
            onChange={(e) => setSearchedUser(e.target.value)}
            />
            <button onClick={getUser}>
              <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="1em" height="auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007z" fill-rule="nonzero"/></svg>
            </button>
          </div>

        </div>

        {!userFound && ( 
          <div id='user-area'> {/* display message if user not found */}
            <h3 className='bold-style'>Your search did not match any users</h3>
          </div>
        )}

        {userFound && user && (
          <div id='user-area'> {/* render user card if user found */}
            
            <div className='card user-card'>

              <div className='card-img'>
                <img src={user.avatar_url} alt='avatar'></img>
              </div>

              <div className='card-content'>
                <h3 className='bold-style'>{user.name}</h3>
                <h3
                className='link-style bold-style'
                onClick={navigateToUserPage}> {user.login}</h3>
                <p className='description'>{user.bio}</p>
              </div>

            </div>

          </div>
      )}
      </div>
    );  

}

export default SearchUser;