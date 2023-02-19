import { gSetIsWeaConnectLoading } from './g-state';

export const gFuncinitWea = async () => {
    gSetIsWeaConnectLoading().set(true);
    const res = await fetch("/api/wea?init=true");
    if (res.status == 200) {
        // isWeaConnectLoading.set(false);
    } else {
        console.log(res.status);
    }
}