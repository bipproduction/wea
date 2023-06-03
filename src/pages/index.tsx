import Emiter from "events";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { val_coba } from "@/glb/val/coba";
import { useAtom } from "jotai";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { __state, useHookstate } from "@hookstate/core";

if(hook_load_coba.promised){
    console.log("ini load");
}

export default function Home() {
  const [apa, setApa] = useAtom(val_coba);

  useShallowEffect(() => {
    if (apa) {
    //   console.log(`ini diload ${Math.random()}`)
    }
  });
  return (
    <>
      <Title>Ini Adalah Datanya</Title>
      <Text>
        {apa}

        <Button
          onClick={() => {
            setApa("ini adalah datanya");
          }}
        >
          tekan sini
        </Button>
      </Text>
    </>
  );
}
