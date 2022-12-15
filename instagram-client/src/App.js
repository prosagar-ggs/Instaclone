import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import NavBar from './components/Navbar';
import {BrowserRouter,Routes,Route,useNavigate,useLocation} from "react-router-dom"
import Home from './components/screens/Home';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Login from './components/screens/Login';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import { reducer,initialState } from './reducers/userReducer';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts';
import Reset from './components/screens/reset';
import NewPassword from './components/screens/Newpassword';

export const UserContext = createContext();
const Routing=()=> {
  const navigate = useNavigate()
  const location = useLocation()
  const {state,dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
      if(user){
        dispatch({type:"USER",payload:user})
      }
      else{
          if (!location.pathname.startsWith ("/reset")) {
              navigate("/Login")
          } 
      }
    
    },[])
  return(
    <>
      <Routes>
        <Route exact path='/' element={<><NavBar/><Home/></>} />
        <Route path='/Signup' element={<><NavBar/><Signup/></>}/>
        <Route path='/Login' element={<><NavBar/><Login/></>}/>
        <Route exact path='/Profile' element={<><NavBar/><Profile/></>}/>
        <Route path='/create' element={<><NavBar/><CreatePost/></>}/>
        <Route path='/profile/:userId' element={<><NavBar/><UserProfile/></>}/>
        <Route path='/myfollowingpost' element={<><NavBar/><SubscribedUserPosts/></>}/>
        <Route exact path='/reset' element={<><NavBar /><Reset /></>} />
        <Route path='/reset/:token' element={<><NavBar /><NewPassword /></>} />
      </Routes>
    </>
  )
}

const App=()=>{
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Routing/>
        </BrowserRouter>
      </UserContext.Provider> 
  );
}

export default App;
