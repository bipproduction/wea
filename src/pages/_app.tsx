import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { db } from "@/util/firebase/firebase_init";
import { onValue, ref } from "firebase/database";
import { Provider, createStore, useAtom } from "jotai";
import { val_wa_num } from "@/glb/jotai/wa_num";
import { hook_load_coba } from "@/glb/hook/load_coba";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const store = createStore();
  const [waNum, setWaNum] = useAtom(val_wa_num);

  useShallowEffect(() => {
    onValue(ref(db, "wa/10-95-121-231"), (snapshot) => {
      // console.log(snapshot.val());
      setWaNum(snapshot.val());
      hook_load_coba.set(snapshot.val());
    });
  }, []);
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
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </Provider>
    </>
  );
}
