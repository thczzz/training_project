# Base image
FROM nginx

# Install dependencies
RUN apt-get update -qq && apt-get -y install apache2-utils

RUN rm /etc/nginx/nginx.conf

RUN mkdir /etc/nginx/sites-available
RUN mkdir /etc/nginx/sites-enabled

COPY docapp .

RUN mv docapp /etc/nginx/sites-available/docapp
RUN ln -s /etc/nginx/sites-available/docapp /etc/nginx/sites-enabled/docapp

COPY nginx.conf /etc/nginx

COPY nginx_entrypoint.sh .
RUN chmod +x nginx_entrypoint.sh

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]