import { Module } from '@nestjs/common';
import { DocentesModule } from './modules/docentes/docentes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CicloModule } from './modules/ciclo/ciclo.module';
import { TurnosModule } from './modules/turnos/turnos.module';
import { UserModule } from './modules/user/user.module';
import { ArchivoModule } from './modules/archivo/archivo.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './modules/roles/roles.module';
import { envs } from './config/envs';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.db_host,
      port: envs.db_port,
      username: envs.db_username,
      password: envs.db_password,
      database: envs.db_database,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      // migrations: [
      //   /*...*/
      // ],
    }),
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    UserModule,
    DocentesModule,
    CicloModule,
    TurnosModule,
    ArchivoModule,
    RolesModule,
  ],
})
export class AppModule {}
