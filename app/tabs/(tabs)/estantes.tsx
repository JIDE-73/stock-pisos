import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';

export default function Estantes() {
  return (
    <Center className="flex-1">
      <Box className="items-center">
        <Heading className="font-bold text-2xl">Estantes</Heading>
        <Divider className="my-[30px] w-[80%]" />
        <Text className="p-4 text-center">
          Gestión de estantes
        </Text>
      </Box>
    </Center>
  );
}

