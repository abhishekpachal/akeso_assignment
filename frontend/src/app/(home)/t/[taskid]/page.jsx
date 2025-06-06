import { redirect } from "next/navigation";

export default function RedirectToDetails({ params }) {
  const { taskid } = params;
  redirect(`/t/${taskid}/details`);
}
