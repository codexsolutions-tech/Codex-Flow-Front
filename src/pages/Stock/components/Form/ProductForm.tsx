import { Hash, ShoppingBag } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema, ProductFormData } from "./product.schema";
import Field from "../../../../components/Input/Field";

type Props = {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  submitText: string;
};

const btnGhost =
  "cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-[12px] text-[#8a85b4] transition-colors hover:bg-white/[0.09]";
const btnPrimary =
  "cursor-pointer rounded-lg bg-gradient-to-br from-[#7c6ef5] to-[#a78bfa] px-4 py-2.5 text-[12px] text-white transition-all active:scale-[0.98]";

export function ProductForm({ defaultValues, onSubmit, onCancel, submitText }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      valorCompra: 0,
      valorVenda: 0,
      quantidade: 0,
      descricao: "",
      imagem: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-5">
      <Field
        label="Nome do produto"
        icon={<ShoppingBag className="h-3.5 w-3.5" />}
        error={errors.nome?.message}
        {...register("nome")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Preço de compra"
          type="number"
          step="0.01"
          error={errors.valorCompra?.message}
          {...register("valorCompra", {
            valueAsNumber: true,
          })}
        />

        <Field
          label="Preço de venda"
          type="number"
          step="0.01"
          error={errors.valorVenda?.message}
          {...register("valorVenda", {
            valueAsNumber: true,
          })}
        />
      </div>

      <Field
        label="Quantidade"
        type="number"
        icon={<Hash className="h-3.5 w-3.5" />}
        error={errors.quantidade?.message}
        {...register("quantidade", {
          valueAsNumber: true,
        })}
      />

      <Field label="Descrição" error={errors.descricao?.message} {...register("descricao")} />

      <Field label="Imagem" error={errors.imagem?.message} {...register("imagem")} />

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className={btnGhost}>
          Cancelar
        </button>

        <button type="submit" className={btnPrimary}>
          {submitText}
        </button>
      </div>
    </form>
  );
}
