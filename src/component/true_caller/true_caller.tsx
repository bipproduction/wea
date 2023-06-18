import { hook_loadiung } from "@/glb/hook/loading";
import { ModelHasil } from "@/model/true-caller/model_hasil";
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import phone from "phone";
import toast from "react-simple-toasts";
import { useHookstate } from "@hookstate/core";
import { hook_search_number } from "@/glb/hook/hook_search_number";
import { MdWhatsapp } from "react-icons/md";
import { hook_info_search } from "@/glb/hook/hook_info_search";
import { useShallowEffect } from "@mantine/hooks";

type DataLogin = {
  status: number;
  message: string;
  domain: string;
  parsedPhoneNumber: number;
  parsedCountryCode: string;
  requestId: string;
  method: string;
  tokenTtl: number;
};

type DataNya = {
  status: number;
  message: string;
  installationId: string;
  ttl: number;
  userId: number;
  suspended: boolean;
  phones: Phone[];
};

type Phone = {
  phoneNumber: number;
  countryCode: string;
  priority: number;
};

export function ComTrueCaller() {
  // const [phoneNumber, setPhoneNumber] = useState("");
  const searchnumber = useHookstate(hook_search_number);
  const [hasil, setHasil] = useState<ModelHasil | null>(null);
  const installId =
    "a1i0o--frFlbxVt-U7pLzz6yei0DRgR7bLehPb1byd6znGGl5v4HcZJ696pa_YC2";
  const infoSearch = useHookstate(hook_info_search);

  useShallowEffect(() => {
    if (searchnumber.value) {
      setHasil(null);
    }
  }, [searchnumber.value]);

  async function onOtpSubmit() {
    const ada = phone("+62" + searchnumber.value);
    console.log(ada.phoneNumber);
    if (!ada.isValid) return toast("Nomor tidak valid");
    hook_loadiung.set(true);
    var search_data = {
      number: "62" + searchnumber.value,
      countryCode: "ID",
      installationId: installId,
    };

    const data = await fetch("/api/true-caller/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(search_data),
    }).then((res) => res.json());

    setHasil(data);
    hook_loadiung.set(false);
  }

  return (
    <>
      <Paper h={270}>
        <Stack w={"100%"} spacing={0}>
          <Alert title={"Check Number"} color="green" h={100}>
            <Text>
              Cari nama pemilik nomer, ketik atau clik icon search pada table
            </Text>
          </Alert>
          <Stack spacing={0} p={"xs"}>
            <Group align="end" key={infoSearch.value}>
              <NumberInput
                // value={searchnumber.value!??null}
                onChange={(val) => {
                  if (val) {
                    searchnumber.set(val);
                  }
                }}
                icon={<Text>+62</Text>}
                w={300}
                // label="phone number"
                placeholder={
                  searchnumber.value == null ? "81xxx" : "" + searchnumber.value
                }
              />
              <Button
                className="animate__animated animate__flash"
                onClick={onOtpSubmit}
              >
                CEK
              </Button>
            </Group>
            {(() => {
              try {
                return (
                  <>
                    <Group align="end" position="apart" w={"100%"}>
                      <Stack
                        key={searchnumber.value ?? Math.random()}
                        spacing={0}
                      >
                        <Title color="cyan">{hasil?.data[0].name}</Title>
                        <Title color={"gray"} order={3}>
                          {hasil?.data[0].phones[0].carrier}
                        </Title>
                      </Stack>

                      {hasil?.data[0].name && (
                        <Stack spacing={0} justify="end" align="end">
                          <Button
                            onClick={() => {
                              window.open(
                                "https://wa.me/" + searchnumber.value,
                                "_blank"
                              );
                            }}
                            leftIcon={<MdWhatsapp />}
                            color="green"
                          >
                            Send Message
                          </Button>
                        </Stack>
                      )}
                    </Group>
                  </>
                );
                
              } catch (error) {
                return (
                  <>
                    <Stack>
                      <Title>Empty ...!</Title>
                      <Text>Belum Terdaftar Atau server lelah ...!</Text>
                    </Stack>
                  </>
                );
              }
            })()}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
