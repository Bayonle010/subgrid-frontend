"use client";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { Button, Container, Input } from "@subgrid/ui";
import { PasswordRequirement } from "../components/pword-requirement";
import { TickIcon } from "@subgrid/ui/icons";
import { useResetPasswordScreen } from "../hooks/useAuth";

export const ResetPasswordScreen = () => {
  const { newPassword, confirmPassword, errors, isPending, requirements, handlePasswordChange, handleConfirmPasswordChange, handleResetPassword } =
    useResetPasswordScreen();

  return (
    <AuthWrapper authLabel="Set a new password." subAuthLabel="Choose a strong password to protect your account.">
      <Container as="form" onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <Container>
          <Input
            label="New password"
            required
            placeholder="Enter new password"
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
          />
          {newPassword && (
            <Container className="flex flex-wrap gap-1.5 mt-2">
              {requirements.map((req) => (
                <PasswordRequirement key={req.label} passed={req.passed} requirement={req.label} />
              ))}
            </Container>
          )}
        </Container>

        <Input
          label="Confirm password"
          required
          placeholder="Re-enter new password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />

        <Container className="pt-1">
          <Button
            rightIcon={<TickIcon size={18} />}
            type="submit"
            variant="primary"
            className="w-full"
            loading={isPending}
          >
            Save new password
          </Button>
        </Container>
      </Container>
    </AuthWrapper>
  );
};
