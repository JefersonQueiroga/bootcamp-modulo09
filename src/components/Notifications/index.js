import React, { useState, useEffect, useMemo } from "react";
import { MdNotifications } from "react-icons/md";
import { parseISO, formatDistance } from "date-fns";
import pt from "date-fns/locale/pt";

import api from "~/services/api";

import {
  Container,
  Badge,
  NotificationList,
  Scroll,
  Notification
} from "./styles";

/**  yarn add react-iconns */
export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /** Executa a função toda vida que existe modificações no array notifcations */
  const hasUnread = useMemo(
    () =>
      Boolean(notifications.find(notification => notification.read === false)),
    [notifications]
  );

  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get("notifications");

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        )
      }));

      setNotifications(data);
    }

    loadNotifications();
  }, []);

  function handleToggVisible() {
    setVisible(!visible);
  }

  async function handleMarkAsRead(id) {
    await api.put(`notifications/${id}`);
    setNotifications(
      notifications.map(notification =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  return (
    <Container>
      <Badge onClick={handleToggVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(notification => (
            <Notification key={notification._id} unread={!notification.read}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance}</time>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification._id)}
                  type="button"
                >
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
