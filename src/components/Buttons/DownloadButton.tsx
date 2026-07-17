import { RefObject } from "react";
import { toPng } from "html-to-image";
import domtoimage from "dom-to-image";
import { toast } from "react-toastify";

export const handleDownload = async (targetRef: RefObject<HTMLDivElement>) => {
  if (!targetRef.current) {
    toast.error("Elemento não encontrado para download.");
    return;
  }

  const node = targetRef.current;

  try {
    const img = await toPng(node, {
      cacheBust: true,
      backgroundColor: "#ffffff",
    });

    downloadImage(img);
    toast.success("Download realizado com sucesso!");
  } catch {
    try {
      const img = await domtoimage.toPng(node, {
        cacheBust: true,
        bgcolor: "#ffffff",
      });

      downloadImage(img);
      toast.success("Download realizado com sucesso!");
    } catch {
      toast.error("Erro ao gerar imagem. Tente novamente.");
    }
  }
};

const downloadImage = (dataUrl: string) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "nota.png";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
