import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      "/": "Home",
      "/listing": "Listing",
      "/product/:id": "Product",
      "/cart": "Cart",
      "/checkout": "Checkout",
      "/afterpayment": "After Payment",
      "/orders": "Orders",
      "/account-details": "Account Details",
      "/about": "About",
      "/login": "Login",
      "/signup": "Sign Up",
      "/forgot-password": "Forgot Password",
      "/reset-password": "Reset Password",
      "/verify-email": "Verify Email",
      "/edit-product/:id": "Edit Product", 
      "/edit-product": "Add Product", 
    };

    const currentRoute = Object.keys(routeTitles).find((route) => {
      if (route.includes(":")) {
        const routePattern = new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`);
        return routePattern.test(location.pathname);
      }
      return route === location.pathname;
    });

    const title = currentRoute ? routeTitles[currentRoute] : "Not Found";
    document.title = `La Diversité - ${title}`;
  }, [location.pathname]);

  return null; 
};

export default PageTitle;