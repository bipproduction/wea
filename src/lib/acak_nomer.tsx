import { gLastNumber, gListNumber, gNumberCount } from "@/g_state/g.state";
import { useHookstate } from "@hookstate/core";
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CopyButton,
  Divider,
  Flex,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery, useShallowEffect } from "@mantine/hooks";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import {
  IconInfoCircle,
  IconNotification,
  IconUser,
  IconUserCircle,
} from "@tabler/icons";
import {
  gIsSocketConnected,
  gListResult,
  gUserId,
  gUserListNumber,
} from "func/g-state";
import _ from "lodash";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  MdInfo,
  MdNextPlan,
  MdPlayArrow,
  MdSignalCellular4Bar,
  MdSignalCellularConnectedNoInternet4Bar,
} from "react-icons/md";
import ContainerLayout from "./container_layout";

const AcakNomer = () => {
  const listnumber = useHookstate(gListNumber);
  const lastNumber = useHookstate(gLastNumber);
  const userId = useHookstate(gUserId);
  const listResult = useHookstate(gListResult);
  const userListNumber = useHookstate(gUserListNumber);
  const isSocketConnected = useHookstate(gIsSocketConnected);
  const [editNumber, setEditNumber] = useState<string>("0");
  const numberCount = useHookstate(gNumberCount);

  useShallowEffect(() => {
    getListSavedNumber();
    onGenerate();
    getNumberCount();
  }, []);

  const getNumberCount = async () => {
    const res = await fetch("/api/get-number-count");
    if (res.ok) {
      const data = await res.json();
      numberCount.set(data);
    }
  };

  const getListSavedNumber = async () => {
    const res = await fetch(`/api/get-number-by-id?userId=${userId.value}`);
    if (res.status == 200) {
      const data = await res.json();
      // console.log(data);
      userListNumber.set(data);
    }
  };

  const onGenerate = () => {
    const lengNumber = 50;
    const num = lastNumber.value ?? "082191119960";
    let realNum = Number(num.substring(1, num.length));
    const hasil = [];
    for (let i of new Array(lengNumber)) {
      realNum++;
      hasil.push(realNum);
    }

    listnumber.set(hasil);
    lastNumber.set("0" + _.last(hasil));
    setEditNumber("0" + _.last(hasil));

    // showNotification({
    //   title: "info",
    //   message: `${lengNumber} generated, ready to proccess`,
    // });
    toast.success(`${lengNumber} generated`);
  };

  const loadStatus = async () => {
    const res = await fetch("/api/status");
    if (res.status == 200) {
      const data = await res.json();

      if (data.title == "qr") {
        toast.error("require qr, call maintener 089697338821");
        return false;
      }

      toast.success("status ready");
      return true;
    } else {
      toast.error(`${res.status}`);
      return false;
    }
  };

  const cekStatus = async () => {
    const apa = await toast.promise(loadStatus(), {
      loading: "loading ...",
      success: <b>ready</b>,
      error: <b>Could not save.</b>,
    });
    return apa;
  };

  const sendWea = async () => {
    if (!(await cekStatus())) {
      toast.error("server disconnected");
      return;
    }

    const data = await toast.promise(
      fetch("/api/send-data", {
        method: "POST",
        body: JSON.stringify({
          id: userId.value,
          data: listnumber.value,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }),
      {
        loading: "loading ...",
        success: "success",
        error: "error",
      }
    );

    if (data.status === 200) {
      const d = await data.json();
      listResult.set(d);
      toast.success(`success ${d.length} number`);
      getListSavedNumber();
    } else {
      toast.error(`${data.status}`);
    }
  };

  return (
    <>
      <ContainerLayout>
        <Stack spacing={"lg"} p={"xs"}>
          <Paper p={"xs"} bg={"gray.0"} shadow={"xs"}>
            <Title order={3}>Profile</Title>
            <Flex justify={"space-between"}>
              <Box>
                <Avatar radius={70} bg={"orange"}>
                  <IconUser size={43} />
                </Avatar>
                <Stack spacing={0}>
                  <Text fw={"bold"} color={"dimmed"} size={12}>
                    {userId.value}
                  </Text>
                  <Text size={12} color={"gray"}>
                    Anda Tidak Perlu Login untuk Bisa Menggunakan Tools Ini ,
                    namu nomor Yang Tersimpan Akan Hilang Jika Berganti Device
                  </Text>
                </Stack>
              </Box>
              <Stack spacing={0} justify={"end"}>
                {isSocketConnected.value ? (
                  <MdSignalCellular4Bar color="green" size={32} />
                ) : (
                  <MdSignalCellularConnectedNoInternet4Bar size={32} />
                )}
                <Button
                  bg={"green"}
                  leftIcon={<IconUserCircle />}
                  onClick={() => toast("Masih Dalam Pengembangan")}
                >
                  Daftar
                </Button>
              </Stack>
            </Flex>
          </Paper>

          <Paper p={"xs"} bg={"gray.0"} shadow={"xs"}>
            <Stack spacing={"lg"}>
              <Title order={3}>Edit Number</Title>
              <TextInput
                value={editNumber}
                onChange={(val) => setEditNumber(val.currentTarget.value)}
                description={
                  "rubah nomer untuk generate dengan nomer yang berbeda"
                }
              />
              <Button
                bg={"cyan"}
                onClick={() => {
                  if (
                    editNumber.length > 10 &&
                    editNumber.substring(0, 1) == "0"
                  ) {
                    lastNumber.set(editNumber);
                    toast.success("saved, silahkan generate dan proccess");
                  } else {
                    toast.error(
                      "format number salah , gunakan 0 didepan , dan pastikan nomer lebih dari 10"
                    );
                  }
                }}
              >
                Save
              </Button>
            </Stack>
          </Paper>

          <Paper p={"xs"} bg={"gray.0"} shadow={"xs"}>
            <Stack spacing={"xl"}>
              <Stack spacing={0}>
                <Title order={3}>Generate</Title>
                <Text size={12} color={"gray"}>
                  Proses Filter Nomor Acak untuk divalidasi nomer yang
                  mengandung wea
                </Text>
              </Stack>
              <Group position="apart" grow>
                <Stack justify={"start"} spacing={0}>
                  <Button
                    bg={"orange"}
                    leftIcon={<MdNextPlan />}
                    onClick={onGenerate}
                  >
                    Next Value
                  </Button>
                  <Text size={12} c={"gray"}>
                    untuk generate nomer yang berbeda
                  </Text>
                </Stack>
                <Stack justify={"end"} spacing={0}>
                  <Button leftIcon={<MdPlayArrow />} onClick={sendWea}>
                    Proccess
                  </Button>
                  <Text size={12} c={"gray"}>
                    Untuk Memulai Proses Filter Nomor
                  </Text>
                </Stack>
              </Group>

              <Paper p={"xs"} withBorder>
                <ScrollArea h={200} scrollbarSize={0}>
                  <SimpleGrid cols={3}>
                    {listnumber.value &&
                      listnumber.value.map((v, i) => (
                        <Box key={v.toString()}>
                          {listResult.value
                            .map((v2, i) => v2.number)
                            .includes(v) ? (
                            <Tooltip label={"click to view number"}>
                              <Badge
                                leftSection={
                                  <Avatar radius={50}>{i + 1}</Avatar>
                                }
                                variant="outline"
                                color={"white"}
                              >
                                <Anchor
                                  href={`https://wa.me/62${v}`}
                                  target={"_blank"}
                                >
                                  0{v}
                                </Anchor>
                              </Badge>
                            </Tooltip>
                          ) : (
                            <Badge
                              leftSection={<Avatar radius={50}>{i + 1}</Avatar>}
                              variant="light"
                              bg={"white"}
                            >
                              <Text>0{v}</Text>
                            </Badge>
                          )}
                        </Box>
                      ))}
                  </SimpleGrid>
                </ScrollArea>
              </Paper>
              <Flex p={"xs"} pt={"lg"}>
                <MdInfo size={32} color={"gray"} />
                <Text size={12} c={"gray"} px={"xs"}>
                  click nomer yang berwarna biru untu melihat detail nomer,
                  hasil Dari generate Nomer, maksimal hanya 50 , jika ingin
                  lebih , hubungi developer
                </Text>
              </Flex>
              {listResult.value && !_.isEmpty(listResult.value) && (
                <Box p={"xs"}>
                  <Group position="apart">
                    <Stack spacing={0}>
                      <Title order={3} color={"cyan"}>
                        Get Result : {listResult.value.length} Number
                      </Title>
                      <Text size={12} color={"gray"}>
                        Total Nomor Yang Berhasil Tervalidasi
                      </Text>
                    </Stack>
                    <CopyButton
                      value={listResult.value
                        .map((v) => "0" + v.number)
                        .join("\n")}
                    >
                      {({ copied, copy }) => (
                        <Button
                          variant="light"
                          bg={"gray.0"}
                          color={copied ? "gray" : "blue"}
                          onClick={copy}
                        >
                          {copied
                            ? `${listResult.value.length} copied`
                            : `copy ${listResult.value.length}`}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Box>
              )}
            </Stack>
          </Paper>

          <Paper p={"xs"} bg={"gray.0"} shadow={"xs"}>
            <Stack spacing={"lg"}>
              <Group position="apart" p={"xs"}>
                <Stack spacing={0}>
                  <Title order={3}>Saved Number</Title>
                  <Text size={12} color={"gray"}>
                    kumpulan nomor yang sudah pernah difilter dan tervalidasi
                    nomer wea
                  </Text>
                </Stack>

                {userListNumber.value && (
                  <CopyButton
                    value={userListNumber.value
                      .map((v: any) => `62${v.number}`)
                      .join("\n")}
                  >
                    {({ copied, copy }) => (
                      <Button
                        variant="light"
                        bg={"gray.0"}
                        color={copied ? "gray" : "blue"}
                        onClick={copy}
                      >
                        {copied
                          ? ` ${userListNumber.value!.length} of ${
                              numberCount.value
                            } copied`
                          : `copy ${userListNumber.value!.length} of ${
                              numberCount.value
                            }`}
                      </Button>
                    )}
                  </CopyButton>
                )}
              </Group>
              <Paper p={"xs"}>
                <ScrollArea h={200} scrollbarSize={0}>
                  <SimpleGrid cols={3}>
                    {userListNumber.value &&
                      userListNumber.value.map((v: any, i) => (
                        <Box key={v.id}>
                          <Badge
                            leftSection={<Avatar>{i + 1}</Avatar>}
                            variant="light"
                            bg={"white"}
                          >
                            <Anchor
                              href={`https://wa.me/62${v.number}`}
                              target={"_blank"}
                            >
                              0{v.number}
                            </Anchor>
                          </Badge>
                        </Box>
                      ))}
                  </SimpleGrid>
                </ScrollArea>
              </Paper>
              <Flex align={"center"}>
                <IconInfoCircle color="gray" />
                <Text p={"xs"} px={"xs"} size={12} c={"gray"}>
                  List Nomer Yang Telah Didapatkan, yang dimunculkan adalah 50
                  nomer terakhir , jika ingin lebih hubungi developer
                </Text>
              </Flex>
            </Stack>
          </Paper>
        </Stack>
      </ContainerLayout>
    </>
  );
};

export default AcakNomer;
