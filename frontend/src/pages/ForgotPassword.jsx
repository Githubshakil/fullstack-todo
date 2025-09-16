
import  { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../features/auth/authSlice'



const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const dispatch = useDispatch();
  const { massage, error } = useSelector((state) => state.auth);

  const handleSubmit = () => {
    dispatch(forgotPassword(formData));
  };
  return (
    <div>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ForgotPassword;
