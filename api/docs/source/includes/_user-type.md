# User Type





## Get all user type

Get list of all user type

### HTTP Request

`GET /user-type`

### Query Parameters

None


> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "type_name": "Editor"
        },
        {
            "id": 2,
            "type_name": "Designer"
        },
        {
            "id": 3,
            "type_name": "Producer"
        },
        {
            "id": 4,
            "type_name": "Billing"
        }
    ]
}
```
