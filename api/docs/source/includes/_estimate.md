# Estimation & Quotation





## Get estimates list

Retrieve list of estimates.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 4,
    "object_count": 4,
    "data": [
        {
            "id": "1",
            "spotId": 1,
            "spotName": "Take Over :10",
            "projectId": 1,
            "projectName": "Babysitter",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "campaignId": 1,
            "campaignName": "AV Campaign",
            "versionId": 1,
            "versionName": "1",
            "statusId": 1,
            "status": "Draft",
            "multiplier": 9,
            "totalAmount": 30,
            "createdAt": "2016-12-18 02:29:10"
        },
        {
            "id": "2",
            "spotId": 1,
            "spotName": "Take Over :10",
            "projectId": 1,
            "projectName": "Babysitter",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "campaignId": 1,
            "campaignName": "AV Campaign",
            "versionId": 8,
            "versionName": null,
            "statusId": 2,
            "status": "Final",
            "multiplier": 2,
            "totalAmount": 0,
            "createdAt": "2016-12-18 02:29:10"
        },
        {
            "id": "6",
            "spotId": 1,
            "spotName": "Take Over :10",
            "projectId": 1,
            "projectName": "Babysitter",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "campaignId": 1,
            "campaignName": "AV Campaign",
            "versionId": 8,
            "versionName": null,
            "statusId": 2,
            "status": "Final",
            "multiplier": 2,
            "totalAmount": 1957.79,
            "createdAt": "2016-12-18 02:29:10"
        },
        {
            "id": "7",
            "spotId": 1,
            "spotName": "Take Over :10",
            "projectId": 1,
            "projectName": "Babysitter",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "campaignId": 1,
            "campaignName": "AV Campaign",
            "versionId": 8,
            "versionName": null,
            "statusId": 2,
            "status": "Final",
            "multiplier": 2,
            "totalAmount": 1957.79,
            "createdAt": "2016-12-18 02:29:10"
        }
    ]
}
```

### HTTP Request

`GET /estimate`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | length | int | 10 | Limit number of returned results
false | offset | int | 0 | Offset returned results
false | spot_id | int | null | spot id
false | project_id | int | null | project_id
false | status_id | int | null | status id
false | campaign_id | int | null | campaign id
false | customer_id | int | null | customer id/client id
false | search | string | null | search string which will match with: spot name, project name, campaign name, version name, work type
false | sort | string | date | send one of the following values: 'date' or 'priority' . Default is 'date'





## Get single estimate

Retrieve single estimate based on its ID.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": 40,
        "spotId": 1,
        "spotName": "Take Over :10",
        "projectId": 23,
        "projectName": "Test2",
        "customerId": 1,
        "customerName": "NBC Universal",
        "campaignId": 54,
        "campaignName": null,
        "versionId": 8,
        "versionName": "2B",
        "statusId": 2,
        "status": "Final",
        "multiplier": 2,
        "notes": "some note",
        "submittedTo": {
            "id": 9,
            "firstName": "Beth",
            "lastName": "Roy",
            "fullName": "Beth Roy"
        },
        "timeUnit": "D",
        "totalAmount": 3915.58,
        "createdAt": "2017-05-30 19:18:28",
        "workers": [
            {
                "estimateId": 40,
                "workerId": 1,
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "hourlyRate": "0.00",
                "estimatedRegular": 17.35,
                "estimatedOvertime": 3,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 2,
                "firstName": "Hans",
                "lastName": "Kant",
                "fullName": "Hans Kant",
                "hourlyRate": "0.00",
                "estimatedRegular": 0,
                "estimatedOvertime": 9,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 4,
                "firstName": "Andy",
                "lastName": "Austin",
                "fullName": "Andy Austin",
                "hourlyRate": "9.47",
                "estimatedRegular": 37,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 700.78
            },
            {
                "estimateId": 40,
                "workerId": 5,
                "firstName": "Alex",
                "lastName": "Kroll",
                "fullName": "Alex Kroll",
                "hourlyRate": "34.20",
                "estimatedRegular": 47,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 3214.8
            }
        ],
        "temporaryStaff": [
            {
                "id": 33,
                "estimateId": 40,
                "name": "3D Graphics Artist",
                "estimatedTime": 2,
                "rate": 11,
                "totalAmount": 0
            },
            {
                "id": 34,
                "estimateId": 40,
                "name": "Animator",
                "estimatedTime": 2,
                "rate": 41,
                "totalAmount": 0
            },
            {
                "id": 35,
                "estimateId": 40,
                "name": "Sound",
                "estimatedTime": 15,
                "rate": 12,
                "totalAmount": 0
            }
        ],
        "outsideCost": [
            {
                "id": 5,
                "estimateId": 40,
                "outsideCostId": 1,
                "outsideCost": "Narration",
                "typeId": 1,
                "outsideCostType": "Part of Budget",
                "cost": 99.8
            },
            {
                "id": 6,
                "estimateId": 40,
                "outsideCostId": 3,
                "outsideCost": "Others",
                "typeId": 2,
                "outsideCostType": "Bill Back to Client",
                "cost": 5.6
            }
        ],
        "history": [
            {
                "id": "98",
                "message": "created estimate",
                "userId": 1,
                "username": "suda",
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.jpeg",
                "createdAt": "2017-05-30 19:18:28"
            }
        ]
    }
}
```

