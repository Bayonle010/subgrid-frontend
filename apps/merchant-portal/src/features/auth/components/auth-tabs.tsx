import { Container, Text } from "@subgrid/ui";

export const AuthTabs = ({
  emoji,
  textValue,
}: {
  emoji: string;
  textValue: string;
}) => {
  return (
    <Container className="flex items-center px-6 py-3 gap-2 rounded-full border border-white/30 backdrop-blur-md bg-linear-to-b from-[#FAFAFA]/10 to-[#FFFFFF]/20">
      <span>{emoji}</span>
      <Text variant="bodyRegular" className="text-inverted">
        {textValue}
      </Text>
    </Container>
  );
};
