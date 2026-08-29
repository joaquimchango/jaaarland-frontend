import {Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  return(
    <header className="header width-full flex flex-row justify-between">
      <div className="header__logo">
        <Link to="/">Jaaarland</Link>
      </div>
      <div className="header__nav">
       <Navbar />
      </div>
     </header> 
  )



}