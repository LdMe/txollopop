import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Root from "../pages/Root";
import { getProducts,getChat } from "../utils/api/fetch";
import Products from "../pages/Products";
import Chat from "../pages/Chat";
import MyProducts from "../pages/MyProducts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        children:[
            {
                path: "",
                element: <Products/>,
                loader: getProducts
            },
            {
                path: "product/",
                element: <MyProducts/>,
            },
            {
                path: "product/:productId",
                element: <h1>Producto con id</h1>,
            },
            {
                path: "chat/:chatId",
                element: <Chat/>,
                loader: ({params}) => getChat(params.chatId)
            },
            {
                path: "login",
                element : <Login/>
            },
            {
                path: "register",
                element : <Register/>
            },
            
        ]
    },
]);

export default router;