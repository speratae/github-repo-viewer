import React, { useState } from 'react';

import { fetchUser } from '../api/userRequest';

type User = {
    name: string;
    login: string;
    bio: string;
}

function SearchUser() {

    const [user, setUser] = useState<User | null>(null); // before search user is null
    const [searchedUser, setSearchedUser] = useState<string>('');

    
    const getUser = async () => {
      try {
        const userData = await fetchUser(searchedUser);
        setUser(userData);
        //console.log('User data:', userData);
      } catch (error: any) {
        throw new Error(error.message);
      }
    };
    
    return (
      <div>
        <div>
          <p>Introduce github username</p>
          <input
          type='text'
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
          />
          <button onClick={getUser}>Search</button>
        </div>

        {user && ( // only render if user is not null
        <div>
          <h1>Found User</h1>
          <p>{JSON.stringify(user)}</p>
          <p>{user.name}</p>
          <p>{user.login}</p>
          <p>{user.bio}</p>
        </div>
      )}
      </div>
    );  

}

export default SearchUser;