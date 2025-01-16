import {login} from "../utils/api/fetch.js";
import { useContext } from "react";
import { LoginContext } from "../context/loginContext.jsx";
import { useNavigate } from "react-router-dom";
function Login(){
    const {id,setId} = useContext(LoginContext);
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        // comprobación de los datos

        const response = await login(email,password);
        if(response._id){
            setId(response._id);
            navigate('/');
        }
        console.log(response);
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" name="email"/>
                <input type="password" placeholder="Password" name="password"/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;