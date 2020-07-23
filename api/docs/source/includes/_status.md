# Status (work status)





## All status

Get list of all status

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "status": "Draft"
        },
        {
            "id": 2,
            "status": "Final"
        },
        {
            "id": 3,
            "status": "Under Review"
        },
        {
            "id": 4,
            "status": "Approved"
        },
        {
            "id": 5,
            "status": "Sent To Customer"
        }
    ]
}
```


### HTTP Request

`GET /status`
