import { Module } from '@nestjs/common';
import { DocentesModule } from './modules/docentes/docentes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CicloModule } from './modules/ciclo/ciclo.module';
import { TurnosModule } from './modules/turnos/turnos.module';
import { UserModule } from './modules/user/user.module';
import { ArchivoModule } from './modules/archivo/archivo.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'db_jrp',
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
  ],
})
export class AppModule {}
