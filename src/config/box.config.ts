import { BoxClient, BoxJwtAuth, JwtConfig } from 'box-typescript-sdk-gen';
import path from 'path';

// Langsung baca file config.json yang didownload dari Box Developer Console
const configFilePath = path.join(__dirname, 'box-config.json');
const config = JwtConfig.fromConfigFile(configFilePath);

const auth = new BoxJwtAuth({ config });
const boxClient = new BoxClient({ auth });

export default boxClient;