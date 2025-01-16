import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Root from "../pages/Root";
import { getProducts,getChat } from "../utils/api/fetch";
import Products from "../pages/Products";
import Chat from "../pages/Chat";
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
            }
        ]
    },
]);

export default router;