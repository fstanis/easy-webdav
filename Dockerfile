FROM httpd:2.4

ARG radicale

RUN \
  [ -z "$radicale" ] && exit; \
  apt-get update; \
  apt-get -y install python3 python3-pip apache2-dev curl; \
  python3 -m pip install --upgrade radicale; \
  cd /tmp; \
  curl -L 'https://github.com/GrahamDumpleton/mod_wsgi/archive/refs/tags/4.9.0.tar.gz' | tar xz; \
  cd mod_wsgi-4.9.0; \
  ./configure --with-python=$(which python3); \
  make; \
  cp src/server/.libs/mod_wsgi.so /usr/local/apache2/modules; \
  apt-get -y purge apache2-dev curl; \
  apt-get -y autoremove; \
  rm -rf /var/lib/apt/lists/*; \
  rm -rf /tmp/mod_wsgi-4.9.0

COPY etc/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY etc/webdav.conf /usr/local/apache2/conf/webdav.conf
COPY config /etc/config
COPY scripts /opt/scripts

RUN chmod -R +x /opt/scripts

CMD ["/opt/scripts/start"]
