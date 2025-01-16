import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";


function Root(){

    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Root;