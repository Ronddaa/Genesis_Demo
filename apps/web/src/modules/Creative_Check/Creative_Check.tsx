// Path: apps/web/src/modules/Creative_Check/Creative_Check.tsx

"use client";

import styles from "./Creative_Check.module.scss";
import Banner_Picker from "./Banner_Picker/Banner_Picker";
import Banner_Preview from "./Banner_Preview/Banner_Preview";
import { useSelected_banners } from "./hooks/use_selected_banners.hook";
import { useState } from "react";
import { Check_Brief } from "./types/check_api.type";
import Banner_Brief from "./Banner_Brief/Banner_Brief";
import Check_Run from "./Check_Run/Check_Run";

const sprite = "/sprite.svg";

export default function Creative_Check() {
  const { banners, add_banners, remove_banner } = useSelected_banners();
  const [brief, set_brief] = useState<Check_Brief>({});

  return (
    <section className={styles.section_creative_check}>
      <div className={styles.wrapper_n_header}>
        <Banner_Brief brief={brief} on_change={set_brief} />
        <Banner_Picker on_add={add_banners} />
        <Check_Run banners={banners} brief={brief} />
      </div>

      <p className={styles.text_selected} aria-live="polite">
        Selected: <span>{banners.length}</span>
      </p>

      <ul className={styles.wrapper_banners_list}>
        {banners.map((banner, index) => (
          <li className={styles.banner_element} key={banner.image_id}>
            <span className={styles.span_element}>
              {index + 1} - {banner.image_name}
            </span>
            <Banner_Preview banner={banner} />
            <button
              className={styles.btn_delete}
              type="button"
              aria-label={`Remove banner ${banner.image_name}`}
              onClick={() => remove_banner(banner.image_id)}
            >
              <svg className={styles.icon_bin} width={32} height={32}>
                <use xlinkHref={`${sprite}#icon-bin`} />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
