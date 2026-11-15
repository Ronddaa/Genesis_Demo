// Path: apps/web/src/modules/Creative_Check/Banner_Picker/Banner_Picker.tsx

"use client";

import { ChangeEvent, useState } from "react";
import styles from "./Banner_Picker.module.scss";

const sprite = "/sprite.svg";

const max_file_size = 5 * 1024 * 1024;
const allowed_mime_types = new Set(["image/png", "image/jpeg"]);

interface Banner_Picker_Props {
  on_add: (files: File[]) => void;
}

function get_file_error(file: File): string | null {
  if (file.size === 0) {
    return "The file is empty.";
  }

  if (file.size > max_file_size) {
    return "The file exceeds 5 MiB.";
  }

  const is_supported = file.type
    ? allowed_mime_types.has(file.type)
    : /\.(png|jpe?g)$/i.test(file.name);

  if (!is_supported) {
    return "Select a PNG or JPEG image.";
  }

  return null;
}

export default function Banner_Picker({ on_add }: Banner_Picker_Props) {
  const [errors, set_errors] = useState<string[]>([]);

  function handle_change(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);

    input.value = "";

    if (files.length === 0) return;

    const accepted_files: File[] = [];
    const next_errors: string[] = [];

    files.forEach((file, index) => {
      const error = get_file_error(file);

      if (error) {
        next_errors.push(`00_${index + 1}: ${error}`);
      } else {
        accepted_files.push(file);
      }
    });

    set_errors(next_errors);

    if (accepted_files.length > 0) {
      on_add(accepted_files);
    }
  }

  return (
    <div className={styles.block_banner_picker}>
      <label className={styles.label_input} htmlFor="banner_files">
        <input
          className={styles.input}
          type="file"
          id="banner_files"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          multiple
          onChange={handle_change}
        />
      </label>

      <svg className={styles.icon} width={32} height={32}>
        <use xlinkHref={`${sprite}#icon-file_upload`} />
      </svg>

      <p className={styles.text_add}>Drag & drop banners here, or <span>browse files</span></p>
      <p className={styles.text_file_info}>PNG or JPEG, up to 5 MiB per image.</p>

      {errors.length > 0 && (
        <ul className={styles.wrapper_images_list}>
          {errors.map((error) => (
            <li className={styles.list_element} key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
