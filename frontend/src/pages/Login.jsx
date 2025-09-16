import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

const Login = () => {

  const [formData, setFormData] = useState({
    
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.auth);
  console.log(message);
  console.log(error);
  console.log(loading);

  const handleSubmit = () => {
    dispatch(login(formData));
  };

  return (
    <div>
      <h1>Login</h1>
     
      <input type="email" placeholder='Email' onChange={(e)=> setFormData({...formData,email: e.target.value})} />
      <input type="password" placeholder='Password' onChange={(e)=> setFormData({...formData,password: e.target.value})} />
      {loading 
      ?
      <button>Loading......</button>
      :

      <button onClick={handleSubmit}>Submit</button>
}
      
    </div>
  )
}

export default Login