// src/components/UserAvatar.tsx
import React from "react";

type User = {
  name?: string;
  email?: string;
  image?: string;
};

export default function UserAvatar({ user }: { user: User }) {
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      return parts.map(p => p[0]?.toUpperCase()).slice(0, 2).join("");
    }
    if (email) return email[0]?.toUpperCase() || "U";
    return "U";
  };

  if (user?.image) {
    return (
      <img
        src={user.image}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border border-border"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold border border-border">
      {getInitials(user?.name, user?.email)}
    </div>
  );
}
