import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadResume(resume: File, token: string) {
  const formData = new FormData();
  formData.append("resume", resume);
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/resume/upload/${resume.name}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { key } = (await res.json()) as { key: string };
  return key;
}
