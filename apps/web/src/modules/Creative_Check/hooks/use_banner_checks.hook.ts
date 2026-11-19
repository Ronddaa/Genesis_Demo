// Path: apps/web/src/modules/Creative_Check/hooks/use_banner_checks.hook.ts

import { useEffect, useRef, useState } from "react";
import {
  Check_Api_Error,
  submit_image_check,
} from "../api/submit_image_check.api";
import type { Check_Brief, Image_Check_Result } from "../types/check_api.type";
import type { Selected_Banner } from "../types/selected_banner.type";
import { get_brief_error } from "../utils/get_brief_error.util";

const max_parallel_checks = 1;

export type Check_State =
  | { phase: "queued" }
  | { phase: "running" }
  | { phase: "completed"; result: Image_Check_Result }
  | { phase: "error"; message: string };

interface Check_Item {
  banner: Selected_Banner;
  state: Check_State;
}

interface Check_Batch {
  brief: Check_Brief;
  items: Check_Item[];
}

export function useBanner_checks() {
  const [batch, set_batch] = useState<Check_Batch | null>(null);
  const [is_running, set_is_running] = useState(false);
  const [validation_error, set_validation_error] = useState("");

  const active_request = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      active_request.current?.abort();
    };
  }, []);

  function update_item(image_id: string, state: Check_State) {
    set_batch((current_batch) => {
      if (!current_batch) return current_batch;

      return {
        ...current_batch,
        items: current_batch.items.map((item) =>
          item.banner.image_id === image_id ? { ...item, state } : item,
        ),
      };
    });
  }

  async function process_banners(
    banners: Selected_Banner[],
    brief: Check_Brief,
  ) {
    const controller = new AbortController();
    active_request.current = controller;
    set_is_running(true);

    let next_index = 0;

    async function run_worker() {
      while (!controller.signal.aborted && next_index < banners.length) {
        const banner = banners[next_index];
        next_index += 1;

        update_item(banner.image_id, { phase: "running" });

        try {
          const result = await submit_image_check(
            banner,
            brief,
            controller.signal,
          );

          if (!controller.signal.aborted) {
            update_item(banner.image_id, { phase: "completed", result });
          }
        } catch (error) {
          if (controller.signal.aborted) return;

          const message =
            error instanceof Check_Api_Error
              ? `${error.code}: ${error.message}`
              : "Could not read the API response. Please try again.";

          update_item(banner.image_id, { phase: "error", message });
        }
      }
    }

    try {
      const worker_count = Math.min(max_parallel_checks, banners.length);

      await Promise.all(
        Array.from({ length: worker_count }, () => run_worker()),
      );
    } finally {
      active_request.current = null;

      if (!controller.signal.aborted) {
        set_is_running(false);
      }
    }
  }

  async function start_checks(banners: Selected_Banner[], brief: Check_Brief) {
    if (active_request.current) return;

    const error = banners.length
      ? get_brief_error(brief)
      : "Select at least one banner.";

    set_validation_error(error ?? "");
    if (error) return;

    const selected_banners = [...banners];
    const selected_brief = { ...brief };

    set_batch({
      brief: selected_brief,
      items: selected_banners.map((banner) => ({
        banner,
        state: { phase: "queued" },
      })),
    });

    await process_banners(selected_banners, selected_brief);
  }

  async function retry_check(image_id: string) {
    if (active_request.current || !batch) return;

    const item = batch.items.find(
      (entry) => entry.banner.image_id === image_id,
    );

    if (!item || item.state.phase !== "error") return;

    await process_banners([item.banner], batch.brief);
  }

  return {
    batch,
    is_running,
    validation_error,
    start_checks,
    retry_check,
  };
}
