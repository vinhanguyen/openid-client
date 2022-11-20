# How to add OpenID Connect auth to Angular app

## Install router store
```
npm install @ngrx/router-store
```

## Configure environment
Name | Value
-----|--------------------------
authorization_endpoint | https://accounts.google.com/o/oauth2/v2/auth
client_id | your client id
api_endpoint | http://localhost:3000

## Copy auth module
```
cp openid-client/src/app/auth your/src/app/
```

## Import router store
```
@NgModule({
  ...
  imports: [
    ...
    StoreModule.forRoot({
      router: routerReducer
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  ...
})
export class AppModule { }
```

## Import auth module
```
@NgModule({
  ...
  imports: [
    ...
    AuthModule
  ],
  ...
})
export class AppModule { }
```

## Register callback component
```
const routes: Routes = [
  {path: 'callback', component: CallbackComponent},
```

## Add auth guard to routes
```
{path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
```

## Start client
```
npm run start
```
