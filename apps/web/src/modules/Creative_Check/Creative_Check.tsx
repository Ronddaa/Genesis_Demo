// Path: apps/web/src/modules/Creative_Check/Creative_Check.tsx

"use client";

import { useState } from "react";
import Banner_Brief from "./Banner_Brief/Banner_Brief";
import Banner_Picker from "./Banner_Picker/Banner_Picker";
import Banner_Preview from "./Banner_Preview/Banner_Preview";
import Check_Run from "./Check_Run/Check_Run";
import { useBanner_checks } from "./hooks/use_banner_checks.hook";
import { useSelected_banners } from "./hooks/use_selected_banners.hook";
import type { Check_Brief } from "./types/check_api.type";
import styles from "./Creative_Check.module.scss";

const sprite = "/sprite.svg";

export default function Creative_Check() {
  const { banners, add_banners, remove_banner } = useSelected_banners();
  const { batch, is_running, validation_error, start_checks, retry_check } =
    useBanner_checks();

  const [brief, set_brief] = useState<Check_Brief>({});
  const [show_passed, set_show_passed] = useState(false);

  const states_by_image_id = new Map(
    batch?.items.map(({ banner, state }) => [banner.image_id, state] as const),
  );

  function handle_start() {
    set_show_passed(false);
    void start_checks(banners, brief);
  }

  return (
    <section className={styles.section_creative_check}>
      <div className={styles.wrapper_n_header}>
        <Banner_Brief brief={brief} on_change={set_brief} />
        <Banner_Picker on_add={add_banners} />

        <Check_Run
          batch={batch}
          selected_count={banners.length}
          is_running={is_running}
          validation_error={validation_error}
          show_passed={show_passed}
          on_start={handle_start}
          on_toggle_passed={() => set_show_passed((current) => !current)}
        />
      </div>

      <p className={styles.text_selected} aria-live="polite">
        Selected: <span>{banners.length}</span>
      </p>

      <ul className={styles.wrapper_banners_list}>
        {banners.map((banner, index) => {
          const state = states_by_image_id.get(banner.image_id);

          if (
            !show_passed &&
            state?.phase === "completed" &&
            state.result.status === "PASS"
          ) {
            return null;
          }

          return (
            <li className={styles.banner_element} key={banner.image_id}>
              <span className={styles.span_element}>
                {banner.image_name}
              </span>

              <Banner_Preview
                banner={banner}
                state={state}
                is_running={is_running}
                on_retry={() => void retry_check(banner.image_id)}
              />

              <button
                className={styles.btn_delete}
                type="button"
                aria-label={`Remove banner ${banner.image_name}`}
                onClick={() => remove_banner(banner.image_id)}
              >
                <svg
                  className={styles.icon_bin}
                  width={32}
                  height={32}
                  aria-hidden="true"
                >
                  <use href={`${sprite}#icon-bin`} />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}