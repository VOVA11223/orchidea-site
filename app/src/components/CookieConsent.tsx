"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="max-w-[900px] mx-auto bg-white rounded-2xl border border-neutral-200 shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-neutral-600 flex-1">
          Мы используем файлы cookie для улучшения работы сайта и анализа посещаемости. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie в соответствии с{" "}
          <Link href="/privacy" className="text-primary-600 underline hover:text-primary-500 transition-colors">
            Политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="w-full sm:w-auto flex-shrink-0 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 transition-colors rounded-full font-semibold text-white text-sm"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
