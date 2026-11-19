// Path: apps/web/src/modules/Creative_Check/Banner_Modal/Status_Badge/Status_Badge.tsx

import styles from "./Status_Badge.module.scss";
import type { Check_Status } from "../../types/check_api.type";

interface Status_Badge_Props {
  status: Check_Status;
}

const status_classes: Record<Check_Status, string> = {
  PASS: styles.is_pass,
  FAIL: styles.is_fail,
  REVIEW: styles.is_review,
};

export default function Status_Badge({ status }: Status_Badge_Props) {
  return (
    <span className={`${styles.badge} ${status_classes[status]}`}>
      {status}
    </span>
  );
}
