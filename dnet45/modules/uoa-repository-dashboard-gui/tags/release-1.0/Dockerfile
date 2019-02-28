FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
#COPY index.html /usr/share/nginx/html/
COPY dist/uoa-repository-manager-ui/      /usr/share/nginx/html
#COPY assets/    /usr/share/nginx/html/assets

EXPOSE 80
