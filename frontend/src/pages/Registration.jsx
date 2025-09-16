import  { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registration } from '../features/auth/authSlice'

const Registration = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const {massage, error} = useSelector((state)=> state.auth)

  const handleSubmit = () =>{
    dispatch(registration(formData))
  }

  return (
    <div>
      <h2>Registration</h2>
      <input type="text" onChange={(e)=> setFormData({...formData,username: e.target.value})} />
      <input type="email" onChange={(e)=> setFormData({...formData,email: e.target.value})} />
      <input type="password" onChange={(e)=> setFormData({...formData,password: e.target.value})} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default Registration