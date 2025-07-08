import { Outlet } from "react-router";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Searchbar from "../components/Searchbar";


export default function Layout() {
  return (
    <div>

      <Header />


      <Sidebar />



      <Searchbar />


      <Outlet />



      <Footer />

    </div>
  );
};
