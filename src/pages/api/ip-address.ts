import ip from 'ip';
import _, { rest } from 'lodash';
const ipAddress = _.kebabCase(ip.address());

export default async function handler(req: any, res: any) {
    res.status(200).send(ipAddress);
}