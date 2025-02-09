import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({
  path: '.env',
});

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Khong tim thay file env');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true,
});
const e = validateSync(configServer);
if (e.length > 0) {
  console.log('Cac gia tri trong file env khong hop le');
  const errors = e.map((eItem) => {
    return {
      property: eItem.property,
      constraints: eItem.constraints,
      value: eItem.value,
    };
  });

  throw errors;
}

const envConfig = configServer;
export default envConfig;
