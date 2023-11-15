# UOA Repository Manager UI



## Introduction
## Architecture



## Building

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8 (Angular version 6.1.10).

## Minimum requirements for installing and building the project

[Node.js](https://nodejs.org/en/) version 8.x or 10.x.<br>
[npm client](https://docs.npmjs.com/cli/install) command line interface (it is installed with Node.js by default).
- [Node.js version 16](https://nodejs.org/en/blog/release/v16.16.0)

###### Build Instructions:
Follow the instructions below to download the source code and build the application.
For more information about building an Angular app you can refer to the official documentation: [Building and serving Angular apps](https://angular.io/guide/build#building-and-serving-angular-apps).

1. Clone the repository and move inside the directory
   <br> `git clone https://code-repo.d4science.org/MaDgIK/uoa-repository-manager-ui.git && cd uoa-repository-manager-ui`
2. Install Angular dependencies
   <br> `npm install`
3. Build Angular app
   <br> `ng build --configuration production`
   <br> Produces the directory "dist/**uoa-repository-manager-ui**" which contains the compiled files.
<br>
<br>

## Deployment

### Prerequisites
- Nginx

### Instructions
To deploy the Frontend app:
1. Make sure that you have successfully built and installed the application on Nginx (or another Web Server).
2. _Start_ or _reload_ the Web Server service.
   <br>e.g. `systemctl start nginx` or `systemctl reload nginx`

## Installation

### Prerequisites
- [Nginx](https://www.nginx.com/) (or another Web Server like [Apache HTTP Server](https://httpd.apache.org/))

<br>
<br>


### Installation

#### Nginx Configuration
You have to create a [Server Block configuration](https://www.nginx.com/resources/wiki/start/topics/examples/server_blocks/) that will point to the directory "dist/**uoa-repository-manager-ui**" created by [building manually](./building.md#manual-build) the webapp.
It must also be configured as a reverse proxy for the Backend Application (to serve it under the path '/api') and for the list of [Dependencies](#dependencies) of the project.

See the example below:
```nginx
server {
    server_name                 ...
    access_log                  ...
    root                        /path/to/uoa-repository-manager-ui;  # the directory of the application

    location / {
        try_files $uri$args $uri$args/ /index.html /index.php;
    }

    location ~* \.(eot|ttf|woff)$ {
        add_header Access-Control-Allow-Origin *;
    }

    # reverse proxy configuration for the backend application
    location /api {
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_pass              <?>;
        proxy_read_timeout      3600;
        proxy_send_timeout      3600;
    }

    [...]
}
```

Lastly, we would advice to validate the configuration of the Nginx to make sure it does not contain errors.
<br>Execute `nginx -t` with elevated permissions to perform a validation. If the test is successful you can move on to [deploying](./deployment.md#frontend) the application.

<br>
<br>

## Configuration




## Security
## Maintenance
## Recovery
## References


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
