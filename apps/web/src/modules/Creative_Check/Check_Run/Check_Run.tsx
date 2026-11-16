// Path: apps/web/src/modules/Creative_Check/Check_Run/Check_Run.tsx

import type { useBanner_checks } from "../hooks/use_banner_checks.hook";
import styles from "./Check_Run.module.scss";

type Banner_Checks = ReturnType<typeof useBanner_checks>;

interface Check_Run_Props {
  batch: Banner_Checks["batch"];
  selected_count: number;
  is_running: boolean;
  validation_error: Banner_Checks["validation_error"];
  show_passed: boolean;
  on_start: () => void;
  on_toggle_passed: () => void;
}

export default function Check_Run({
  batch,
  selected_count,
  is_running,
  validation_error,
  show_passed,
  on_start,
  on_toggle_passed,
}: Check_Run_Props) {
  const items = batch?.items ?? [];
  const counts = { PASS: 0, FAIL: 0, REVIEW: 0, error: 0 };

  for (const { state } of items) {
    if (state.phase === "completed") {
      counts[state.result.status] += 1;
    }

    if (state.phase === "error") {
      counts.error += 1;
    }
  }

  const finished_count =
    counts.PASS + counts.FAIL + counts.REVIEW + counts.error;

  return (
    <div className={styles.block_check_run}>
      <button
        className={styles.is_running_btn}
        type="button"
        disabled={is_running || selected_count === 0}
        onClick={on_start}
      >
        {is_running ? "Checking..." : `Check banners (${selected_count})`}
      </button>

      {validation_error && <p role="alert">{validation_error}</p>}

      <h3>Results:</h3>

      <ul className={styles.wrapper_finished_count}>
        <li className={styles.count_element}>
          Processed: <span>{finished_count}</span> of <span>{items.length}</span>
        </li>

        <li className={styles.count_element}>
          Passed:{" "}
          <span className={counts.PASS ? styles.span_success : styles.span_default}>
            {counts.PASS}
          </span>
        </li>

        <li className={styles.count_element}>
          With issues:{" "}
          <span className={counts.FAIL ? styles.span_error : styles.span_default}>
            {counts.FAIL}
          </span>
        </li>

        <li className={styles.count_element}>
          Needs review:{" "}
          <span className={counts.REVIEW ? styles.span_review : styles.span_default}>
            {counts.REVIEW}
          </span>
        </li>

        <li className={styles.count_element}>
          Processing errors:{" "}
          <span className={counts.error ? styles.span_error : styles.span_default}>
            {counts.error}
          </span>
        </li>
      </ul>

      {counts.PASS > 0 && (
        <button
          className={styles.show_passed_btn}
          type="button"
          aria-pressed={show_passed}
          onClick={on_toggle_passed}
        >
          {show_passed ? "Hide passed banners" : "Show passed banners"}
        </button>
      )}
    </div>
  );
}
