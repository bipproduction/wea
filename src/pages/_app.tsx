import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { db } from "@/util/firebase/firebase_init";
import { onValue, ref } from "firebase/database";
import { Provider, createStore, useAtom } from "jotai";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { hook_ip_address } from "@/glb/hook/ip_address";
import { hook_count_data } from "@/glb/hook/count_data";
import { hook_operator } from "@/glb/hook/operator";
import { filterOperator } from "@/util/fun/operator";
import "../styles/globals.css";

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
      hook_operator.set(filterOperator("0" + countData.nomer));
    });
  }
  return (
    <>
      <Head>
        <title>Page title</title>
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
            })
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </Provider>
    </>
  );
}
