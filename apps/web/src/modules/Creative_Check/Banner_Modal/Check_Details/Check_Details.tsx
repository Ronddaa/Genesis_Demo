// Path: apps/web/src/modules/Creative_Check/Banner_Modal/Check_Details/Check_Details.tsx

import styles from "./Check_Details.module.scss";
import type { Check_State } from "../../hooks/use_banner_checks.hook";
import Status_Badge from "../Status_Badge/Status_Badge";
import {
  get_code_message,
  get_field_title,
} from "../../utils/get_check_text.util";

interface Check_Details_Props {
  state: Check_State | undefined;
}

function format_file_size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Check_Details({ state }: Check_Details_Props) {
  if (!state) {
    return (
      <p className={styles.text_muted}>
        This banner has not been checked yet. Fill in the brief and press `Check
        banners`.
      </p>
    );
  }

  if (state.phase === "queued") {
    return <p className={styles.text_muted}>Waiting in the queue...</p>;
  }

  if (state.phase === "running") {
    return <p className={styles.text_muted}>Checking the banner///</p>;
  }

  if (state.phase === "error") {
    return (
      <div className={styles.block_error} role="alert">
        <h3 className={styles.title}>Processing error</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  const { result } = state;

  return (
    <div className={styles.wrapper_block_details}>
      <article>
        <div className={styles.row_title}>
          <h3 className={styles.title}>Result</h3>
          <Status_Badge status={result.status} />
        </div>

        <dl className={styles.list_info}>
          <dt>Format</dt>
          <dd>{result.image.format.toUpperCase()}</dd>
          <dt>Size</dt>
          <dd>
            {result.image.width} x {result.image.height} px
          </dd>
          <dt>File</dt>
          <dd>{format_file_size(result.file_size_bytes)}</dd>
        </dl>
      </article>

      <ul className={styles.wrapper_checks}>
        {result.checks.map((check) => (
          <li
            key={check.field}
            className={`${styles.check_card} ${styles[`is_${check.status.toLowerCase()}`]}`}
          >
            <div className={styles.row_title}>
              <h4 className={styles.totle_check}>
                {get_field_title(check.field)}
              </h4>
              <Status_Badge status={check.status} />
            </div>

            <p className={styles.text_code}>{get_code_message(check.code)}</p>

            <dl className={styles.list_info}>
              <dt>Expected</dt>
              <dd>{check.expected}</dd>
              <dt>Found</dt>
              <dd>{check.observed ?? "Unknown"}</dd>
            </dl>

            {check.field === "language" && check.findings.length > 0 ? (
              <ul className={styles.wrapper_findings}>
                {check.findings.map((finding, i) => (
                  <li className={styles.finding} key={i}>
                    <span className={styles.text_location}>
                      {finding.location}
                    </span>
                    <q className={styles.text_evidence}>{finding.evidence}</q>
                    <span className={styles.text_language}>
                      {finding.observed ?? "Unknown"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              check.evidence && (
                <blockquote className={styles.text_evidence_block}>
                  {check.evidence}
                </blockquote>
              )
            )}
          </li>
        ))}
      </ul>

      <div className="">
        <h3 className={styles.title}>Text read from the banner</h3>
        <p className={styles.text_extracted}>
          {result.extracted_text || "No text was found"}
        </p>
      </div>
    </div>
  );
}
