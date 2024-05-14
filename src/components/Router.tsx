import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider as RouterProviderBase,
    Route,
} from "react-router-dom";
import Home from "../App";
import Computer from "./Computer";
import Online from "./Online";

const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Home />} />,
        <Route path='computer' element={<Computer />} />,
        <Route path="online" element={<Online />} />
    ])
)

const RouterProvider = () => {
    return <RouterProviderBase router={router} />
}

export default RouterProvider;