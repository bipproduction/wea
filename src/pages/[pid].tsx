import AcakNomer from "@/lib/acak_nomer";
import InputNomer from "@/lib/input_nomer";
import ListNomer from "@/lib/list_nomer";
import { Text } from "@mantine/core";
import { GetStaticPaths, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";

const listPid = [
  {
    pid: "acak-nomer",
    sub: "ini adalah subnya",
    page: AcakNomer,
  },
  {
    pid: "input-nomer",
    sub: "ini adalah subnya",
    page: InputNomer,
  },
  {
    pid: "list-nomer",
    sub: "ini adalah subnya",
    page: ListNomer,
  },
];

const DefaultPage = ({ pid }: any) => {
  const pg = listPid.find((v) => pid == v.pid);
  if (!pg) return <>404</>;

  return <>{<pg.page />}</>;
};

export default DefaultPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: listPid.map((v) => ({
      params: {
        pid: v.pid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps = async (
  ctx: NextApiRequest | any,
  _: NextApiResponse
) => {
  return {
    props: {
      pid: ctx.params.pid,
    },
  };
};
