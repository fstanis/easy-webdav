FROM httpd:2.4-alpine

COPY etc/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY etc/webdav.conf /usr/local/apache2/conf/webdav.conf
COPY config /etc/config
COPY scripts /opt/scripts

RUN chmod -R +x /opt/scripts

CMD ["/opt/scripts/start"]
