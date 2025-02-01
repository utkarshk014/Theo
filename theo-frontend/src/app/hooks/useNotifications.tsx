"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiXCircle,
  HiX,
  HiExclamationCircle,
} from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";

export type Notification = {
  Id: string;
  Type: "success" | "warning" | "error";
  Title: string;
  Description: string | null;
  Tag: string;
};

export interface INotificationService {
  notifications: Readonly<Notification[] | null>;

  addNotification(
    type: Notification["Type"],
    title: Notification["Title"],
    tag: Notification["Tag"],
    description?: Notification["Description"],
    timeToHide?: number
  ): Notification;

  removeNotificationByTag(tag: Notification["Tag"]): void;
}

export const NotificationContext = createContext<INotificationService>(
  null as never
);

export default function ShowNotification({
  title,
  description,
  type,
  handleClose,
}: {
  type: Notification["Type"];
  title: Notification["Title"];
  description?: Notification["Description"];
  handleClose: () => void;
}) {
  return (
    <>
      <div className={`mb-4 animate-enter-slow bg-primaryCard flex-shrink-0 max-w-sm w-full shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden rounded-[10px]`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === "success" ? (
                <HiOutlineCheckCircle
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              ) : type === "error" ? (
                <HiXCircle className="h-6 w-6 text-red-400" />
              ) : type === "warning" ? (
                <HiExclamationCircle className="h-6 w-6 text-orange-400" />
              ) : null}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-slate-200">{title}</p>
              {description ? (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              ) : null}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <HiX className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const NotificationContextProvider = React.memo(
  function NotificationContextProvider({ children }: React.PropsWithChildren) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const hideNotification = (notificationId: string) => {
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification.Id !== notificationId
        )
      );
    };

    const notificationService = useMemo<INotificationService>(() => {
      return {
        notifications,

        addNotification: (
          type: Notification["Type"],
          title: Notification["Title"],
          tag: Notification["Tag"],
          description?: Notification["Description"],
          timeToHide?: number
        ) => {
          const newNotification = {
            Type: type,
            Title: title,
            Tag: tag,
            Description: description ? description : null,
            Id: uuidv4(),
          };
          setNotifications((currentNotifications) => {
            return currentNotifications.concat(newNotification);
          });
          if (timeToHide !== -1) {
            window.setTimeout(() => {
              hideNotification(newNotification.Id);
            }, (timeToHide || 5) * 1000);
          }
          return newNotification;
        },

        removeNotificationByTag: (tag: Notification["Tag"]) => {
          setNotifications((currentNotifications) =>
            currentNotifications.filter(
              (notification) => notification.Tag !== tag
            )
          );
        },
      };
    }, [notifications]);

    return (
      <NotificationContext.Provider value={notificationService}>
        <div
          aria-live="assertive"
          className="fixed inset-0 z-60 flex max-h-screen overflow-y-auto overflow-x-hidden flex-col items-center justify-start px-4 py-6 pointer-events-none sm:p-6 sm:items-end sm:justify-start"
        >
          {notifications
            .slice()
            .reverse()
            .map((notification) => (
              <ShowNotification
                key={notification.Id}
                type={notification.Type}
                title={notification.Title}
                description={notification.Description}
                handleClose={() => hideNotification(notification.Id)}
              />
            ))}
        </div>
        {children}
      </NotificationContext.Provider>
    );
  }
);

export const useNotification = () => {
  const notifications = useContext(NotificationContext);
  return notifications;
};
