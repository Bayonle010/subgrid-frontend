import { VerifyEmailScreen } from "@/features/auth/screens/verify-email.screen";
import React, { Suspense } from "react";

function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailScreen />
    </Suspense>
  );
}

export default VerifyEmail;
