"use client";

import { useState } from "react";
import LoginModal from "@/components/LoginModal";

export default function LoginPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div dir="rtl" className="min-h-screen bg-[#0d0e15] flex items-center justify-center p-4">
      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
