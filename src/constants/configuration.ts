import { JwtSignOptions } from '@nestjs/jwt';

interface IConfig {
  jwt: JwtSignOptions;
}

export default (): IConfig => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
