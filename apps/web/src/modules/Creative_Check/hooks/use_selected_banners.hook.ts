// Path: apps/web/src/modules/Creative_Check/hooks/use_selected_banners.hook.ts

import { useReducer } from "react";
import { Selected_Banner } from "../types/selected_banner.type";

interface Hashed_File {
  file: File;
  file_hash: string;
  image_id: string;
}

interface Selection_State {
  banners: Selected_Banner[];
  file_hashes: Map<string, string>;
  skipped_count: number;
  failed_count: number;
}

type Selection_Action =
  | { type: "add"; files: Hashed_File[]; failed_count: number }
  | { type: "remove"; image_id: string };

function create_initial_state(): Selection_State {
  return {
    banners: [],
    file_hashes: new Map(),
    skipped_count: 0,
    failed_count: 0,
  };
}

async function get_file_hash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function update_selection(
  state: Selection_State,
  action: Selection_Action,
): Selection_State {
  if (action.type === "remove") {
    const banners = state.banners.filter(
      (banner) => banner.image_id !== action.image_id,
    );

    const file_hashes = new Map(state.file_hashes);
    file_hashes.delete(action.image_id);

    return {
      ...state,
      banners,
      file_hashes,
      skipped_count: 0,
      failed_count: 0,
    };
  }

  const banners = [...state.banners];
  const file_hashes = new Map(state.file_hashes);
  const known_hashes = new Set(file_hashes.values());

  let skipped_count = 0;

  for (const { file, file_hash, image_id } of action.files) {
    if (known_hashes.has(file_hash)) {
      skipped_count += 1;
      continue;
    }

    known_hashes.add(file_hash);
    file_hashes.set(image_id, file_hash);

    banners.push({
      image_id,
      image_name: file.name,
      file,
    });

  }

  return {
    banners,
    file_hashes,
    skipped_count,
    failed_count: action.failed_count,
  };
}

export function useSelected_banners() {
  const [state, dispatch] = useReducer(
    update_selection,
    undefined,
    create_initial_state,
  );

  async function add_banners(files: File[]) {
    const hashed_files: Hashed_File[] = [];
    let failed_count = 0;

    for (const file of files) {
      try {
        const file_hash = await get_file_hash(file);

        hashed_files.push({
          file,
          file_hash,
          image_id: crypto.randomUUID(),
        });
      } catch {
        failed_count += 1;
      }
    }

    dispatch({ type: "add", files: hashed_files, failed_count });
  }

  function remove_banner(image_id: string) {
    dispatch({ type: "remove", image_id });
  }

  return {
    banners: state.banners,
    skipped_count: state.skipped_count,
    failed_count: state.failed_count,
    add_banners,
    remove_banner,
  };
}
