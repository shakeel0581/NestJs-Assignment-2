import { CustomInterceptor } from './interceptors/task.interceptor';
import { LoggerMiddleware } from './middleWares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Task } from './task/entities/task.entity';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CustomInterceptor,
    // }
  ],

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validate,
      envFilePath: '.local.env',
      // envFilePath: '.prod.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_DATABASE'),
        migrations: ['dist/db/migrations/*{.ts,.js}'],
        // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        entities: [User, Task],
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: configService.get<boolean>('DB_LOGGING'),
      }),
    }),
    TaskModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {
  // provider: [
  //   ,
  // ];
  // cofigure(consumer: MiddlewareConsumer){
  //   consumer.apply(LoggerMiddleware).forRoutes('/task')
  // }
}
