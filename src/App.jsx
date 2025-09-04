import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";


import Collections from "./pages/collections";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Home from "./pages/home";
import PrivateRoute from "./routes/route";
import Upload from "./components/upload";

function App() {
    return (
        <div className="App h-lvh">
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard>
                                        <Upload />
                                    </Dashboard>
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </div>
    );
}

export default App;
