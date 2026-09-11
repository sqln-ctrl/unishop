"use client";
import CreateProduct from "../../views/CreateProduct.jsx";
import { SellerRoute } from "../../components/ProtectedRoute.jsx";
export default function Page() { return <SellerRoute><CreateProduct /></SellerRoute>; }
