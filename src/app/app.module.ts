import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { CoreModule as NebularCoreModule } from './@core/core.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NbSidebarModule, NbMenuModule, NbToastrModule, NbGlobalPhysicalPosition } from '@nebular/theme';

import { AppComponent } from './app.component';
import { StreamerModule } from './streamer/streamer.module';
import { AuthModule } from './@auth/auth.module';
import { ThemeModule } from './@theme/theme.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { InitUserService } from './@theme/services/init-user.service';
import { UsersModule } from './users/users.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function init_app(injector: Injector) {
  return () =>
    // new Promise<any>((resolve: () => void) => {
    new Promise<any>((resolve: (() => void)) => {
      const initUserService = injector.get(InitUserService);
      initUserService.initCurrentUser().subscribe(() => { },
        () => resolve(), () => resolve()); // a place for logging error
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    ThemeModule.forRoot(),
    AuthModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    // NbDatepickerModule.forRoot(),
    // NbDialogModule.forRoot(),
    // NbWindowModule.forRoot(),
    NbToastrModule.forRoot({
      position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    }),
    // NbChatModule.forRoot({
    //   messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    // }),
    NebularCoreModule.forRoot(),
    NbEvaIconsModule,
    SweetAlert2Module.forRoot(),

    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    UsersModule,
    StreamerModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [Injector],
      multi: true,
    },
  ],
})
export class AppModule {}
