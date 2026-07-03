"use client";
import { Button, Container, Input, Text } from "@subgrid/ui";
import { AuthWrapper } from "../components/wrappers/auth-wrapper";
import { PasswordRequirement } from "../components/pword-requirement";
import { TermsPolicy } from "../components/terms-policy";
import { NextIcon } from "@subgrid/ui/icons";
import { useRouter } from "next/navigation";
import { useRegisterScreen } from "../hooks/useAuth";

export const RegisterScreen = () => {
  const router = useRouter();
  const {
    formData,
    errors,
    agreedToTerms,
    setAgreedToTerms,
    handleChange,
    handleRegister,
    isPending,
    requirements,
    allRequirementsMet,
  } = useRegisterScreen();

  return (
    <AuthWrapper
      authLabel="Create your account."
      subAuthLabel="Start accepting subscription payments in minutes."
    >
      <Container as="form" onSubmit={handleRegister} className="flex flex-col gap-4">
        <Container className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            required
            placeholder="Ada"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
          />
          <Input
            label="Last name"
            required
            placeholder="Obi"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
          />
        </Container>

        <Input
          label="Business name"
          required
          placeholder="Acme Inc."
          value={formData.businessName}
          onChange={handleChange("businessName")}
          error={errors.businessName}
        />

        <Input
          label="Business email"
          required
          placeholder="hello@acme.com"
          type="email"
          value={formData.businessEmail}
          onChange={handleChange("businessEmail")}
          error={errors.businessEmail}
        />

        <Input
          label="Personal email"
          required
          placeholder="you@email.com"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          error={errors.email}
        />

        <Container>
          <Input
            label="Password"
            required
            placeholder="Create a strong password"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
          />
          {formData.password && (
            <Container className="flex flex-wrap gap-1.5 mt-2">
              {requirements.map((req) => (
                <PasswordRequirement
                  key={req.label}
                  passed={req.passed}
                  requirement={req.label}
                />
              ))}
            </Container>
          )}
        </Container>

        <TermsPolicy checked={agreedToTerms} onChange={setAgreedToTerms} />

        <Container className="pt-1">
          <Button
            rightIcon={<NextIcon />}
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!agreedToTerms || !allRequirementsMet || isPending}
            loading={isPending}
          >
            Create account
          </Button>
        </Container>
      </Container>

      <Container className="mt-6 text-center">
        <Text variant="bodySmall" className="text-secondary">
          Already have an account?{" "}
          <Container as="span">
            <Container onClick={() => router.push("/login")} as="button" className="cursor-pointer">
              <Text variant="bodySmall" className="text-brand-text-icons font-medium hover:underline">
                Sign in
              </Text>
            </Container>
          </Container>
        </Text>
      </Container>
    </AuthWrapper>
  );
};
