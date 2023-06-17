import { ComTrueCaller } from "@/component/true_caller/true_caller";
import { hook_count_data } from "@/glb/hook/count_data";
import { hook_cek } from "@/glb/hook/hook_cek";
import { hook_total } from "@/glb/hook/hook_total";
import { hook_true_number } from "@/glb/hook/hook_true_number";
import { hook_ip_address } from "@/glb/hook/ip_address";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { hook_operator } from "@/glb/hook/operator";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { useHookstate } from "@hookstate/core";
import {
  ActionIcon,
  CopyButton,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDidUpdate, useShallowEffect } from "@mantine/hooks";
import { useAtom } from "jotai";
import { useState } from "react";
import { MdContentCopy, MdWhatsapp } from "react-icons/md";
import toast from "react-simple-toasts";

export default function Home() {
  const [waNum, setWaNum] = useAtom(val_wa_num);
  const coba = useHookstate(hook_load_coba);
  const cek = useHookstate(hook_cek);
  const trueNumber = useHookstate(hook_true_number);
  const [ready, setReady] = useState(false);

  useShallowEffect(() => {
    return setReady(true);
  }, []);

  if (!ready) return <>wait ...</>;
  if (!coba.value)
    return (
      <>
        <Loader />
      </>
    );

  return (
    <>
      <Stack p={"md"} bg={"gray.1"} h={"100%"}>
        <Title>Makuro Wa</Title>
        <Grid>
          <Grid.Col span={"content"}>
            <Paper p={"md"} shadow="xs" w={400}>
              <SimpleGrid cols={2}>
                <Text>Ip</Text>
                <Title order={3}>{hook_ip_address.get()}</Title>
              </SimpleGrid>

              {/* <SimpleGrid cols={2}>
                <Text>Urutan</Text>
                <Text>{coba.value.urutan}</Text>
              </SimpleGrid> */}
              <SimpleGrid cols={2}>
                <Text>Operator</Text>
                <Text>{hook_operator.get()}</Text>
              </SimpleGrid>
              <SimpleGrid cols={2}>
                <Text>Total</Text>
                <Title order={3}>{hook_total.value}</Title>
              </SimpleGrid>

              <SimpleGrid cols={2}>
                <Text>Number</Text>
                <Title order={3} color="gray">
                  +62{cek.value}
                </Title>
              </SimpleGrid>
              <SimpleGrid cols={2}>
                <Text>True Number</Text>
                <Stack spacing={0}>
                  <Title order={3} color="green">
                    +62{trueNumber.value}
                  </Title>
                  {trueNumber.value && (
                    <Group align="center">
                      <CopyButton value={trueNumber.value.toString()}>
                        {({ copied, copy }) => (
                          <ActionIcon
                            onClick={() => {
                              copy();
                              toast("copied");
                            }}
                            color={copied ? "teal" : "blue"}
                          >
                            <MdContentCopy />
                          </ActionIcon>
                        )}
                      </CopyButton>
                      <ActionIcon
                        color="green"
                        onClick={() => window.open(`wa.me/62${waNum}`)}
                      >
                        <MdWhatsapp />
                      </ActionIcon>
                    </Group>
                  )}
                </Stack>
              </SimpleGrid>
            </Paper>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Paper p={"md"} shadow="xs">
              <Stack>
                <ComTrueCaller />
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
}
