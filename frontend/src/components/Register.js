import {useRef, useState} from 'react'
import {Room, Cancel} from '@mui/icons-material/'
import './register.css'
import axios from 'axios';

const Register = (props) => {
    const [success,setSuccess]= useState(false);
    const [error,setError]= useState(false);
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };

        try {
            await axios.post("/users/register",newUser);
            setError(false)
            setSuccess(true)
        } catch (error) {
            setError(true)
        }
    }

  return (
    <div className ='registerContainer'>
        <div className='logo'>
            <Room/>
            MapApp
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref={nameRef}/>
            <input type="email" placeholder="email" ref={emailRef}/>
            <input type="password" placeholder="password" ref={passwordRef}/>
            <button className='registerBtn'>Register</button>

            {success && 
                <span className='success'>Successfull. You can login now!</span>
            }
            {error && 
                <span className='failure'>Error.Something went wrong</span>
            }
        </form>
        <Cancel className='registerCancel' onClick={props.setShowRegister}
        />
    </div>
  )
}


export default Register