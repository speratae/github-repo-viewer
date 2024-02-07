import './App.css';
import SearchUser from './components/SearchUserPage';
import UserPage from './components/UserPage';
import './css/globalStyle.css'
import { Route, Routes } from 'react-router-dom';



function App() {

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
