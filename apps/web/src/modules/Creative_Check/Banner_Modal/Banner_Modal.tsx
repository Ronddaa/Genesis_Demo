/* eslint-disable @next/next/no-img-element */
// Path: apps/web/src/modules/Creative_Check/Banner_Modal/Banner_Modal.tsx

import { useEffect, useId, useRef } from "react";
import type { MouseEvent as React_Mouse_Event, SyntheticEvent } from "react";
import { Check_State } from "../hooks/use_banner_checks.hook";
import { Selected_Banner } from "../types/selected_banner.type";
import styles from "./Banner_Modal.module.scss";
import Status_Badge from "./Status_Badge/Status_Badge";
import Check_Details from "./Check_Details/Check_Details";

const sprite = "/sprite.svg";

interface Banner_Modal_Props {
  banner: Selected_Banner;
  state: Check_State | undefined;
  position: number;
  total: number;
  on_close: () => void;
}

export default function Banner_Modal({
  banner,
  state,
  position,
  total,
  on_close,
}: Banner_Modal_Props) {
  const dialog_ref = useRef<HTMLDialogElement>(null);
  const image_ref = useRef<HTMLImageElement>(null);
  const title_id = useId();

  useEffect(() => {
    const dialog = dialog_ref.current;

    if (!dialog) return;

    const previous_focus = document.activeElement as HTMLElement | null;
    const previous_overflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous_overflow;

      if (dialog.open) dialog.close();

      if (previous_focus?.isConnected) previous_focus.focus();
    };
  }, []);

  useEffect(() => {
    const image = image_ref.current;

    if (!image) return;

    const image_url = URL.createObjectURL(banner.file);
    image.src = image_url;

    return () => {
      URL.revokeObjectURL(image_url);
    };
  }, [banner.file]);

  function handle_close(event: SyntheticEvent<HTMLDialogElement>) {
    if (event.currentTarget.open) return;

    on_close();
  }

  function handle_click(event: React_Mouse_Event<HTMLDialogElement>) {
    if (event.target === event?.currentTarget) on_close();
  }

  return (
    <dialog
      ref={dialog_ref}
      className={styles.dialog}
      aria-labelledby={title_id}
      onClose={handle_close}
      onClick={handle_click}
    >
      <div className={styles.layout}>
        <header className={styles.header}>
          <h2 className={styles.title} id={title_id} title={banner.image_name}>
            {banner.image_name}
          </h2>

          {state?.phase === "completed" && (
            <Status_Badge status={state.result.status} />
          )}

          <span className={styles.text_counter} aria-live="polite">
            {position} / {total}
          </span>

          <button
            className={styles.btn_icon}
            type="button"
            aria-label="Close"
            title="Close (Esc)"
            onClick={on_close}
          >
            <svg
              className={styles.icon}
              width={24}
              height={24}
              aria-hidden="true"
            >
              <use href={`${sprite}#icon-close`} />
            </svg>
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.viewer}>
            <img
              className={styles.image}
              ref={image_ref}
              alt={banner.image_name}
            />
          </div>
          <aside className={styles.panel} aria-label="Check details">
            <Check_Details state={state} />
          </aside>
        </div>
      </div>
    </dialog>
  );
}
