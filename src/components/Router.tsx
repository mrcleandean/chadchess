import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider as RouterProviderBase,
    Route,
} from "react-router-dom";
import Home from "../App";
import Online from "./Online";

const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Home />} />,
        <Route path="online" element={<Online />} />
    ])
)

const RouterProvider = () => {
    return <RouterProviderBase router={router} />
}

export default RouterProvider;