import {useRef, useState} from 'react'
import {Room, Cancel} from '@mui/icons-material/'
import './login.css'
import axios from 'axios';

const Login = (props) => {
    const [error,setError]= useState(false);
    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            const res = await axios.post("/users/login",user);
            props.myStorage.setItem("user",res.data.username);
            props.setCurrentUsername(res.data.username);
            props.setShowLogin(false);
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

  return (
    <div className ='loginContainer'>
        <div className='logo'>
            <Room/>
            MapApp
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
     
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className='loginBtn'>Login</button>

            {error && 
                <span className='failure'>Error.Something went wrong</span>
            }
        </form>
        <Cancel className='loginCancel' onClick={props.setShowLogin}
        />
    </div>
  )
}


export default Login