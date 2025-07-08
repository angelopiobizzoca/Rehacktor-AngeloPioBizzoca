import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from '../pages/homepage';
import Layout from '../assets/layout/Layout';
import ErrorPage from '../pages/error/index';
import GenrePage from '../pages/genrepage';
import GamePage from '../pages/gamepage';
import SearchPage from "../pages/searchpage";
import RegisterPage from "../pages/register";
import LoginPage from "../pages/login";
import AccountPage from "../pages/account";
import SessionProvider from "../context/SessionProvider";
import ProfilePage from "../pages/profile";


export function Routing() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/games/:genre" element={<GenrePage />} />
            <Route path="/games/:slug/:id" element={<GamePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/profile" element={<ProfilePage />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
