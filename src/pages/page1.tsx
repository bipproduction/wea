import { val_coba } from "@/glb/val/coba";
import { Button, Text } from "@mantine/core";
import Emiter from "events";
import { useAtom } from "jotai";


export default function Page1() {
  const [apa, setApa] = useAtom(val_coba);
  return (
    <>
      <Button
        onClick={() => {
          setApa(Math.random().toString());
        }}
      >
        Tekan sini
      </Button>
      <Text>{apa}</Text>
    </>
  );
}
