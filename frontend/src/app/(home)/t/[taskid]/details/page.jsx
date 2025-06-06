import TaskDetail from "@/components/TaskDetails";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function TaskDetailsPage({ params }) {
  const { taskid } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const res = await fetch(`${API_BASE_URL}/task/details/${taskid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const taskResp = await res.json();
  if (taskResp.success && taskResp.task) {
    return (
      <div>
        <TaskDetail task={taskResp.task} />
      </div>
    );
  } else {
    redirect("/404");
  }
}
