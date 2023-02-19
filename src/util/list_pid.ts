
import AcakNomer from '@/lib/acak_nomer';
import InputNomer from '@/lib/input_nomer';
import ListNomer from '@/lib/list_nomer';
import { IconArrowsShuffle, IconInputSearch, IconListNumbers } from '@tabler/icons';

export const listPid = [
    {
        pid: "acak-nomer",
        sub: "generate nomer secara acan dan memvalidasi nomer untuk mendapatkan nomer yang berisi wea",
        page: AcakNomer,
        icon: IconArrowsShuffle
    },
    {
        pid: "input-nomer",
        sub: "input nomer yang ingin divalidasi untuk mendapatkan nomer yang mengandung wea",
        page: InputNomer,
        icon: IconInputSearch
    },
    {
        pid: "list-nomer",
        sub: "kumpulan atau list nomer yang sudah tervalidasi dan dipastikan mengandung wea",
        page: ListNomer,
        icon: IconListNumbers
    },
];