import React,{useContext,useRef,useEffect,useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import M from "materialize-css"

const NavBar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {
        M.Modal.init(searchModal.current)
    },[])
    const renderList = () => {
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",cursor:"pointer"}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
                <li key="5">
                <button className="btn waves-effect waves-light #c62828 red darken-3"
                    onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        navigate('/login')
                    }}>Logout
                </button>
                </li>
            ]
        } else {
            return [
                <li key="6"><Link to="/login">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
        fetch("/search-users", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                query
            })
            }).then(res => res.json())
                .then(results => {
                    console.log(results)
                    setUserDetails(results.user)

                })
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/login"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} style={{color:"white"}}>
                    <div className="modal-content">
                        <input 
                        type="text"
                        placeholder='Search users'
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                        />
                    <ul className="collection" style={{ color: "black", display: "flex", flexDirection: "column"}}>
                        {userDetails.map(item=>{
                            return <Link to={item._id === state._id ? "/profile" : `/profile/${item._id}`} onClick={()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch("")
                            }}><li className="collection-item">
                            <img style={{width:"20px",height:"20px",borderRadius:"50%",marginTop:"10px"}} src={item.pic} alt="" />
                                <space/>
                                {item.email}
                                </li></Link>
                        })}
                    </ul>
                    </div>
                    <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>Close</button>
                    </div>
            </div>
        </nav>
    ); 
}

export default NavBar;
