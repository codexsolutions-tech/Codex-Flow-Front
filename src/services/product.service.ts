import sysgrafix from "./sysgrafix.service";
import ProductType from "../types/ProductType";

type CreateProductType = Omit<ProductType, "id">;

const ProductService = {
  getAll: (params?: { name?: string; category?: string }) => sysgrafix.get("/produtos", { params }),
  create: (params: CreateProductType) => sysgrafix.post("/produtos/cadastrar", params),
  update: (id: string, data: Partial<ProductType>) => sysgrafix.patch(`/produtos/alterar/${id}`, data),
};

export default ProductService;
