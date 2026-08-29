import {Link } from "react-router-dom";


import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"



export default function Navbar() {

  return(
    <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <Link to="/home">Home</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link to="/register">Register</Link>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/profile">Featured products</Link>
            </NavigationMenuLink>
           </NavigationMenuItem> 
           <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/profile">Spice Jars</Link>
            </NavigationMenuLink>
           </NavigationMenuItem> 
           <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/profile">Candle jars</Link>
            </NavigationMenuLink>
           </NavigationMenuItem> 
        </NavigationMenuList>
      </NavigationMenu>
  )
}