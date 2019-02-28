# UOA Repository Manager UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8 (Angular version 6.1.10).

## Minimum requirements for installing and building the project

[Node.js](https://nodejs.org/en/) version 8.x or 10.x.<br>
[npm client](https://docs.npmjs.com/cli/install) command line interface (it is installed with Node.js by default).

## Installing the project

After checking out (or updating) the repository enter the created folder and run `npm ci`.
This will install the exact versions of the dependencies as mentioned in the `package-lock.json` file (inside the root folder).

## Build for production

Run `npm run build` (equivalent of `ng build --prod`) to build the project. The build artifacts will be stored in the `dist/uoa-repository-manager-ui` directory.

## Deploy project to nginx server

Run `tar -czvf dist.tar.gz dist/` to generate a compressed `.gz` file containing the built angular folder<br>
Run `scp dist.tar.gz path/to/server/` to copy the compressed file to the server.<br>
Connect to server (`ssh user@server.ip.address`).<br>
Uncompress `dist.tar.gz` file.<br>
Navigate to the root folder of the server.
Copy the contents of the uncompressed dist/uoa-repository-manager-ui folder
into the `uoa-repository-manager-dashboard` folder (superuser privileges are normally required for this action).<br>

## Other topics  
### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.<br>
Run  `npm run start:proxy` (equivalent of `ng serve --proxy-config proxy.conf.json`) instead, to run the project using a development proxy. To configure the proxy modify the `proxy.conf.json` file (inside the root folder).

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
