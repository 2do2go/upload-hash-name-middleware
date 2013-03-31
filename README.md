# expressjs middleware which renames file uploads to names based on hash of file content

## Usage

set `hash` option for bodyParser, include upload-hash-name-middleware (after
bodyParser)

```js
var app = express.createServer();
app.use(express.bodyParser({hash: 'md5'}));
app.use(require('upload-hash-name-middleware'));
```

that's all now all uploads will be stored by its hashes as name.
