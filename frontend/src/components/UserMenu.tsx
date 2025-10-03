// src/components/UserMenu.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * Simple, robust UserMenu:
 * - uses a portal (renders to document.body) so it's always on top
 * - anchors near the button on desktop
 * - shows a bottom-sheet on mobile (touch-friendly)
 */

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // update mobile detection
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // open menu and calculate position (desktop)
  const handleToggle = (e: React.MouseEvent) => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    // anchor menu so it appears under the button; adjust left so it fits
    const menuWidth = 176;
    const left = Math.min(Math.max(8, rect.right - menuWidth), window.innerWidth - menuWidth - 8);
    const top = rect.bottom + window.scrollY + 8;
    setPos({ top, left });
    setOpen(true);
  };

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  // menu content (reused for both mobile & desktop)
  const menuContent = (
    <div className="flex flex-col">
      <button
        onClick={() => go("/login")}
        className="text-left w-full px-4 py-3 hover:bg-muted rounded"
      >
        Login
      </button>
      <button
        onClick={() => go("/signup")}
        className="text-left w-full px-4 py-3 hover:bg-muted rounded"
      >
        Signup
      </button>
      <button
        onClick={() => go("/orders")}
        className="text-left w-full px-4 py-3 hover:bg-muted rounded"
      >
        My Orders
      </button>
      <button
        onClick={() => go("/track")}
        className="text-left w-full px-4 py-3 hover:bg-muted rounded"
      >
        Track Order
      </button>
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="hover-gold focus:outline-none"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <User className="h-5 w-5" />
      </Button>

      {open &&
        createPortal(
          isMobile ? (
            // Mobile: full-screen overlay + bottom sheet
            <div className="fixed inset-0 z-[9999]">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
              />
              <div
                ref={menuRef}
                className="absolute bottom-0 left-0 right-0 bg-card p-4 rounded-t-xl shadow-lg"
              >
                <div className="mb-2 w-full flex justify-between items-center">
                  <div className="text-base font-semibold">Account</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 rounded hover:bg-muted"
                  >
                    Close
                  </button>
                </div>
                {menuContent}
              </div>
            </div>
          ) : (
            // Desktop: anchored small menu
            <div
              ref={menuRef}
              style={{
                position: "absolute",
                top: pos?.top ?? 0,
                left: pos?.left ?? 0,
                zIndex: 9999,
              }}
            >
              <div className="bg-card border border-border rounded-md shadow-lg w-44 p-1">
                {menuContent}
              </div>
            </div>
          ),
          document.body
        )}
    </>
  );
};

export default UserMenu;
