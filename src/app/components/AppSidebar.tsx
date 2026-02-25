// AppSidebar.tsx — Desktop left navigation sidebar.
// Collapsed (default): 48px icon-only with Tooltip labels.
// Expanded: 240px icon + label. Toggle with Cmd+B / sidebar trigger.

import { useLocation, useNavigate } from "react-router";
import {
  House,
  SquaresFour,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { GenieLogo } from "./GenieLogo";
import { InitialsAvatar } from "./InitialsAvatar";
import { T, font, TYPE } from "../tokens";

// ─── Nav items — mirrors the mobile tab bar ───────────────────
const NAV_ITEMS = [
  {
    id:    "home",
    label: "Home",
    path:  "/home",
    icon:  House,
    match: (p: string) => p === "/home",
  },
  {
    id:    "services",
    label: "Services",
    path:  "/home/services",
    icon:  SquaresFour,
    match: (p: string) => p.startsWith("/home/services"),
  },
  {
    id:    "activity",
    label: "Activity",
    path:  "/home/activity",
    icon:  ClockCounterClockwise,
    match: (p: string) => p === "/home/activity",
  },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      style={{
        backgroundColor: T.bg,
        borderRight: `1px solid ${T.border}`,
        fontFamily: font,
      }}
    >
      {/* ── Logo ────────────────────────────────────────────── */}
      <SidebarHeader
        style={{
          padding: "16px 12px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <SidebarMenuButton
          tooltip="Genie"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 8,
          }}
          onClick={() => navigate("/home")}
        >
          <GenieLogo size={24} color={T.cta} />
          <span
            style={{
              color: T.textPrimary,
              fontSize: TYPE.headline,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Genie
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* ── Navigation ──────────────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon     = item.icon;
                const isActive = item.match(location.pathname);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      onClick={() => navigate(item.path)}
                      style={{
                        color: isActive ? T.cta : T.navInactive,
                        backgroundColor: isActive ? "rgba(255,77,0,0.08)" : "transparent",
                        fontFamily: font,
                        fontSize: TYPE.subhead,
                        fontWeight: isActive ? 600 : 400,
                        gap: 12,
                        transition: "background-color 0.15s, color 0.15s",
                      }}
                    >
                      <Icon
                        size={20}
                        weight={isActive ? "fill" : "regular"}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Profile footer ──────────────────────────────────── */}
      <SidebarFooter style={{ borderTop: `1px solid ${T.border}`, padding: "8px" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname.startsWith("/home/profile")}
              tooltip="Profile"
              onClick={() => navigate("/home/profile")}
              style={{
                color: location.pathname.startsWith("/home/profile") ? T.cta : T.navInactive,
                backgroundColor: location.pathname.startsWith("/home/profile")
                  ? "rgba(255,77,0,0.08)"
                  : "transparent",
                fontFamily: font,
                fontSize: TYPE.subhead,
                fontWeight: location.pathname.startsWith("/home/profile") ? 600 : 400,
                gap: 12,
                transition: "background-color 0.15s, color 0.15s",
              }}
            >
              <InitialsAvatar
                name="Dinesh Kumar"
                size={22}
                style={{
                  border: location.pathname.startsWith("/home/profile")
                    ? `1.5px solid ${T.cta}`
                    : undefined,
                  transition: "border-color 0.15s",
                  flexShrink: 0,
                }}
              />
              <span>Dinesh Kumar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
