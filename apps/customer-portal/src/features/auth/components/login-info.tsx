import { Container, Text } from "@subgrid/ui";
import Image from "next/image";

export const LoginInfo = () => {
  return (
    <Container className="bg-surface p-4 rounded-2xl">
      <Container className="flex gap-2 items-center">
        <Image
          width={16}
          height={16}
          src={"/assets/svgs/light-bulb.svg"}
          alt=""
        />
        <Text className="text-primary" variant="bodyXSmall">
          Please Note
        </Text>
      </Container>
      <Container className="flex gap-2 items-center mt-2">
        <Text variant="bodyXSmall" className="text-secondary">
          Having trouble logging in? Contact your manager or email
          <Container>
            <Text className="text-primary" variant="bodyXSmall">
              support@resonanceclean.co.uk
            </Text>
          </Container>
        </Text>
      </Container>
    </Container>
  );
};
