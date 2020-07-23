# Billing


## Get Billing list

Retrieve list of billing.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 12,
    "object_count": 5,
    "data": [
        {
            "id": 8,
            "spotId": 2,
            "spotName": "Vertical Footage",
            "projectId": 2,
            "projectName": "Before I Wake",
            "customerId": 2,
            "customerName": "Test Customer 2",
            "campaignId": 55,
            "campaignName": "test campaign1",
            "statusId": 1,
            "billStatus": "Draft",
            "createdAt": "2017-03-11 17:59:50",
            "total": 2633.6,
            "approver": {
                "manager": [
                    {
                        "managerId": 3,
                        "approved": 0
                    },
                    {
                        "managerId": 4,
                        "approved": 0
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "approved": 0
                    },
                    {
                        "producerId": 8,
                        "approved": 0
                    }
                ]
            }
        },
        {
            "id": 9,
            "spotId": 2,
            "spotName": "Vertical Footage",
            "projectId": 2,
            "projectName": "Before I Wake",
            "customerId": 2,
            "customerName": "Test Customer 2",
            "campaignId": 55,
            "campaignName": "test campaign1",
            "statusId": 1,
            "billStatus": "Draft",
            "createdAt": "2017-03-11 18:10:17",
            "total": 2633.6,
            "approver": {
                "manager": [
                    {
                        "managerId": 3,
                        "approved": 0
                    },
                    {
                        "managerId": 4,
                        "approved": 1
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "approved": 0
                    },
                    {
                        "producerId": 8,
                        "approved": 1
                    }
                ]
            }
        },
        {
            "id": 10,
            "spotId": 2,
            "spotName": "Vertical Footage",
            "projectId": 2,
            "projectName": "Before I Wake",
            "customerId": 2,
            "customerName": "Test Customer 2",
            "campaignId": 56,
            "campaignName": null,
            "statusId": 1,
            "billStatus": "Draft",
            "createdAt": "2017-03-11 19:03:26",
            "total": 2851.5,
            "approver": {
                "manager": [],
                "producer": []
            }
        }
    ]
}
```

### HTTP Request

`GET /billing`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | length | int | 10 | Limit number of returned results
false | offset | int | 0 | Offset returned results
false | spot_id | int | null | spot id
false | project_id | int | null | project_id
false | status_id | int | null | billing status id
false | campaign_id | int | null | campaign id
false | customer_id | int | null | customer id/client id
false | approver_id | int | null | Approver id(send id of user to check if the user id is in the approver list)
false | approver_status | int | null | approver status(approved status 0 or 1). (say, you want to get not approved bills that are pending approvel for user)
false | search | string | null | search string which will match with: spot name, project name, campaign name
false | sort | string | date | send one of the following values: 'date' or 'priority' . Default is 'date'








## Get Single Billing

Retrieve single billing info by bill id.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": 9,
        "spotId": 2,
        "spotName": "Vertical Footage",
        "projectId": 2,
        "projectName": "Before I Wake",
        "customerId": 2,
        "customerName": "Test Customer 2",
        "campaignId": 55,
        "campaignName": "test campaign1",
        "statusId": 1,
        "billStatus": "Draft",
        "createdAt": "2017-03-11 18:10:17",
        "total": 2633.6,
        "approver": {
            "manager": [
                {
                    "managerId": 3,
                    "approved": 0
                },
                {
                    "managerId": 4,
                    "approved": 1
                }
            ],
            "producer": [
                {
                    "producerId": 6,
                    "approved": 0
                },
                {
                    "producerId": 8,
                    "approved": 1
                }
            ]
        },
        "estimate": [
            {
                "id": "2",
                "spotId": 1,
                "versionId": 2,
                "multiplier": 2,
                "notes": "some note",
                "workTypeId": 1,
                "statusId": 2,
                "totalAmount": "0.00"
            },
            {
                "id": "8",
                "spotId": 1,
                "versionId": 8,
                "multiplier": 2,
                "notes": "some note",
                "workTypeId": 1,
                "statusId": 1,
                "totalAmount": "999.00"
            }
        ],
        "activity": [
            {
                "id": 5,
                "name": "Editorial",
                "typeId": 2,
                "activityType": "Timesheet",
                "status": 1,
                "price": "90.80",
                "hour": "7.00"
            }
        ]
    }
}
```

### HTTP Request

`GET /billing/[:bill_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true* | bill_id | int | null | Bill id



## Create Billing

Create a new billing.

> Sample request

```javascript
axios.post('/billing', {
    customer_id:2,
    project_id:3,
    campaign_id:4,
    estimate:[2,3,4,5,8],
    activity:[{"activity_id":9,"price":90.8,"hour":7}]
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "billing_id": 18
    }
}
```

### HTTP Request

`POST /billing`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | customer_id | int | null | Customer id
**true** | project_id | int | null | Project id
**true** | campaign_id | int | null | Campaign id
false | spot_id | int | null | Spot id
false | status_id | int | 1 | Status id
false | estimate | JSON | null | Send JSON encoded string of estimate id (like [2,3,4,5,8])
false | activity | JSON | null | Send JSON encoded string of activity data (like [{"activity_id":9,"price":90.8,"hour":7}])

** One of **estimate** or **activity** is required



## Get Billing Status list

Get all status list for billing

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": [
        {
            "id": 1,
            "billStatus": "Draft"
        },
        {
            "id": 2,
            "billStatus": "Sent For Approval"
        },
        {
            "id": 3,
            "billStatus": "Final"
        }
    ]
}
```

### HTTP Request

`GET /billing-status`




## Approve Billing

Approve billing

> Sample request

```javascript
axios.put('/billing-approve/4', {
    approved:1
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

`PUT /billing/[:bill_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | approved | int | null | Approved or not. Send 0 or 1 (if the user approves the billing data then send 1, send 0 otherwise)