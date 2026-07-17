import sysgrafix from "./sysgrafix.service";
import ProductType from "../types/ProductType";

const ProductService = {
  getAll: (params?: { name?: string; category?: string }) => sysgrafix.get("/produtos", { params }),
  create: (params?: ProductType) => sysgrafix.post("/produtos/cadastrar", params),
};

export default ProductService;
