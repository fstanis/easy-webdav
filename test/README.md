This folder contains simple automated tests that start a server and try a few
operations on it. They use the node.js
[webdav](https://www.npmjs.com/package/webdav) client package.

To run the tests:

```
docker build -t fstanis/easy-webdav ..
bash ./runtests
```

Running `testserver` starts a localhost server on port 8080.
