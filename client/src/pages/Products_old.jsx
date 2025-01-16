import { useLoaderData,useNavigate } from "react-router-dom"
import { useContext } from "react";
import { LoginContext } from "../context/loginContext.jsx";
import { createChat } from "../utils/api/fetch.js";
function Products() {
    const {id} = useContext(LoginContext);
    const navigate = useNavigate();
    const products = useLoaderData();
    async function handleGotoChat(product){
        const response = await createChat(product,id);
        console.log(response);
        navigate(`/chat/${response._id}`);

    }
    return (
        <>
            <div>Products</div>
            {products && products.map(product => (
                <div key={product._id}>
                    <h1>{product.name}</h1>
                    <button onClick={() => handleGotoChat(product)}>Chat</button>
                </div>
            ))}

        </>
    )
}

export default Products