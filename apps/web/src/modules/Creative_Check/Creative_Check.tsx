// Path: apps/web/src/modules/Creative_Check/Creative_Check.tsx

"use client";

import styles from "./Creative_Check.module.scss";
import Banner_Picker from "./Banner_Picker/Banner_Picker";
import Banner_Preview from "./Banner_Preview/Banner_Preview";
import { useSelected_banners } from "./hooks/use_selected_banners.hook";

export default function Creative_Check() {
  const { banners, add_banners, remove_banner } = useSelected_banners();

  return (
    <section className={styles.section_creative_check}>
      <Banner_Picker on_add={add_banners} />

      <p className={styles.text} aria-live="polite">
        Selected: {banners.length}
      </p>

      <ul className={styles.wrapper_banners_list}>
        {banners.map((banner, index) => (
          <li className={styles.banner_element} key={banner.image_id}>
            <span className={styles.span_element}>
              00{index + 1} - {banner.image_name}
            </span>
            <Banner_Preview banner={banner} />
            <button
              className={styles.btn_delete}
              type="button"
              aria-label={`Remove banner ${banner.image_name}`}
              onClick={() => remove_banner(banner.image_id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
