# Comment





## Get comments list

Retrieve list of comments by filter

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 2,
    "object_count": 2,
    "data": [
        {
            "id": "1",
            "comment": "asd falkj flfd\r\nasldfjasf\r\nasdf asdf",
            "user": {
                "id": 1,
                "firstName": "Suda",
                "lastName": null,
                "fullName": "Suda"
            },
            "parentId": 1,
            "typeId": 1,
            "commentType": "Campaign",
            "createdAt": "2016-12-13 00:03:36"
        },
        {
            "id": "4",
            "comment": "las falsdjfas;ld f\r\nasflasdjf\r\nasf\r\n\r\nasd;flkasdjf",
            "user": {
                "id": 1,
                "firstName": "Suda",
                "lastName": null,
                "fullName": "Suda"
            },
            "parentId": 1,
            "typeId": 1,
            "commentType": "Campaign",
            "createdAt": "2016-12-13 00:14:00"
        }
    ]
}
```

### HTTP Request

`GET /comment`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | length | int | 10 | Limit number of returned results
false | offset | int | 0 | Offset returned results
false | type_id | int | null | comment type id
false | parent_id | int | null | id from the parent table (estimate, project, spot etc.)
false | user_id | int | null | user id
false | from_oldest | int | 0 | 1 or 0 (true or false) value which indicates sort order by comment created date





## Get single comment

Retrieve single comment based on its ID.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": "1",
        "comment": "asd falkj flfd\r\nasldfjasf\r\nasdf asdf",
        "user": {
            "id": 1,
            "firstName": "Suda",
            "lastName": null,
            "fullName": "Suda"
        },
        "parentId": 1,
        "typeId": 1,
        "commentType": "Campaign",
        "createdAt": "2016-12-13 00:03:36"
    }
}
```

`in returned response hours values are in hour.minute format`
`27.45 => 27 hours and 45 minute`

### HTTP Request

`GET /comment/[:comment_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | comment_id  | int | null | Narrow response to single comment with specific ID





## Create comment

Create a new comment with user entered data.

> Sample request

```javascript
axios.post('/comment', {
    comment: "test 1",
    parent_id: 11,
    type_id: 2,
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "5",
        "comment": "test 1",
        "user": {
            "id": 1,
            "firstName": "Suda",
            "lastName": null,
            "fullName": "Suda"
        },
        "parentId": 11,
        "typeId": 2,
        "commentType": "Estimate",
        "createdAt": "2016-12-12 14:45:13"
    }
}
```

### HTTP Request

`POST /comment`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | comment | string | null | Comment string
**true** | parent_id | int | null | Id of the item to which the comment belong (id from tables (estimate, project, spot etc tables)
**true** | type_id | int | null | Comment type id
false | user_id | int | logged in user id | user id (default is the current user)





## Update comment

Update existing comment (can only update in 5 min after creating it)

> Sample request

```javascript
axios.post('/comment/5', {
    comment: "test 1",
    parent_id: 11,
    type_id: 2,
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "5",
        "comment": "test 1",
        "user": {
            "id": 1,
            "firstName": "Suda",
            "lastName": null,
            "fullName": "Suda"
        },
        "parentId": 11,
        "typeId": 2,
        "commentType": "Estimate",
        "createdAt": "2016-12-12 14:45:13"
    }
}
```

### HTTP Request

`PUT /comment/[:comment_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | comment_id | int | null | Comment Id
**true** | comment | string | null | Comment string
false | parent_id | int | null | Id of the item to which the comment belong (id from tables (estimate, project, spot etc tables)
false | type_id | int | null | Comment type id
false | user_id | int | logged in user id | user id (default is the current user)
