import { enableProdMode, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { defineCustomElements as pwaElements} from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite} from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { InitializeAppService } from './app/services/initialize.app.service';
import { SQLiteService } from './app/services/sqlite.service';
import { StorageService } from './app/services/storage.service';
import { DbnameVersionService } from './app/services/dbname-version.service';

if (environment.production) {
    enableProdMode();
}
// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if(platform === "web") {
    // Web platform
    // required for toast component in Browser
    pwaElements(window);

    // required for jeep-sqlite Stencil component
    // to use a SQLite database in Browser
    jeepSqlite(window);

    window.addEventListener('DOMContentLoaded', async () => {
        const jeepEl = document.createElement("jeep-sqlite");
        document.body.appendChild(jeepEl);
        await customElements.whenDefined('jeep-sqlite');
        jeepEl.autoSave = true;

    });
}
// Above only required if you want to use a web platform <--

// Define the APP_INITIALIZER factory
export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}

bootstrapApplication(AppComponent, {
    providers: [SQLiteService,
        InitializeAppService,
        StorageService,
        DbnameVersionService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        importProvidersFrom(IonicModule.forRoot({})),
        provideRouter(routes),
        {
        provide: APP_INITIALIZER,
        useFactory: initializeFactory,
        deps: [InitializeAppService],
        multi: true
        }
    ],
});
/**
 * SQLiteService: É um serviço responsável por interagir com o banco de dados SQLite.
       Fornece métodos para criar, acessar e manipular o banco de dados SQLite.

   InitializeAppService: É um serviço usado para inicializar a aplicação.

   StorageService: É um serviço usado para gerenciar o armazenamento de dados na aplicação.
      Relacionado ao armazenamento local, como armazenamento de preferências
      ou armazenamento de dados em cache.

   DbnameVersionService: Este serviço está relacionado ao gerenciamento do nome e da versão do banco de dados.

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }:
    Aqui está sendo fornecida uma estratégia de reutilização de rotas para a aplicação.

    A estratégia IonicRouteStrategy é fornecida pelo Ionic e é usada para gerenciar a reutilização de rotas na aplicação.

  importProvidersFrom(IonicModule.forRoot({})): Esta é uma função que importa provedores de módulos Ionic.

   Estes podem incluir provedores necessários para o funcionamento adequado do Ionic na aplicação.
  provideRouter(routes): Este é um provedor usado para fornecer o roteamento na aplicação.
  { provide: APP_INITIALIZER, useFactory: initializeFactory, deps: [InitializeAppService], multi: true }:
   Este é um provedor especial usado para configurar inicializadores de aplicativos.
   Ele usa uma useFactory para criar um inicializador de aplicativos, que, neste caso,
   depende do InitializeAppService.
   O APP_INITIALIZER é usado para executar a lógica de inicialização antes que a aplicação seja carregada.
 */
