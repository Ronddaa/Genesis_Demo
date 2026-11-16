/* eslint-disable @next/next/no-img-element */
// Path: apps/web/src/modules/Creative_Check/Banner_Preview/Banner_Preview.tsx

import { useEffect, useRef } from "react";
import type { useBanner_checks } from "../hooks/use_banner_checks.hook";
import type { Selected_Banner } from "../types/selected_banner.type";
import styles from "./Banner_Preview.module.scss";

type Check_Batch = NonNullable<ReturnType<typeof useBanner_checks>["batch"]>;
type Banner_Check_State = Check_Batch["items"][number]["state"];

interface Banner_Preview_Props {
  banner: Selected_Banner;
  state: Banner_Check_State | undefined;
  is_running: boolean;
  on_retry: () => void;
}

export default function Banner_Preview({
  banner,
  state,
  is_running,
  on_retry,
}: Banner_Preview_Props) {
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
        ref={image_ref}
        className={styles.banner_image}
        alt={banner.image_name}
      />

      {state?.phase === "queued" && <p>Queued</p>}
      {state?.phase === "running" && <p>Checking...</p>}

      {state?.phase === "error" && (
        <div>
          <p>Processing error: {state.message}</p>

          <button type="button" disabled={is_running} onClick={on_retry}>
            Retry
          </button>
        </div>
      )}

      {state?.phase === "completed" && (
        <div
          className={`${styles.wrapper_info} ${state.result.status === "FAIL" ? styles.wrapper_info_error : ""} ${state.result.status === "REVIEW" ? styles.wrapper_info_warning : ""}`}
        >
          <p>
            Result: <strong>{state.result.status}</strong>
          </p>

          <ul>
            {state.result.checks.map((check) => (
              <li key={check.field}>
                <strong>{check.field}</strong>: {check.status}
                {check.status !== "PASS" && (
                  <>
                    <p>Expected: {check.expected}</p>
                    <p>Observed: {check.observed ?? "Unknown"}</p>

                    {check.field === "language" && check.findings.length > 0 ? (
                      <ul>
                        {check.findings.map((finding, finding_index) => (
                          <li key={finding_index}>
                            {finding.location}: {finding.evidence}
                            {" · "}
                            {finding.observed ?? "Unknown"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      check.evidence && <p>{check.evidence}</p>
                    )}

                    {check.code === "REQUIRED_VALUE_MISSING" && (
                      <p>The required value is missing from the banner.</p>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
