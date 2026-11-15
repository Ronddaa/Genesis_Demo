// Path: apps/web/src/modules/Creative_Check/types/check_api.type.ts

export interface Check_Brief {
  language?: string;
  discount_percent?: string;
  promo_code?: string;
}

export type Check_Status = "PASS" | "FAIL" | "REVIEW";

export type Language_Location =
  | "headline"
  | "button"
  | "offer"
  | "caption"
  | "other";

export interface Language_Finding {
  location: Language_Location;
  observed: string | null;
  evidence: string;
}

export interface Base_Field_Check {
  status: Check_Status;
  code: string;
  expected: string;
  observed: string | null;
  evidence: string | null;
}

export interface Discount_Check extends Base_Field_Check {
  field: "discount_percent";
}

export interface Language_Check extends Base_Field_Check {
  field: "language";
  location: Language_Location | null;
  findings: Language_Finding[];
}

export interface Promo_Code_Check extends Base_Field_Check {
  field: "promo_code";
}

export type Field_Check = Discount_Check | Language_Check | Promo_Code_Check;

export interface Image_Check_Result {
  image_id: string;
  processing_status: "completed";
  status: Check_Status;
  file_size_bytes: number;
  image: {
    format: "png" | "jpeg";
    width: number;
    height: number;
  };
  extracted_text: string;
  checks: Field_Check[];
}
