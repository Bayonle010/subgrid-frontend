import { Container, Text } from "@subgrid/ui";
import Image from "next/image";

export const AuthTabs = ({
  path,
  textValue,
}: {
  path: string;
  textValue: string;
}) => {
  return (
    <Container className="flex items-center px-6 py-3 gap-2 rounded-full border border-white/30 backdrop-blur-md bg-linear-to-b from-[#FAFAFA]/10 to-[#FFFFFF]/20">
      <Image width={24} height={24} src={path} alt="image-value" />
      <Text variant="bodyRegular" className="text-inverted">
        {textValue}
      </Text>
    </Container>
  );
};
