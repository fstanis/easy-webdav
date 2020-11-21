FROM httpd:2.4-alpine

ARG radicale

RUN \
[[ -z "$radicale" ]] && exit; \
apk add --no-cache --virtual .build-deps apache2-mod-wsgi; \
cp /etc/apache2/conf.d/wsgi-module.conf /usr/local/apache2/conf; \
cp /usr/lib/apache2/mod_wsgi.so /usr/local/apache2/modules; \
apk add --no-cache python3 py3-pip; \
apk del --no-network .build-deps; \
python3 -m pip install --upgrade https://github.com/Kozea/Radicale/archive/master.tar.gz

COPY etc/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY etc/webdav.conf /usr/local/apache2/conf/webdav.conf
COPY config /etc/config
COPY scripts /opt/scripts

RUN chmod -R +x /opt/scripts

CMD ["/opt/scripts/start"]
