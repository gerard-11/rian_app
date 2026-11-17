import { useState, type ImgHTMLAttributes } from "react";
import { getTireImageUrl, TIRE_PLACEHOLDER } from "./tireImages";

type TireImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  model: string | null | undefined;
  /** Elige una foto distinta de la galería según la llanta (p. ej. su id). */
  seed?: string;
  /** Fuerza una imagen concreta (galería del detalle). */
  src?: string;
  size?: number;
};

// Si el modelo no tiene imagen (o falla la carga) se muestra el placeholder.
export function TireImage({ model, seed, src, size = 240, alt, className, ...props }: TireImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? TIRE_PLACEHOLDER : (src ?? getTireImageUrl(model, seed));

  return (
    <img
      alt={alt ?? (model ? `Llanta Torque ${model}` : "Llanta Torque")}
      className={`aspect-square object-contain ${className ?? ""}`}
      decoding="async"
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      src={imageSrc}
      width={size}
      {...props}
    />
  );
}
