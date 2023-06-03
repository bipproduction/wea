import Emiter from "events";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { Button, Text, Title } from "@mantine/core";
import { val_coba } from "@/glb/val/coba";
import { useAtom } from "jotai";
import { hook_load_coba } from "@/glb/hook/load_coba";
import { __state, useHookstate } from "@hookstate/core";
import { val_wa_num } from "@/glb/jotai/wa_num";

const operatorPatterns: any = {
  Telkomsel: /^08(11|12|13|21|22|23|51|52|53|54|55|56|57|58|59)/,
  XL: /^08(17|18|19|59|77|78|79)/,
  Indosat: /^08(14|15|16|55|56|57|58|59)/,
  Tri: /^08(81|82|83|84|85|86|87|88|89)/,
  Smartfren: /^08(95|96|97|98|99)/,
  Axis: /^08(38|38|38|38|38|38|38|38|38)/,
};

function filterOperator(phoneNumber: string) {
  for (const operator in operatorPatterns) {
    if (operatorPatterns[operator].test(phoneNumber)) {
      return operator;
    }
  }
  return "Unknown Operator";
}

export default function Home() {
  const [waNum, setWaNum] = useAtom(val_wa_num);
  const coba = useHookstate(hook_load_coba);

  return (
    <>
      <Title>Ini Adalah Datanya</Title>
      {/* <Text>{JSON.stringify(val_wa_num)}</Text> */}
      <Text>+62{coba.value.nomer}</Text>
      <Text>{coba.value.urutan}</Text>
      <Text>{filterOperator("0" + coba.value.nomer)}</Text>
    </>
  );
}
