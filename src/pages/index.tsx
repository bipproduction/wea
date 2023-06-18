import { ComTrueCaller } from "@/component/true_caller/true_caller";
import { hook_cek } from "@/glb/hook/hook_cek";
import { hook_listnumber } from "@/glb/hook/hook_list_number";
import { hook_total } from "@/glb/hook/hook_total";
import { hook_true_number } from "@/glb/hook/hook_true_number";
import { hook_ip_address } from "@/glb/hook/ip_address";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { hook_operator } from "@/glb/hook/operator";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { useHookstate, useHookstateCallback } from "@hookstate/core";
import {
  ActionIcon,
  Alert,
  CopyButton,
  Flex,
  Grid,
  Group,
  Loader,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  MdCheck,
  MdContentCopy,
  MdLooks,
  MdSearch,
  MdSend,
  MdWhatsapp,
} from "react-icons/md";
import toast from "react-simple-toasts";
import { QRCodeSVG } from "qrcode.react";
import { hook_qr } from "@/glb/hook/hook_qr";
import _ from "lodash";
import { hook_search_number } from "@/glb/hook/hook_search_number";
import { hook_info_search } from "@/glb/hook/hook_info_search";
import { hook_pagination_selected } from "@/glb/hook/hook_pagination_selected";

export default function Home() {
  const [waNum, setWaNum] = useAtom(val_wa_num);
  const coba = useHookstate(hook_load_coba);
  const cek = useHookstate(hook_cek);
  const trueNumber = useHookstate(hook_true_number);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const listNumber = useHookstate(hook_listnumber);
  const qrValue = useHookstate(hook_qr);

  const searchnumber = useHookstate(hook_search_number);
  const infoSearch = useHookstate(hook_info_search);
  const totalData = useHookstate(hook_total);
  const paginationSelect = useHookstate(hook_pagination_selected);

  useShallowEffect(() => {
    return setReady(true);
  }, []);

  useShallowEffect(() => {
    loadListnumber(paginationSelect.value);
    if (trueNumber.value) {
      console.log("load list number");
      loadListnumber(paginationSelect.value);
    }
  }, [trueNumber.value]);

  const loadListnumber = async (page: number) => {
    fetch("/api/get-list-number?page=" + page)
      .then((res) => res.json())
      .then(listNumber.set);
  };

  if (!ready) return <>wait ...</>;
  if (!coba.value)
    return (
      <>
        <Loader />
      </>
    );

  return (
    <>
      <Stack bg={"gray.1"} h={"100%"} spacing={"lg"}>
        {!_.isEmpty(qrValue.value) && <QRCodeSVG value={qrValue.value} />}
        <Flex p={"xs"} bg={"cyan"}>
          <Title color="white">Makuro Wa</Title>
        </Flex>
        {/* {JSON.stringify(listNumber.value)} */}
        <Grid p={"xs"}>
          <Grid.Col md={4}>
            <Paper shadow="xs" h={270}>
              <Stack spacing={0}>
                <Alert title={"Number Generator"} h={100}>
                  <Text>
                    Generator untuk menjaring nomer - nomer yang telah memiliki
                    akun WEA
                  </Text>
                </Alert>
                <Stack spacing={0} p={"xs"}>
                  {/* <SimpleGrid cols={2}>
                    <Text>Ip</Text>
                    <Title order={3}>{hook_ip_address.get()}</Title>
                  </SimpleGrid> */}
                  <SimpleGrid cols={2}>
                    <Text>Operator</Text>
                    <Text>{hook_operator.get()}</Text>
                  </SimpleGrid>
                  <SimpleGrid cols={2}>
                    <Text>Total</Text>
                    <Title order={3}>
                      {Intl.NumberFormat("id-ID").format(totalData.value)}
                    </Title>
                  </SimpleGrid>

                  <SimpleGrid cols={2}>
                    <Text>Number</Text>
                    <Title order={3} color="gray">
                      +62{cek.value}
                    </Title>
                  </SimpleGrid>
                  <SimpleGrid cols={2}>
                    <Text>True Number</Text>
                    <Stack spacing={0} key={trueNumber.value.toString()}>
                      <Title
                        order={3}
                        color="green"
                        className="animate__animated animate__backInLeft"
                      >
                        +62{trueNumber.value}
                      </Title>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col md={8}>
            <ComTrueCaller />
          </Grid.Col>
        </Grid>
        <Stack p={"xs"}>
          <Paper>
            <Stack>
              <Group position="apart" p={"xs"}>
                <Title>List Number Result</Title>
                <Pagination
                  value={paginationSelect.value}
                  total={_.ceil(totalData.value / 10)}
                  onChange={(val) => {
                    paginationSelect.set(val);
                    loadListnumber(val);
                  }}
                />
              </Group>
              <Table>
                <thead>
                  <tr>
                    <th>No</th>
                    {_.keys(listNumber.value[0]).map((v, i) => (
                      <th key={i}>
                        <Title order={3}>{v}</Title>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listNumber.value.map((v, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      {_.keys(v).map((v2, i2) => (
                        <td key={i2}>
                          <Group>
                            <Text w={200}>0{v[v2]}</Text>
                            <Flex>
                              <CopyButton value={v[v2]}>
                                {({ copied, copy }) => (
                                  <ActionIcon
                                    onClick={() => {
                                      copy();
                                      toast("copied");
                                    }}
                                    color={copied ? "teal" : "blue"}
                                  >
                                    <MdContentCopy size={24} />
                                  </ActionIcon>
                                )}
                              </CopyButton>
                              <ActionIcon
                                color="green"
                                onClick={() =>
                                  window.open(`https://wa.me/62${v[v2]}`)
                                }
                              >
                                <MdWhatsapp size={24} />
                              </ActionIcon>
                              <ActionIcon
                                color="cyan"
                                onClick={() => {
                                  infoSearch.set(Math.random().toString());
                                  searchnumber.set(v[v2]);
                                }}
                              >
                                <MdSearch size={24} />
                              </ActionIcon>
                            </Flex>
                          </Group>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </>
  );
}
