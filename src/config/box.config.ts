import { BoxClient, BoxJwtAuth, JwtConfig } from 'box-typescript-sdk-gen';
import dotenv from 'dotenv';

dotenv.config();

const configJsonString = JSON.stringify({
  boxAppSettings: {
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET,
    appAuth: {
      publicKeyID: process.env.BOX_PUBLIC_KEY_ID,
      privateKey: process.env.BOX_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      passphrase: process.env.BOX_PASSPHRASE
    }
  },
  enterpriseID: process.env.BOX_ENTERPRISE_ID
});

const config = JwtConfig.fromConfigJsonString(configJsonString);
const auth = new BoxJwtAuth({ config });
const boxClient = new BoxClient({ auth });

export default boxClient;