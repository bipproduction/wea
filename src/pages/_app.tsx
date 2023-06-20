import { hook_count_data } from "@/glb/hook/count_data";
import { hook_ip_address } from "@/glb/hook/ip_address";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { hook_loadiung } from "@/glb/hook/loading";
import { hook_operator } from "@/glb/hook/operator";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { db } from "@/util/firebase/firebase_init";
import { filterOperator } from "@/util/fun/operator";
import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { onValue, ref } from "firebase/database";
import { Provider, createStore, useAtom } from "jotai";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

import io from "socket.io-client";
import { hook_cek } from "@/glb/hook/hook_cek";
import { hook_true_number } from "@/glb/hook/hook_true_number";
import toast from "react-simple-toasts";
import port_option from "../../myserver/port_socket.json";
import { hook_total } from "@/glb/hook/hook_total";
import "animate.css";
import { hook_qr } from "@/glb/hook/hook_qr";
import { hook_private_contact } from "@/glb/hook/hook_private_contact";

const socket = io(
  port_option.dev ? `http://localhost:${port_option.port}` : port_option.host
);

socket.on("connect", () => {
  // console.log("connected");
});

socket.on("disconnect", () => {
  // console.log("disconnected from server");
});

socket.on("info", (data: { title: string; data: any }) => {
  if (!data) return;

  switch (data.title) {
    case "cek":
      hook_cek.set(data.data);
      break;
    case "true":
      hook_true_number.set(data.data);
      break;
    case "total":
      hook_total.set(data.data);
      break;

    case "qr":
      hook_qr.set(data.data);
      break;

    case "contact":
      hook_private_contact.set(data.data);
      break;
    default:
      break;
  }
});

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const store = createStore();
  const [waNum, setWaNum] = useAtom(val_wa_num);

  useShallowEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const ipAddress = await fetch("/api/ip-address").then((v) => v.text());
    hook_ip_address.set(ipAddress);

    onValue(ref(db, `wa/${ipAddress}`), async (snapshot) => {
      // console.log(snapshot.val());
      setWaNum(snapshot.val());
      hook_load_coba.set(snapshot.val());
      const countData = await fetch("/api/count-data").then((v) => v.json());
      hook_count_data.set(countData);

      // console.log(snapshot.val());
      hook_operator.set(filterOperator(`0${snapshot.val()?.nomer}`));
    });
  }
  return (
    <>
      <Head>
        <title>Makuro Wa</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <Provider>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
            fontFamily: "'Instrument Sans', sans-serif",
            fontFamilyMonospace: "Monaco, Courier, monospace",
            headings: { fontFamily: "'Bebas Neue', sans-serif" },
            globalStyles: (theme) => ({
              body: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[1],
              },
            }),
          }}
        >
          <Component {...pageProps} />
          <LoadingOverlay visible={hook_loadiung.get()} overlayBlur={2} />
        </MantineProvider>
      </Provider>
    </>
  );
}
