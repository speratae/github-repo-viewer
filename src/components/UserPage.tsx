import { useEffect, useState } from 'react';
import { User } from '../utils/types'
import { useLocation, useNavigate } from 'react-router-dom';

function UserPage (  ) {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.user) {
          setUser(location.state.user);
        } else {
          // handle the case where user information is not available
          // redirect to the search page          
          navigate('/');
        }
      }, [location.state]);
      
    //const user = (location.state as { user: User }).user; //  cast the location.state to an object with a user property of type User
                                                        // .user: accesses the user property from the casted object
    console.log(user);

    return (
        <>
            {user && (
                <>
                    <h1>{user.name}</h1>
                    <p>{user.login}</p>
                    <p>{user.bio}</p>
                </>
            ) }
        </>
        
    );
}

export default UserPage;