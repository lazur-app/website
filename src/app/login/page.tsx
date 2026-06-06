"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { isSafeReturnPath } from "@/lib/returnTo";

function LoginPageInner() {
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo = isSafeReturnPath(rawReturnTo) ? rawReturnTo : undefined;

  return <LoginForm source="web" returnTo={returnTo} />;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}
