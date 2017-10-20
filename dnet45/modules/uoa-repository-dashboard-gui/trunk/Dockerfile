FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/
COPY dist/      /usr/share/nginx/html/dist
COPY assets/        /usr/share/nginx/html/assets

EXPOSE 80
