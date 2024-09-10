import { Routes, Route, Navigate } from "react-router-dom";
import { ProductList, ProductDetails, PageNotFound } from "../pages";

export const AllRoutes = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/all" element={<ProductList />} />
        <Route path="/clothes" element={<ProductList />} />
        <Route path="/tech" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
