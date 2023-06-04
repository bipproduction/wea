import Emiter from "events";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import {
  Button,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { val_coba } from "@/glb/val/coba";
import { useAtom } from "jotai";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { __state, useHookstate } from "@hookstate/core";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { hook_ip_address } from "@/glb/hook/ip_address";
import { hook_count_data } from "@/glb/hook/count_data";
import { hook_operator } from "@/glb/hook/operator";
import { ComTrueCaller } from "@/component/true_caller/true_caller";

export default function Home() {
  const [waNum, setWaNum] = useAtom(val_wa_num);
  const coba = useHookstate(hook_load_coba);

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
            <Paper p={"md"} shadow="xs">
              <SimpleGrid cols={2}>
                <Text>Ip</Text>
                <Title order={3}>{hook_ip_address.get()}</Title>
              </SimpleGrid>

              <SimpleGrid cols={2}>
                <Text>Urutan</Text>
                <Text>{coba.value.urutan}</Text>
              </SimpleGrid>
              <SimpleGrid cols={2}>
                <Text>Operator</Text>
                <Text>{hook_operator.get()}</Text>
              </SimpleGrid>
              <SimpleGrid cols={2}>
                <Text>Total</Text>
                <Title order={3}>{hook_count_data.get()}</Title>
              </SimpleGrid>

              <SimpleGrid cols={2}>
                <Text>Number</Text>
                <Title order={3}>+62{coba.value.nomer}</Title>
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
