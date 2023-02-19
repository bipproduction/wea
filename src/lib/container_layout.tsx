import {
  ActionIcon,
  Box,
  CloseButton,
  Container,
  Flex,
  Group,
  Paper,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import _ from "lodash";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { MdArrowBack, MdArrowBackIos } from "react-icons/md";

const ContainerLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <>
      <Stack>
        <Paper
          shadow={"md"}
          pos={"fixed"}
          bg={"white"}
          sx={{ zIndex: 2 }}
          w={"100%"}
        >
          <Flex align={"center"}>
            <ActionIcon size={32} m={"xs"} onClick={() => router.replace("/")}>
              <MdArrowBackIos size={32} />
            </ActionIcon>
            <Text>{_.upperCase(router.query.pid?.toString())}</Text>
          </Flex>
        </Paper>
        <Space h={50} />
        <Container p={"xs"} maw={720} miw={360}>
          {children}
        </Container>
      </Stack>
    </>
  );
};

export default ContainerLayout;
