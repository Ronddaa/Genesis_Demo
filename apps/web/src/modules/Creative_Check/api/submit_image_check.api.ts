// Path: apps/web/src/modules/Creative_Check/api/submit_image_check.api.ts

import type { Check_Brief, Image_Check_Result } from "../types/check_api.type";
import { Selected_Banner } from "../types/selected_banner.type";

export class Check_Api_Error extends Error {
  constructor(
    public readonly http_status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "Check_Api_Error";
  }
}

const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
if (!api_base_url) {
  throw new Error("API_URL is required.");
}
const checks_url = `${api_base_url}/checks`;

export async function submit_image_check(
  banner: Selected_Banner,
  brief: Check_Brief,
  signal?: AbortSignal,
): Promise<Image_Check_Result> {
  const form_data = new FormData();

  form_data.append("image", banner.file);
  form_data.append("image_id", banner.image_id);

  const language = brief.language?.trim();
  const discount_percent = brief.discount_percent?.trim();
  const promo_code = brief.promo_code?.trim();

  if (language) form_data.append("language", language);
  if (discount_percent) form_data.append("discount_percent", discount_percent);
  if (promo_code) form_data.append("promo_code", promo_code);

  const response = await fetch(checks_url, {
    method: "POST",
    body: form_data,
    signal,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    const code = typeof body?.code === "string" ? body.code : "HTTP_ERROR";

    let message = `Request failed (HTTP ${response.status}).`;

    if (typeof body?.message === "string") {
      message = body.message;
    } else if (Array.isArray(body?.message)) {
      const messages = body.message.filter(
        (item: unknown): item is string => typeof item === "string",
      );

      if (messages.length > 0) message = messages.join(" ");
    }

    throw new Check_Api_Error(response.status, code, message);
  }

  const result: Image_Check_Result = await response.json();

  if (result.image_id !== banner.image_id) {
    throw new Check_Api_Error(
      response.status,
      "IMAGE_ID_MISMATCH",
      "The response belongs to a different banner.",
    );
  }

  return result;
}
