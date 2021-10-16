const { AuthType, createClient } = require('webdav');

const REMOTE_URL = 'https://localhost:8080/';

const adminClient = createClientForUser('admin');
const fooClient = createClientForUser('foo');
const barClient = createClientForUser('foo');
const readerClient = createClientForUser('reader');
const publicClient = createClient(REMOTE_URL, {  authType: AuthType.None});

test('foo can create files', async () => {
  const result = await fooClient.putFileContents('/foo/file', 'hello, world');
  const files = await fooClient.getDirectoryContents('/foo');
  const content = await fooClient.getFileContents('/foo/file', {
    format: 'text',
  });
  expect(result).toBe(true);
  expect(files.map((f) => f.filename)).toContain('/foo/file');
  expect(content).toBe('hello, world');
});

test('admin can create files anywhere', async () => {
  await adminClient.putFileContents('/foo/admin-file', 'hello, world');
  await adminClient.putFileContents('/bar/admin-file', 'hello, world');
});

test('foo can only read own folder', async () => {
  await fooClient.getDirectoryContents('/foo');
  expect401(fooClient.getDirectoryContents('/bar'));
});

test("foo can't create files in another folder", async () => {
  expect401(fooClient.putFileContents('/bar/file', 'hello, world'));
});

test('reader can read any folder', async () => {
  await readerClient.getDirectoryContents('/foo');
  await readerClient.getDirectoryContents('/bar');
});

test("reader can't create files", async () => {
  expect401(readerClient.putFileContents('/file', 'hello, world'));
  expect401(readerClient.putFileContents('/foo/file', 'hello, world'));
  expect401(readerClient.putFileContents('/bar/file', 'hello, world'));
});

test('anyone can read public folder', async () => {
  await fooClient.getDirectoryContents('/public');
  await barClient.getDirectoryContents('/public');
  await adminClient.getDirectoryContents('/public');
  await publicClient.getDirectoryContents('/public');
});

test('public can\'t read any data', async () => {
  expect401(publicClient.getDirectoryContents('/'));
  expect401(publicClient.getDirectoryContents('/foo'));
  expect401(publicClient.getDirectoryContents('/bar'));
});

function createClientForUser(user) {
  return createClient(REMOTE_URL, {
    authType: AuthType.Password,
    username: user,
    password: 'test',
  });
}

function expect401(promise) {
  expect(promise).rejects.toThrow('Invalid response: 401 Unauthorized');
}
