import { createLocalStore } from "@/lib/local-store";
import type { WorkItem } from "@/lib/today-list/types";

const STORAGE_KEY = "today-list:items:v1";

export const itemsStore = createLocalStore<WorkItem[]>(STORAGE_KEY, []);
