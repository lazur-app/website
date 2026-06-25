import { redirect } from "next/navigation";
import { EXCLUSIVE_ACCESS_PATH } from "@/lib/exclusiveAccess";

export default function DownloadPage() {
  redirect(EXCLUSIVE_ACCESS_PATH);
}
