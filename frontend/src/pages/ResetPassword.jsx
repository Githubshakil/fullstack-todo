import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/auth/authSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
  });

  const dispatch = useDispatch();
  const { massage, error } = useSelector((state) => state.auth);

  const handleSubmit = () => {
    if (token) {
      dispatch(resetPassword({ token, formData }));
    }
  };
  return (
   
      <div>
        <h2>Reset password</h2>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    
  );
};

export default ResetPassword;
