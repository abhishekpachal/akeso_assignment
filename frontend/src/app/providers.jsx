"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const NOTIFICATION_DURATION=5000
export function GlobalWebSocketProvider({ children }) {
  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BASE_URL);

    socket.onopen = () => {
        const token = localStorage.getItem("token");
        if (token) {
            const userId = jwtDecode(token).userId;
            socket.send(JSON.stringify({ type: "auth", userId }));
        }
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const eventName = payload.event;
        const title = payload.title;
        const description = payload.description;
        const data = payload.data;
        console.log("WebSocket message received:", eventName, payload);
        if (eventName === "task_update") {
          toast.success(title, {
            description: description,
            duration: NOTIFICATION_DURATION,
            action: {
              label: "View",
              onClick: () => {
                window.location.href = `/t/${data.taskId}/details`;
              },
            },
          });
        } else if (eventName === "task_add") {
          toast.success(title, {
            description: description,
            duration: NOTIFICATION_DURATION,
            action: {
              label: "View",
              onClick: () => {
                window.location.href = `/t/${data.taskId}/details`;
              },
            },
          });
        } else if (eventName === "task_delete") {
          const id = toast.success(title, {
            description: description,
            duration: NOTIFICATION_DURATION,
            action: {
              label: "Okay",
              onClick: () => {
                toast.dismiss(id);
              },
            },
          });
        }
      } catch (e) {
        console.error("WebSocket error:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection error");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Toaster richColors position="bottom-right" />
      {children}
    </>
  );
}