`in returned response hours values are in hour.minute format`
`27.45 => 27 hours and 45 minute`

### HTTP Request

`GET /estimate/[:estimate_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | estimate_id | int | null | Narrow response to single estimate with specific ID





## Create estimate

Create a new estimate with user entered data.

> Sample request

```javascript
axios.post('/estimate', {
    spot_id: 1,
    multiplier: 1.5,
    submit_to: 99,
    version_id:8,
    status_id:2,
    notes: "Not sure about the multiplier, please modify if needed.",
    time_unit: "H",
    workers:
        [
          {
            "worker_id": 8,
            "estimated_regular": 17.35,
            "estimated_overtime": 3,
            "estimated_doubletime": 0,
            "total_amount": 200
          },
          {
            "worker_id": 9,
            "estimated_regularr": 27.45,
            "estimated_overtime": 9,
            "estimated_doubletime": 10
          },
          {
            "worker_id": 4,
            "estimated_regular": 37,
            "estimated_overtime": 0,
            "estimated_doubletime": 20
          },
          {
            "worker_id": 5,
            "estimated_regular": 47,
            "estimated_overtime": 0,
            "estimated_doubletime": 0
          }
        ],
    temporary_staff:
        [
          {
            "name": "3D Graphics Artist",
            "estimated_time": 2,
            "rate": 11.5
          },
          {
            "name": "Animator",
            "estimated_time": 2,
            "rate": 41
          },
          {
            "name": "Sound",
            "estimated_time": 15,
            "rate": 12
          }
        ],
    outside_cost:
        [
          {
            "outside_cost_id": 1,
            "cost": 99.8,
            "type_id": 1
          },
          {
            "outside_cost_id": 3,
            "cost": 5.6,
            "type_id": 2
          }
        ]    
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": 40,
        "spotId": 1,
        "spotName": "Take Over :10",
        "projectId": 23,
        "projectName": "Test2",
        "customerId": 1,
        "customerName": "NBC Universal",
        "campaignId": 54,
        "campaignName": null,
        "versionId": 8,
        "versionName": "2B",
        "statusId": 2,
        "status": "Final",
        "multiplier": 2,
        "notes": "some note",
        "submittedTo": {
            "id": 9,
            "firstName": "Beth",
            "lastName": "Roy",
            "fullName": "Beth Roy"
        },
        "timeUnit": "D",
        "totalAmount": 3915.58,
        "createdAt": "2017-05-30 19:18:28",
        "workers": [
            {
                "estimateId": 40,
                "workerId": 1,
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "hourlyRate": "0.00",
                "estimatedRegular": 17.35,
                "estimatedOvertime": 3,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 2,
                "firstName": "Hans",
                "lastName": "Kant",
                "fullName": "Hans Kant",
                "hourlyRate": "0.00",
                "estimatedRegular": 0,
                "estimatedOvertime": 9,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 4,
                "firstName": "Andy",
                "lastName": "Austin",
                "fullName": "Andy Austin",
                "hourlyRate": "9.47",
                "estimatedRegular": 37,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 700.78
            },
            {
                "estimateId": 40,
                "workerId": 5,
                "firstName": "Alex",
                "lastName": "Kroll",
                "fullName": "Alex Kroll",
                "hourlyRate": "34.20",
                "estimatedRegular": 47,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 3214.8
            }
        ],
        "temporaryStaff": [
            {
                "id": 33,
                "estimateId": 40,
                "name": "3D Graphics Artist",
                "estimatedTime": 2,
                "rate": 11,
                "totalAmount": 0
            },
            {
                "id": 34,
                "estimateId": 40,
                "name": "Animator",
                "estimatedTime": 2,
                "rate": 41,
                "totalAmount": 0
            },
            {
                "id": 35,
                "estimateId": 40,
                "name": "Sound",
                "estimatedTime": 15,
                "rate": 12,
                "totalAmount": 0
            }
        ],
        "outsideCost": [
            {
                "id": 5,
                "estimateId": 40,
                "outsideCostId": 1,
                "outsideCost": "Narration",
                "typeId": 1,
                "outsideCostType": "Part of Budget",
                "cost": 99.8
            },
            {
                "id": 6,
                "estimateId": 40,
                "outsideCostId": 3,
                "outsideCost": "Others",
                "typeId": 2,
                "outsideCostType": "Bill Back to Client",
                "cost": 5.6
            }
        ],
        "history": [
            {
                "id": "98",
                "message": "created estimate",
                "userId": 1,
                "username": "suda",
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.jpeg",
                "createdAt": "2017-05-30 19:18:28"
            }
        ]
    }
}
```

### HTTP Request

`POST /estimate`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_id | int | null | Specifies spot to which estimate is being created
false | version_id | int | null | Specifies version to which estimate is being created
**true** | workers | object | null | Array of workers assigned to the estimate
false | temporary_staff | object | null | Array of temporary staff assigned to the estimate
false | outside_cost | object | null | Array of outside cost estimate
**true** | multiplier | float | null | Defines budget margin and project delay multiplier
**true** | submit_to | int | null | Specifies user which should be notified about the estimate
false | notes | string | null | Estimate notes
false | status | int | null | status
false | total_amount | float | null | if total_amount is provided it will be used, if not then it will be calculated




## Update estimate

Update an existing estimate with user entered data.

> Sample request

```javascript
axios.put('/estimate/2', {
    spot_id: 1,
        multiplier: 1.5,
        submit_to: 99,
        version_id:8,
        status_id:2,
        notes: "Not sure about the multiplier, please modify if needed.",
        time_unit: "H",
        workers:
            [
              {
                "worker_id": 8,
                "estimated_regular": 17.35,
                "estimated_overtime": 3,
                "estimated_doubletime": 0,
                "total_amount": 200
              },
              {
                "worker_id": 9,
                "estimated_regularr": 27.45,
                "estimated_overtime": 9,
                "estimated_doubletime": 10
              },
              {
                "worker_id": 4,
                "estimated_regular": 37,
                "estimated_overtime": 0,
                "estimated_doubletime": 20
              },
              {
                "worker_id": 5,
                "estimated_regular": 47,
                "estimated_overtime": 0,
                "estimated_doubletime": 0
              }
            ],
        temporary_staff:
            [
              {
                "name": "3D Graphics Artist",
                "estimated_time": 2,
                "rate": 11.5
              },
              {
                "name": "Animator",
                "estimated_time": 2,
                "rate": 41
              },
              {
                "name": "Sound",
                "estimated_time": 15,
                "rate": 12
              }
            ],
        outside_cost:
            [
              {
                "outside_cost_id": 1,
                "cost": 99.8,
                "type_id": 1
              },
              {
                "outside_cost_id": 3,
                "cost": 5.6,
                "type_id": 2
              }
            ]  
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": 40,
        "spotId": 1,
        "spotName": "Take Over :10",
        "projectId": 23,
        "projectName": "Test2",
        "customerId": 1,
        "customerName": "NBC Universal",
        "campaignId": 54,
        "campaignName": null,
        "versionId": 8,
        "versionName": "2B",
        "statusId": 2,
        "status": "Final",
        "multiplier": 2,
        "notes": "some note",
        "submittedTo": {
            "id": 9,
            "firstName": "Beth",
            "lastName": "Roy",
            "fullName": "Beth Roy"
        },
        "timeUnit": "D",
        "totalAmount": 3915.58,
        "createdAt": "2017-05-30 19:18:28",
        "workers": [
            {
                "estimateId": 40,
                "workerId": 1,
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "hourlyRate": "0.00",
                "estimatedRegular": 17.35,
                "estimatedOvertime": 3,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 2,
                "firstName": "Hans",
                "lastName": "Kant",
                "fullName": "Hans Kant",
                "hourlyRate": "0.00",
                "estimatedRegular": 0,
                "estimatedOvertime": 9,
                "estimatedDoubletime": 0,
                "totalAmount": 0
            },
            {
                "estimateId": 40,
                "workerId": 4,
                "firstName": "Andy",
                "lastName": "Austin",
                "fullName": "Andy Austin",
                "hourlyRate": "9.47",
                "estimatedRegular": 37,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 700.78
            },
            {
                "estimateId": 40,
                "workerId": 5,
                "firstName": "Alex",
                "lastName": "Kroll",
                "fullName": "Alex Kroll",
                "hourlyRate": "34.20",
                "estimatedRegular": 47,
                "estimatedOvertime": 0,
                "estimatedDoubletime": 0,
                "totalAmount": 3214.8
            }
        ],
        "temporaryStaff": [
            {
                "id": 36,
                "estimateId": 40,
                "name": "3D Graphics Artist",
                "estimatedTime": 20,
                "rate": 11,
                "totalAmount": 0
            },
            {
                "id": 37,
                "estimateId": 40,
                "name": "Animator",
                "estimatedTime": 2,
                "rate": 41,
                "totalAmount": 0
            },
            {
                "id": 38,
                "estimateId": 40,
                "name": "Sound",
                "estimatedTime": 15,
                "rate": 12,
                "totalAmount": 0
            }
        ],
        "outsideCost": [
            {
                "id": 7,
                "estimateId": 40,
                "outsideCostId": 2,
                "outsideCost": "Music licensing",
                "typeId": 1,
                "outsideCostType": "Part of Budget",
                "cost": 99.8
            },
            {
                "id": 8,
                "estimateId": 40,
                "outsideCostId": 3,
                "outsideCost": "Others",
                "typeId": 2,
                "outsideCostType": "Bill Back to Client",
                "cost": 15.6
            }
        ],
        "history": [
            {
                "id": "98",
                "message": "created estimate",
                "userId": 1,
                "username": "suda",
                "firstName": "Suda",
                "lastName": "Sampath",
                "fullName": "Suda Sampath",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.jpeg",
                "createdAt": "2017-05-30 19:18:28"
            }
        ]
    }
}
```

### HTTP Request

`PUT /estimate/[:estimate_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | estimate_id | int | null | Estimate id
false | spot_id | int | null | Specifies spot to which estimate is being created
false | version_id | int | null | Specifies version to which estimate is being created
false | multiplier | float | null | Defines budget margin and project delay multiplier
false | submit_to | int | null | Specifies user which should be notified about the estimate
false | notes | string | null | Estimate notes
false | status | int | null | status
false | total_amount | float | null | if total_amount is provided it will be used, if not then it will be calculated
false | workers | object | null | Array of workers assigned to the estimate (if 'delete' =1 is provided then the row will be deleted. else if a row exists with estimateId and workerId then it will be deleted, and a new row will be created
false | temporary_staff | object | null | Array of temporary staff assigned to the estimate
false | outside_cost | object | null | Array of outside cost estimate


## Get estimates type list

Retrieve list of estimate types.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 5,
            "name": "Audio/Visual",
            "status": 1
        },
        {
            "id": 4,
            "name": "Digital",
            "status": 1
        },
        {
            "id": 1,
            "name": "Games",
            "status": 1
        },
        {
            "id": 2,
            "name": "Graphics Only",
            "status": 1
        },
        {
            "id": 6,
            "name": "Other",
            "status": 1
        },
        {
            "id": 3,
            "name": "TV/Streaming",
            "status": 1
        }
    ]
}
```

### HTTP Request

`GET /estimate-type`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | status | int | null | Status (send 0 or 1 if required, or dont send if no filter is required)





## Create estimate type

Create a new estimate  type with user entered data.

> Sample request

```javascript
axios.post('/estimate-type', {
    name: "test estimate type",
    status: 1
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "2"
    }
}
```

### HTTP Request

`POST /estimate-type`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null |  estimate type name
false | status | int | 1 | Status


## Update estimate type

Update an existing estimate type with user entered data.

> Sample request

```javascript
axios.put('/estimate-type/2', {
     name: "test estimate type",
     status: 1
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

`PUT /estimate-type/[:estimate_type_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | name | string | null |  estimate type name
false | status | int | null | Status


## Search temporary staff

Search temporary staff.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        "3D Graphics Artist",
        "Animator"
    ]
}
```

### HTTP Request

`GET /estimate-temporary-staff-search`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | search | string | null | Search query string
false | length | int | 1 | Max number of search result


## Get Outside cost list

Get list of outside cost

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 2,
            "name": "Music licensing"
        },
        {
            "id": 1,
            "name": "Narration"
        }
    ]
}
```

### HTTP Request

`GET /outside-cost`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | search | string | null | Search query string


## Create outside cost

Create a new outside cost with user entered data.

> Sample request

```javascript
axios.post('/outside-cost', {
    name: "Music Listening",
    status: 1
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "2"
    }
}
```

### HTTP Request

`POST /outside-cost`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null |  Outside cost name


## Update outside cost

Update an existing outside cost with user entered data.

> Sample request

```javascript
axios.put('/outside-cost/2', {
     name: "Narration",
     status: 1
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

`PUT /outside-cost/[:outside_cost_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | name | string | null |  Outside cost name