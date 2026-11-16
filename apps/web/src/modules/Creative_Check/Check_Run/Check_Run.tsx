// Path: apps/web/src/modules/Creative_Check/Check_Run/Check_Run.tsx

import { useState } from "react";
import { useBanner_checks } from "../hooks/use_banner_checks.hook";
import { Check_Brief } from "../types/check_api.type";
import { Selected_Banner } from "../types/selected_banner.type";
import styles from "./Check_Run.module.scss";

interface Check_Run_Props {
  banners: Selected_Banner[];
  brief: Check_Brief;
}

export default function Check_Run({ banners, brief }: Check_Run_Props) {
  const { batch, is_running, validation_error, start_checks, retry_check } =
    useBanner_checks();

  const [show_passed, set_show_passed] = useState(false);

  const items = batch?.items ?? [];
  const counts = { PASS: 0, FAIL: 0, REVIEW: 0, error: 0 };

  for (const { state } of items) {
    if (state.phase === "completed") counts[state.result.status] += 1;
    if (state.phase === "error") counts.error += 1;
  }

  const finished_count =
    counts.PASS + counts.FAIL + counts.REVIEW + counts.error;

  return (
    <div className={styles.block_check_run}>
      <button
        className={styles.is_running_btn}
        type="button"
        disabled={is_running || banners.length === 0}
        onClick={() => {
          set_show_passed(false);
          void start_checks(banners, brief);
        }}
      >
        {is_running ? "Checking..." : `Check banners (${banners.length})`}
      </button>

      {validation_error && <p role="alert">{validation_error}</p>}

      <h3>Results:</h3>

      <ul className={styles.wrapper_finished_count}>
        <li className={styles.count_element}>
          Processed: <span>{finished_count}</span> of{" "}
          <span>{items.length}</span>
        </li>
        <li className={styles.count_element}>
          Passed:{" "}
          <span
            className={
              items.length === 0 ? styles.span_default : styles.span_success
            }
          >
            {counts.PASS}
          </span>
        </li>
        <li className={styles.count_element}>
          With issues:{" "}
          <span
            className={
              items.length === 0 ? styles.span_default : styles.span_error
            }
          >
            {counts.FAIL}
          </span>
        </li>
        <li className={styles.count_element}>
          Needs review:{" "}
          <span
            className={
              items.length === 0 ? styles.span_default : styles.span_review
            }
          >
            {counts.REVIEW}
          </span>
        </li>
        <li className={styles.count_element}>
          Processing errors:{" "}
          <span
            className={
              items.length === 0 ? styles.span_default : styles.span_error
            }
          >
            {counts.error}
          </span>
        </li>
      </ul>

      {counts.PASS > 0 && (
        <button
        className={styles.show_passed_btn}
          type="button"
          aria-pressed={show_passed}
          onClick={() => set_show_passed((current) => !current)}
        >
          {show_passed ? "Hide passed banners" : "Show passed banners"}
        </button>
      )}

      {batch && (
        <>
          <ul>
            {items.map(({ banner, state }, index) => {
              if (state.phase === "queued" || state.phase === "running") {
                return null;
              }

              if (state.phase === "error") {
                return (
                  <li key={banner.image_id}>
                    <h4>
                      {index + 1}. {banner.image_name}
                    </h4>
                    <p>Processing error: {state.message}</p>

                    <button
                      type="button"
                      disabled={is_running}
                      onClick={() => void retry_check(banner.image_id)}
                    >
                      Retry
                    </button>
                  </li>
                );
              }

              const result = state.result;

              if (result.status === "PASS" && !show_passed) return null;

              return (
                <li key={banner.image_id}>
                  <h4>
                    {index + 1}. {banner.image_name} — {result.status}
                  </h4>

                  <ul>
                    {result.checks.map((check) => (
                      <li key={check.field}>
                        <strong>{check.field}</strong>: {check.status}
                        {check.status !== "PASS" && (
                          <>
                            <p>Expected: {check.expected}</p>
                            <p>Observed: {check.observed ?? "Unknown"}</p>

                            {check.field === "language" ? (
                              <ul>
                                {check.findings.map(
                                  (finding, finding_index) => (
                                    <li key={finding_index}>
                                      {finding.location}: {finding.evidence}
                                      {" · "}
                                      {finding.observed ?? "Unknown"}
                                    </li>
                                  ),
                                )}
                              </ul>
                            ) : (
                              check.evidence && <p>{check.evidence}</p>
                            )}

                            {check.code === "REQUIRED_VALUE_MISSING" && (
                              <p>
                                The required value is missing from the banner.
                              </p>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
