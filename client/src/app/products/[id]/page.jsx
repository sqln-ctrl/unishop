"use client";
import { useParams } from "next/navigation";
import ProductDetails from "../../../views/ProductDetails.jsx";
export default function Page() { const { id } = useParams(); return <ProductDetails id={id} />; }
