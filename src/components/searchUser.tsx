import React, { useState } from 'react';

import { fetchUser } from '../api/userRequest';
import { User } from '../utils/types'
import { useNavigate } from 'react-router-dom';
import '../css/searchPageStyle.css'
import '../css/cardStyle.css'

function SearchUser() {

    const [user, setUser] = useState<User | null>(null); // before search user is null
    const [searchedUser, setSearchedUser] = useState<string>('');
    const [userFound, setUserFound] = useState<boolean>(true);
    const navigate = useNavigate();

    
    const getUser = async () => {
      try {
        const userData = await fetchUser(searchedUser);

        if (userData.message === 'Not Found') {
          //console.log('User not found');
          setUserFound(false);
        } else {
          setUser(userData);
          setUserFound(true);
          //console.log('User data:', userData);
        }

      } catch (error: any) {
        throw new Error(error.message);
      }
    };

    const navigateToUserPage = () => {
      if (user) {
        console.log(user);
        navigate(`/user/${user.login}`, {state: {user} } );
      }
    };
    
    return (
      <div id='container'>

        <div id='search-area'>
          <p>Introduce github username</p>
          <input
          type='text'
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
          />
          <button onClick={getUser}>Search</button>
        </div>

        {!userFound && (
          <div className='user-area'>
            <h3>Your search did not match any users</h3>
          </div>
        )}

        {userFound && user && (
          <div className='user-area'>
            <div className='card'>

              <div className='card-img'>
                <img src={user.avatar_url} alt='avatar'></img>
              </div>

              <div className='card-content'>
                <h3 className='card-title'>{user.name}</h3>
                <h3
                className='card-login'
                onClick={navigateToUserPage}> {user.login}</h3>
                <p className='card-description'>{user.bio}</p>
              </div>
            </div>
          </div>
      )}
      </div>
    );  

}

export default SearchUser;