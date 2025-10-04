import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();
    navigate("/listing")
  }  
  return (
    <form onSubmit={handleSubmit}>
        <label>Enter Your Name <input /></label><br></br>
        <label>Enter Your Age  <input /></label>
        <button type="submit">Submit</button>
    </form>
  )
}

export default Login