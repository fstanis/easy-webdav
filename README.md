# Easy WebDAV

Easy to configure, docker-based WebDAV server. Based on Apache HTTP Server Version 2.4 with [`mod_dav`](https://httpd.apache.org/docs/2.4/mod/mod_dav.html).

## How to use

1. Review and modify the [`config`](config) file.

2. Generate an HTTPS certificate [using Let's Encrypt](https://letsencrypt.org/getting-started/). Copy the generated `fullchain.pem` and `privkey.pem` into a folder called "secrets".

3. Create your users using `htpasswd` (on most distros provided by `apache2-utils`).
    ```bash
    $ htpasswd -cB secrets/users foo
    $ htpasswd -B secrets/users bar
    $ htpasswd -B secrets/users baz
    ```

4. Build the image.
    ```bash
    $ docker build -t easy-webdav .
    ```
5. Run the container and use a [bind mount](https://docs.docker.com/storage/bind-mounts/) (`-v`) for the "secrets" folder as well as your data. Alternatively, see the next section for how to use [Docker Compose](https://docs.docker.com/compose/).
    ```bash
    $ docker run -p 443:443 -v /path/to/your/data:/webdav/data -v $(realpath ./secrets):/run/secrets:ro easy-webdav
    ```

## CalDAV and CardDAV support

To enable support for CalDAV and CardDAV, [Radicale](https://radicale.org/) must be included in the docker image. This can be done using a build argument:

```bash
$ docker build --build-arg radicale=1 -t easy-webdav .
```

In addition, at the very least, `WEBDAV_RADICALE` and `WEBDAV_RADICALE_STORAGE` must be set in the config file.

Note that including Radicale significantly increases the image size.

## Example `docker-compose.yaml`

```yaml
version: '3.8'
services:
  webdav:
    image: easy-webdav
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - type: bind
        source: /path/to/your/data
        target: /webdav/data
    secrets:
      - fullchain
      - privkey
      - users
secrets:
  fullchain:
    file: /path/to/secrets/fullchain.pem
  privkey:
    file: /path/to/secrets/privkey.pem
  users:
    file: /path/to/secrets/users
```
