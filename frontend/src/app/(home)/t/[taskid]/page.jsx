import { redirect } from "next/navigation";

export default function RedirectToDetails({ params }) {
  const { taskid } = params;
  console.log("Redirecting to task details for taskid:", taskid);
  redirect(`/t/${taskid}/details`);
}
