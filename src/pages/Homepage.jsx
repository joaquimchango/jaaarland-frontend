import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import {StorefrontHero2 }from "@/components/storefront-hero-2"
import { Button } from "@/components/ui/button"
import {ProductCard2 } from "@/components/product-card-2"


export default function Homepage() {
  return (
    <div>
      <StorefrontHero2 />
      <ProductCard2 />
    </div>
  );
}