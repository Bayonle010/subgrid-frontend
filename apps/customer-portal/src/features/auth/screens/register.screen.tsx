"use client";
import { Button, Container, Input, PhoneInput, Text } from "@subgrid/ui";
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
    handlePhoneChange,
    handleRegister,
    isPending,
    requirements,
    allRequirementsMet,
  } = useRegisterScreen();

  return (
    <Container>
      <AuthWrapper authLabel="Create your account and get started.">
        <Container as="form" onSubmit={handleRegister}>
          <Container className="mb-4">
            <Input
              label="First Name"
              required
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange("first_name")}
              error={errors.first_name}
            />
          </Container>
          <Container className="mb-4">
            <Input
              label="Last Name"
              required
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleChange("last_name")}
              error={errors.last_name}
            />
          </Container>
          <Container className="mb-4">
            <Input
              label="Email Address"
              required
              placeholder="example@gmail.com"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
            />
          </Container>
          <Container className="mb-4">
            <PhoneInput
              label="Phone Number"
              required
              onChange={handlePhoneChange}
              error={errors.phone}
            />
          </Container>
          <Container className="mb-4">
            <Input
              label="Date of Birth"
              required
              type="date"
              value={formData.dob}
              onChange={handleChange("dob")}
              error={errors.dob}
            />
          </Container>
          <Container className="mb-4">
            <Input
              label="Password"
              required
              placeholder="Enter password"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              error={errors.password}
            />
          </Container>
          <Container className="flex items-center gap-2 flex-wrap">
            {requirements.map((req) => (
              <PasswordRequirement
                key={req.label}
                passed={req.passed}
                requirement={req.label}
              />
            ))}
          </Container>
          <Container className="mt-6">
            <TermsPolicy
              checked={agreedToTerms}
              onChange={setAgreedToTerms}
            />
          </Container>
          <Container className="mt-8 w-full">
            <Button
              rightIcon={<NextIcon />}
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!agreedToTerms || !allRequirementsMet || isPending}
              loading={isPending}
            >
              Create Account
            </Button>
          </Container>
        </Container>

        <Container className="mt-6">
          <Text className="text-center text-primary" variant="bodySmall">
            Already have an account?{"  "}
            <Container as="span">
              <Container onClick={() => router.push("/login")} as="button">
                <Text variant="button" className="text-brand-tertiary-text-icons">
                  Log in
                </Text>
              </Container>
            </Container>
          </Text>
        </Container>
      </AuthWrapper>
    </Container>
  );
};
