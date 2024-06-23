
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsersView from "./components/users/usersView";
import UserProfile from "./components/users/userProfile";
import UserStats from "./components/users/userStats";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserStats />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:userId" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
