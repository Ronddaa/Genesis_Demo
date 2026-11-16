// Path: apps/web/src/modules/Creative_Check/Banner_Brief/Banner_Brief.tsx

import { Check_Brief } from "../types/check_api.type";
import styles from "./Banner_Brief.module.scss";

interface Banner_Brief_Props {
  brief: Check_Brief;
  on_change: (brief: Check_Brief) => void;
}

export default function Banner_Brief({ brief, on_change }: Banner_Brief_Props) {
  function update_field(field: keyof Check_Brief, value: string) {
    on_change({
      ...brief,
      [field]: value,
    });
  }

  return (
    <div className={styles.block_banner_brief}>
      <h2>Compaing Brief</h2>

      <div className={styles.wrapper_input}>
        <label className={styles.label_brief} htmlFor="brief_language">Check Language</label>
        <input
          className={styles.input_brief}
          type="text"
          id="brief_language"
          value={brief.language ?? ""}
          onChange={(event) =>
            update_field("language", event.currentTarget.value.toLowerCase())
          }
          placeholder="e.g. it (italian)"
          pattern="[a-z]{2}"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>
      <div className={styles.wrapper_input}>
        <label className={styles.label_brief} htmlFor="discount">Exact discount (%)</label>
        <input
          className={styles.input_brief}
          type="text"
          id="discount"
          value={brief.discount_percent ?? ""}
          onChange={(event) =>
            update_field(
              "discount_percent",
              event.currentTarget.value.toLowerCase(),
            )
          }
          placeholder="e.g. 20"
          pattern="([1-9][0-9]?|100)"
          maxLength={3}
        />
      </div>
      <div className={styles.wrapper_input}>
        <label className={styles.label_brief} htmlFor="promo_code">Promo Code</label>
        <input
          className={styles.input_brief}
          type="text"
          id="promo_code"
          value={brief.promo_code ?? ""}
          onChange={(event) =>
            update_field("promo_code", event.currentTarget.value)
          }
          placeholder="e.g. VERA"
          maxLength={128}
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
