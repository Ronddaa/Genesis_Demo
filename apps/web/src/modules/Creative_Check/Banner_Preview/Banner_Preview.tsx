/* eslint-disable @next/next/no-img-element */
// Path: apps/web/src/modules/Creative_Check/Banner_Preview/Banner_Preview.tsx

import { useEffect, useRef } from "react";
import { Selected_Banner } from "../types/selected_banner.type";
import styles from "./Banner_Preview.module.scss";

interface Banner_Preview_Props {
  banner: Selected_Banner;
}

export default function Banner_Preview({ banner }: Banner_Preview_Props) {
  const image_ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = image_ref.current;
    if (!image) return;

    const preview_url = URL.createObjectURL(banner.file);
    image.src = preview_url;

    return () => {
      URL.revokeObjectURL(preview_url);
    };
  }, [banner.file]);

  return (
    <div className={styles.wrapper_image}>
      <img
        className={styles.banner_image}
        ref={image_ref}
        alt={`img_${banner.image_name}`}
      />
      
    </div>
  );
}
