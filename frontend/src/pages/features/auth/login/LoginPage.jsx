import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../../../store/slices/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  // const { user } = useSelector(state => state);
  const [formData, setFormData] = useState({ email: "imfk4um6ut@yzcalo.com", password: "Admin@123" });
  const handleInputChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    if (name === 'email') {
      value = value.toLowerCase();
    }
    setFormData({
      ...formData,
      [name]: value
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(formData)).unwrap();
    if (res?.success != true) return;
    console.log(res.data)
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginPage