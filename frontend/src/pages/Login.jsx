import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

const Login = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { loading,message, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" placeholder='Username' onChange={(e)=> setFormData({...formData,username: e.target.value})} />
      <input type="email" placeholder='Email' onChange={(e)=> setFormData({...formData,email: e.target.value})} />
      <input type="password" placeholder='Password' onChange={(e)=> setFormData({...formData,password: e.target.value})} />
      <button onClick={handleSubmit}>Submit</button>
      
    </div>
  )
}

export default Login