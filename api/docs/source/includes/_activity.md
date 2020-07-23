# Activity





## Get activity list

Retrieve list of activity.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 10,
    "data": [
        {
            "id": 2,
            "name": "Breakdown Movie",
            "typeId": 2,
            "activityType": "Timesheet",
            "userTypeId": null,
            "status": 1
        },
        {
            "id": 5,
            "name": "Editorial",
            "typeId": 2,
            "activityType": "Timesheet",
            "userTypeId": null,
            "status": 1
        },
        {
            "id": 8,
            "name": "Finish Supervision",
            "typeId": 2,
            "activityType": "Timesheet",
            "userTypeId": null,
            "status": 1
        }
    ]
}
```

### HTTP Request

`GET /activity?search=a&type_id=[2,5,8]`

##### Call request like:

`GET /activity`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | search | string | null | search string which will match with: label
false | customer_id | int | null | Customer ID. If provided customer price will be returned
false | type_id | int / JSON encoded string | null | Send int or JSON encoded string
false | user_type_id | int | null | User type id




## Get activity type/level list

Retrieve list of activity type/level.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "activityType": "Billing"
        },
        {
            "id": 2,
            "activityType": "Timesheet"
        },
        {
            "id": 3,
            "activityType": "Internal"
        }
    ]
}
```

### HTTP Request

`GET /activity-level`





## Create activity

Create a new activity.

> Sample request

```javascript
axios.post('/activity', {
    type_id: 1,
    name: 'Test Activity',
    user_type_id: 1
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "activity_id": 18
    }
}
```

### HTTP Request

`POST /activity`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null | Activity name
**true** | type_id | int | null | Activity type id
false | user_type_id | int | null | User type id
false | status | int | 1 | Status(send 0 or 1)


## Update Activity

Update existing activity.


> Sample request

```javascript
axios.put('/activity/1', {
    type_id: 1,
    name: 'Test Activity',
    user_type_id: 3
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Activity updated successfully."
}
```

### HTTP Request

`PUT /activity`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | name | string | null | Activity name
false | type_id | int | null | Activity type id
false | user_type_id | int | null | User type id
false | status | int | null | Status(send 0 or 1)


## Create activity price

Create a new activity price for customer

> Sample request

```javascript
axios.post('/activity-price', {
    type_id: 1,
    name: 'Test Activity'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

### HTTP Request

`POST /activity-price`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | customer_id | int | null | Customer id
**true** | activity_id | int | null | Activity id
**true** | price | float / null | null | Price. Send float value or send 'null' for null

** If entry (with cusotmer_id and activity_id) already exists then price will be updated
