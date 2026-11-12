import { redirect } from "next/navigation";

// Contact details now sit at the bottom of every page; keep old /contact links working
export default function Page() {
  redirect("/#contact");
}
