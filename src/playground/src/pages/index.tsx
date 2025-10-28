import { Route, Routes } from "react-router-dom";
import Home from "./home";
import Layout from "@/layout";

export default () => {
    return(
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<Home/>}/>
            </Route>
        </Routes>
    );
}