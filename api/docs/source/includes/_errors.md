# Errors

Buddha Jones API can return error codes below:

Error Code | Meaning | Description
---------- | ------- | -----------
400 | Bad Request | Request code itself is having an issue
401 | Unauthorized | API token is wrong
403 | Forbidden | API token does not exist or doesn't allow access to this resource
404 | Not Found | API endpoint could not be found
405 | Method Not Allowed | Resource does not support particular HTTP method
500 | Internal Server Error | Server issue
503 | Service Unavailable | Temporarily offline - most likely due to maintenance
