"use client";
import { items } from "@/app/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { TheoLogo } from "./Theo";
import { useNotification } from "@/app/hooks/useNotifications";
import { SquarePen } from "lucide-react";
import { useApi } from "@/app/hooks/useApi";
import { ConversationStatus } from "@/app/lib/api";
import { redirect } from "next/navigation";

export function AppSidebar() {
  const { user } = useUser();
  const [pathname, setPathname] = useState<string>("");
  const { addNotification } = useNotification();
  const api = useApi();
  const [conversations, setConversations] = useState<ConversationStatus[]>([]);
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const fetchConversations = useCallback(() => {
    (async () => {
      if (!user) return;

      try {
        setLoadingConversations(true);
        const response = await api.getConversations();
        if (response.error) {
          console.error(response.error);
          addNotification(
            "error",
            "Failed to load conversations",
            "conversations"
          );
          return;
        }

        if (response.data) {
          const sortedConversations = response.data.sort((a, b) => {
            return b.id - a.id;
          });

          setConversations(sortedConversations);
        }
      } catch (error) {
        console.error(error);
        addNotification(
          "error",
          "Failed to load conversations",
          "conversations"
        );
      } finally {
        setLoadingConversations(false);
      }
    })();
  }, [user, addNotification, api]);

  useEffect(() => {
    fetchConversations();
  }, [user, fetchConversations]);

  const handleNewConversation = async () => {
    redirect("/");
  };

  return (
    <Sidebar>
      <SidebarContent className="px-3 py-2.5 bg-primaryCard">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="p-2">
            {user ? (
              <div className="flex gap-2 items-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-[25px] h-[25px]",
                    },
                  }}
                />
                <p className="text-sm text-slate-100">{user?.fullName}</p>
              </div>
            ) : (
              <TheoLogo />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="p-2" asChild>
                    <a
                      href={user ? item.url : "#"}
                      onClick={() => {
                        if (!user) {
                          addNotification(
                            "warning",
                            "Please sign in to access Theo",
                            "theo"
                          );
                        }
                      }}
                      className={`${
                        user ? "cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {!user ? (
                        <item.lock />
                      ) : pathname == item.url ? (
                        <item.activeIcon />
                      ) : (
                        <item.icon />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          {user && (
            <div className="mt-5">
              <div className="flex justify-between items-center mb-3  p-2">
                <p className="text-md">Conversations</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {" "}
                      <SquarePen onClick={handleNewConversation} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <SidebarGroupContent>
                <SidebarMenu className="">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-gray-400 p-2">
                      {loadingConversations
                        ? "Loading..."
                        : "No conversations yet"}
                    </p>
                  ) : (
                    conversations.map((conversation, i) => (
                      <SidebarMenuItem key={conversation.id}>
                        <SidebarMenuButton className="p-2" asChild>
                          <a
                            href={`/chat/${conversation.id}`}
                            className="text-sm text-gray-300"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              display: "block",
                            }}
                          >
                            {conversation.title ||
                              `Conversation ${conversations.length - i}`}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
