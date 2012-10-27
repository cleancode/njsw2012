# IDEAS

## Deployment

### Error checking

* Exceptions and the event loop (cannot just try/catch)
* .on('error')
* .on('something, function(err, data) {})
* process.on('uncaughtException', function(e) {})
 * code stops at exception, event loop is invoked after our callback
 * an exception inside a callback kills all the following callbacks for that event

### Monitoring

* require('cluster')
* forever
* upstart/monit
* nginx in front to deal with static files

### Performance

* Connection pooling? (node-pool)

### Logging

### Debugging
