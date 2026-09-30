import { useState, useCallback } from "react";
import type { Notification } from "@/lib/data";

let idCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification["type"] = "success") => {
    const id = `notif-${++idCounter}`;
    const notification: Notification = { id, message, type, timestamp: Date.now() };
    setNotifications(prev => [notification, ...prev]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, addNotification, removeNotification, clearAll };
}
