"use client";
import { Badge } from "@/components/ui/badge";
import { hideLoader, showLoader } from "@/features/loaderSlice";
import { fetchNotifications } from "@/features/taskSlice";
import { formatDateTime } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationPage() {
  const { notifications, loading } = useSelector((state) => state.task);
  const initRef = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    dispatch(fetchNotifications());
  }, []);

  const bgColor = (event) => {
    switch (event) {
      case "task_add":
        return "bg-green-100";
      case "task_update":
        return "bg-blue-100";
      case "task_delete":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const textColor = (event) => {
    return "text-gray-800";
  };

  useEffect(() => {
    if (loading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [loading]);

  return (
    <>
      <div className="min-h-screen">
        <h1 className="text-2xl font-bold mt-10 mb-2">NOTIFICATIONS</h1>
        <hr className="mb-6" />
        <div className="w-full">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b my-1 rounded px-3 pb-4 mb-6 grid grid-cols-4 ${bgColor(
                notification.event
              )}`}
            >
              <div className="col-span-3">
                <div className="-mt-3">
                  <Badge variant="secondary" className="bg-gray-300 text-black">
                    <CalendarIcon />
                    {formatDateTime(notification.timestamp)}
                  </Badge>
                </div>
                <h2
                  className={`mt-1 font-semibold text-lg ${textColor(
                    notification.event
                  )}`}
                >
                  {notification.title}
                </h2>
                <p className="text-lg">{notification.description}</p>
              </div>
              <div className="col-span-4 md:col-span-1 text-right md:mt-6">
                <div className="text-sm text-gray-800">
                  {notification.taskId &&
                    notification.event != "task_delete" && (
                      <Link
                        href={`/t/${notification.taskId}/details`}
                        className="text-white rounded-md px-3 py-2 bg-gray-800 hover:bg-black"
                      >
                        View
                      </Link>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
