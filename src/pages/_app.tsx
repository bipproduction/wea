import { CacheProvider } from "@emotion/react";
import { Box, MantineProvider, Modal, useEmotionCache } from "@mantine/core";
import { useDisclosure, useShallowEffect } from "@mantine/hooks";
import { AppProps } from "next/app";
import Head from "next/head";
import { useServerInsertedHTML } from "next/navigation";
import io from "socket.io-client";
import Qrcode from "react-qr-code";
import { useState } from "react";
import { useHookstate } from "@hookstate/core";
import {
  gIsSocketConnected,
  gIsWaConnected,
  gIsweaConnectLoading,
  gIsWeaInit,
  gListResult,
  gUserId,
} from "func/g-state";
import {
  NotificationsProvider,
  showNotification,
} from "@mantine/notifications";
import store from "store2";
import { v4 } from "uuid";
import { emitCustomEvent } from "react-custom-events";
import { Toaster } from "react-hot-toast";

export default function App(props: AppProps) {
  const cache = useEmotionCache();
  cache.compat = true;

  const { Component, pageProps } = props;
  const [showModal, setShowModal] = useDisclosure(false);
  const [qrValue, setQrValue] = useState<string>("");
  const isWaConnected = useHookstate(gIsWaConnected);
  const isSocketConnected = useHookstate(gIsSocketConnected);
  const isWeaConnectLoading = useHookstate(gIsweaConnectLoading);
  const isWeaInit = useHookstate(gIsWeaInit);
  const userId = useHookstate(gUserId);
  const listResult = useHookstate(gListResult);

  useShallowEffect(() => {
    if (!userId.value && !store("user_id")) {
      const id = v4();
      store("user_id", id);
      userId.set(id);
    }

    if (store("user_id")) {
      userId.set(store("user_id"));
    }
  }, [userId]);

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  useShallowEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    fetch("/api/socket").then((res) => {
      const socket = io();
      isSocketConnected.set(true);
      socket.on("msg", (data) => {
        if (data.title == "qr") {
          setQrValue(data.value);
          setShowModal.open();
        }

        if (data.title == "result") {
          if (data.value.id == userId.value) {
            const lsData = [...listResult.value];
            lsData.push(data.value);
            emitCustomEvent("result", lsData);
          }
        }

        if(data.title == "qr"){
          console.log("show qr")
          showNotification({
            title: "",
            message: <Box>
              <Qrcode value={data.value} />
            </Box>
          })
        }
      });
    });
  };

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <CacheProvider value={cache}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
          }}
        >
          <div>
            <Toaster position="bottom-center"/>
          </div>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
          <Modal opened={showModal} onClose={setShowModal.close}>
            <Qrcode value={qrValue!} />
          </Modal>
        </MantineProvider>
      </CacheProvider>
    </>
  );
}
