


function Register(){

    function handleSubmit(e){
        e.preventDefault();
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <input type="password" placeholder="Repeat Password"  name="passwordRepeat"/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;