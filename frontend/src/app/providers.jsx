"use client";

import { fetchNotifications } from "@/features/taskSlice";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

const NOTIFICATION_DURATION = 5000;
const RECONNECT_INTERVAL = 3000;
export function GlobalWebSocketProvider({ children }) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  const connectSocket = () => {
    if (!token) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
      return;
    const socket = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BASE_URL);
    socketRef.current = socket;
    socket.onopen = () => {
      try {
        const userId = jwtDecode(token).userId;
        socket.send(JSON.stringify({ type: "auth", userId }));
        console.log("WebSocket connected");
      } catch (e) {
        console.error("Failed to decode token or send auth:", e);
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
          toast.info(title, {
            description: description,
            duration: NOTIFICATION_DURATION,
            action: {
              label: "View",
              onClick: () => {
                window.location.href = `/t/${data.taskId}/details`;
              },
            },
          });
          dispatch(fetchNotifications());
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
          dispatch(fetchNotifications());
        } else if (eventName === "task_delete") {
          const id = toast.error(title, {
            description: description,
            duration: NOTIFICATION_DURATION,
            action: {
              label: "Okay",
              onClick: () => {
                toast.dismiss(id);
              },
            },
          });
          dispatch(fetchNotifications());
        }
      } catch (e) {
        console.error("WebSocket error:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection error");
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
      // Try reconnect if user still logged in
      if (token) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, RECONNECT_INTERVAL);
      } else {
        console.log("WebSocket disconnected, no token available");
      }
    };
  };

  const disconnectSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    if (token !== null && token !== "") {
      connectSocket();
    } else {
      disconnectSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <>
      <Toaster richColors position="bottom-right" />
      {children}
    </>
  );
}
