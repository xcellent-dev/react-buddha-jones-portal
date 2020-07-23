# Projects





## Get projects list

Retrieve list of projects.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 20,
    "object_count": 3,
    "data": [
        {
            "id": 2,
            "projectName": "Before I Wake",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-12 19:04:22",
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "campaign": [
                {
                    "campaignId": 53,
                    "campaignName": "test campaign1"
                },
                {
                    "campaignId": 54,
                    "campaignName": "test campaign1"
                },
                {
                    "campaignId": 55,
                    "campaignName": "test campaign1"
                }
            ],
            "comment": {
                "count": 1,
                "unread": 1
            }
        },
        {
            "id": 3,
            "projectName": "Bravo 14",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-11 17:12:13",
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "campaign": [
                {
                    "campaignId": 55,
                    "campaignName": "test campaign1"
                }
            ],
            "comment": {
                "count": 1,
                "unread": 1
            }
        },
        {
            "id": 20,
            "projectName": "test 1q",
            "customerId": 9,
            "customerName": "99customer",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-09 16:05:21",
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "campaign": [],
            "comment": {
                "count": 0,
                "unread": 0
            }
        }
    ]
}
```


> 200: detailed success response (when detailed=1 is sent)

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 20,
    "object_count": 3,
    "data": [
        {
            "id": 2,
            "projectName": "Before I Wake",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-12 19:04:22",
            "lastUpdateUserId": 1,
            "lastUpdateUserName": "first",
            "historyCount": 6,
            "campaign": [
                {
                    "campaignId": 53,
                    "campaignName": "test campaign1"
                },
                {
                    "campaignId": 54,
                    "campaignName": "test campaign1"
                },
                {
                    "campaignId": 55,
                    "campaignName": "test campaign1"
                }
            ],
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "comment": {
                "count": 1,
                "unread": 1
            }
        },
        {
            "id": 3,
            "projectName": "Bravo 14",
            "customerId": 1,
            "customerName": "Test Customer 1",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-11 17:12:13",
            "lastUpdateUserId": 1,
            "lastUpdateUserName": "first",
            "historyCount": 1,
            "campaign": [
                {
                    "campaignId": 55,
                    "campaignName": "test campaign1"
                }
            ],
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "comment": {
                "count": 1,
                "unread": 1
            }
        },
        {
            "id": 20,
            "projectName": "test 1q",
            "customerId": 9,
            "customerName": "99customer",
            "firstPointOfContactId": null,
            "notes": null,
            "lastUpdatedAt": "2017-03-09 16:05:21",
            "lastUpdateUserId": 1,
            "lastUpdateUserName": "first",
            "historyCount": 1,
            "campaign": [],
            "lastUpdateUser": {
                "userId": 1,
                "name": "first",
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
            },
            "comment": {
                "count": 0,
                "unread": 0
            }
        }
    ]
}
```

### HTTP Request

`GET /project`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | search | string | null | Search query to narrow returned results by their name
false | customer_id | int | null | Customer ID for filter
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results
false | detailed | int | null | Send 0 or 1. If 1 is sent response will contain more information
false | sort | string | null | Send "last_update_date" or "name" if needed . By default sorting will be done by id



## Get Single project

Retrieve single project information.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": 2,
        "projectName": "Before I Wake",
        "customerId": 1,
        "customerName": "Test Customer 1",
        "firstPointOfContactId": null,
        "notes": null,
        "lastUpdatedAt": "2017-03-12 19:04:22",
        "lastUpdateUser": {
            "userId": 1,
            "name": "first",
            "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
        },
        "campaign": [
            {
                "campaignId": 53,
                "campaignName": "test campaign1",
                "manager": [],
                "producer": [],
                "spot": [
                    {
                        "id": "36",
                        "spotName": "sp1",
                        "revisionNotCounted": null,
                        "notes": null,
                        "revisions": 3,
                        "graphicsRevisions": 0,
                        "firstRevisionCost": null
                    }
                ]
            },
            {
                "campaignId": 54,
                "campaignName": "test campaign1",
                "manager": [
                    {
                        "managerId": 3,
                        "username": "webhkp119",
                        "fullName": "first last"
                    },
                    {
                        "managerId": 4,
                        "username": "AndyAustin",
                        "fullName": "Andy Austin"
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "username": "AlexWagner",
                        "fullName": "Alex Wagner"
                    },
                    {
                        "producerId": 8,
                        "username": "BenVance",
                        "fullName": "Ben Vance"
                    }
                ],
                "spot": []
            },
            {
                "campaignId": 55,
                "campaignName": "test campaign1",
                "manager": [
                    {
                        "managerId": 3,
                        "username": "webhkp119",
                        "fullName": "first last"
                    },
                    {
                        "managerId": 4,
                        "username": "AndyAustin",
                        "fullName": "Andy Austin"
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "username": "AlexWagner",
                        "fullName": "Alex Wagner"
                    },
                    {
                        "producerId": 8,
                        "username": "BenVance",
                        "fullName": "Ben Vance"
                    }
                ],
                "spot": [
                    {
                        "id": "37",
                        "spotName": "sp1",
                        "revisionNotCounted": null,
                        "notes": null,
                        "revisions": 3,
                        "graphicsRevisions": 0,
                        "firstRevisionCost": "90.50"
                    }
                ]
            }
        ],
        "comment": {
            "count": 1,
            "unread": 1
        },
        "history": [
            {
                "id": "42",
                "message": "Spot \"sp1\" was added to \"AV Campaign\" campaign",
                "userId": 1,
                "username": "suda",
                "firstName": "first",
                "lastName": null,
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png",
                "fullName": "first"
            },
            {
                "id": "41",
                "message": "Spot \"sp1\" was added to \"AV Campaign\" campaign",
                "userId": 1,
                "username": "suda",
                "firstName": "first",
                "lastName": null,
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png",
                "fullName": "first"
            }
        ]
    }
}
```


> 200: detailed success response (when detailed=1 is sent)

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": 2,
        "projectName": "Before I Wake",
        "customerId": 1,
        "customerName": "Test Customer 1",
        "firstPointOfContactId": null,
        "notes": null,
        "lastUpdatedAt": "2017-03-12 19:04:22",
        "lastUpdateUserId": 1,
        "lastUpdateUserName": "first",
        "historyCount": 6,
        "campaign": [
            {
                "campaignId": 53,
                "campaignName": "test campaign1",
                "manager": [],
                "producer": [],
                "spot": [
                    {
                        "id": "36",
                        "spotName": "sp1",
                        "revisionNotCounted": null,
                        "notes": null,
                        "revisions": 3,
                        "graphicsRevisions": 0,
                        "firstRevisionCost": null
                    }
                ]
            },
            {
                "campaignId": 54,
                "campaignName": "test campaign1",
                "manager": [
                    {
                        "managerId": 3,
                        "username": "webhkp119",
                        "fullName": "first last"
                    },
                    {
                        "managerId": 4,
                        "username": "AndyAustin",
                        "fullName": "Andy Austin"
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "username": "AlexWagner",
                        "fullName": "Alex Wagner"
                    },
                    {
                        "producerId": 8,
                        "username": "BenVance",
                        "fullName": "Ben Vance"
                    }
                ],
                "spot": []
            },
            {
                "campaignId": 55,
                "campaignName": "test campaign1",
                "manager": [
                    {
                        "managerId": 3,
                        "username": "webhkp119",
                        "fullName": "first last"
                    },
                    {
                        "managerId": 4,
                        "username": "AndyAustin",
                        "fullName": "Andy Austin"
                    }
                ],
                "producer": [
                    {
                        "producerId": 6,
                        "username": "AlexWagner",
                        "fullName": "Alex Wagner"
                    },
                    {
                        "producerId": 8,
                        "username": "BenVance",
                        "fullName": "Ben Vance"
                    }
                ],
                "spot": [
                    {
                        "id": "37",
                        "spotName": "sp1",
                        "revisionNotCounted": null,
                        "notes": null,
                        "revisions": 3,
                        "graphicsRevisions": 0,
                        "firstRevisionCost": "90.50"
                    }
                ]
            }
        ],
        "lastUpdateUser": {
            "userId": 1,
            "name": "first",
            "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png"
        },
        "comment": {
            "count": 1,
            "unread": 1
        },
        "history": [
            {
                "id": "42",
                "message": "Spot \"sp1\" was added to \"AV Campaign\" campaign",
                "userId": 1,
                "username": "suda",
                "firstName": "first",
                "lastName": null,
                "image": "http://buddhajonesapi.localhost/thumb/profile_image/1.png",
                "fullName": "first"
            }
        ]
    }
}
```

### HTTP Request

`GET /project/[:project_id]`

** send detailed param if required

`GET /project/[:project_id]?detailed=1`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | project_id | int | null | Project ID
false | detailed | int | 0 | Send 0 or 1


## Create project

Create a new project.

> Sample request

```javascript
axios.post('/project', {
    name: 'test project',
    customer_id: 1,
    notes: 'some notes for project'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "project_id": 18
    }
}
```

### HTTP Request

`POST /project`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null | Project name
**true** | customer_id | int | null | Customer id
false | notes | string | null | Project note



## Update Project

Update existing project.


> Sample request

```javascript
axios.put('/project/18', {
    name: 'changed project name',
    customer_id: 9,
    notes: 'some changed note'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Project updated successfully."
}
```

### HTTP Request

`PUT /project`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | name | string | null | Project name
false | customer_id | int | null | Customer id
false | notes | string | null | Project note


## Get campaigns list

Retrieve list of campaigns.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 55,
    "object_count": 5,
    "data": [
        {
            "id": "51",
            "campaignName": "test campaign1",
            "description": "test desc",
            "project": []
        },
        {
            "id": "52",
            "campaignName": "test campaign1",
            "description": "test desc",
            "project": []
        },
        {
            "id": "53",
            "campaignName": "test campaign1",
            "description": "test desc",
            "project": [
                {
                    "id": 2,
                    "projectName": "Before I Wake",
                    "manager": [],
                    "producer": []
                }
            ]
        },
        {
            "id": "54",
            "campaignName": "test campaign1",
            "description": "test desc",
            "project": [
                {
                    "id": 2,
                    "projectName": "Before I Wake",
                    "manager": [
                        3,
                        4
                    ],
                    "producer": [
                        6,
                        8
                    ]
                }
            ]
        },
        {
            "id": "55",
            "campaignName": "test campaign1",
            "description": "test desc",
            "project": [
                {
                    "id": 2,
                    "projectName": "Before I Wake",
                    "manager": [
                        3,
                        4
                    ],
                    "producer": [
                        6,
                        8
                    ]
                },
                {
                    "id": 3,
                    "projectName": "Bravo 14",
                    "manager": [
                        13,
                        14
                    ],
                    "producer": [
                        16,
                        18
                    ]
                }
            ]
        }
    ]
}
```

### HTTP Request

`GET /campaign`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | project_id | int | null | Narrow returned campaigns to a relation with specific single project
false | search | string | null | Search query to narrow returned results by their name
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results


## Create campaign

Create a new campaign.

> Sample request

```javascript
axios.post('/campaign', {
    name: 'test campaign',
    description: 'some notes for campaign',
    project: '[{"project_id":2,"manager":[3,4],"producer":[6,8]},{"project_id":3,"manager":[13,14],"producer":[16,18]}]'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "campaign_id": 18
    }
}
```

### HTTP Request

`POST /campaign`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null | Campaign name
false | description | string | null | Campaign description
false | project | JSON | null | Project and manager & producer (send like: [{"project_id":2,"manager":[3,4],"producer":[6,8]},{"project_id":3,"manager":[13,14],"producer":[16,18]}])

## Update campaign

Update existing campaign.

> Sample request

```javascript
axios.put('/campaign', {
    name: 'test campaign',
    description: 'some notes for campaign',
    project: '[{"project_id":2,"manager":[3,4],"producer":[6,8]},{"project_id":3,"manager":[13,14],"producer":[16,18]}]'
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

`PUT /campaign/[:campaign_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false| name | string | null | Campaign name
false | description | string | null | Campaign description
false | project | JSON | null | Project and manager & producer (send like: [{"project_id":2,"manager":[3,4],"producer":[6,8]},{"project_id":3,"manager":[13,14],"producer":[16,18]}])


## Get spots list

Retrieve list of spots.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 19,
    "object_count": 4,
    "data": [
        {
            "id": "32",
            "spotName": "Deashot :60",
            "projectId": 2,
            "campaignId": 1,
            "revisionNotCounted": null,
            "notes": null,
            "revisions": null,
            "graphicsRevisions": null,
            "firstRevisionCost": null
        },
        {
            "id": "35",
            "spotName": "sp1",
            "projectId": 2,
            "campaignId": 9,
            "revisionNotCounted": null,
            "notes": null,
            "revisions": null,
            "graphicsRevisions": 0,
            "firstRevisionCost": null
        },
        {
            "id": "36",
            "spotName": "sp1",
            "projectId": 2,
            "campaignId": 9,
            "revisionNotCounted": null,
            "notes": null,
            "revisions": 3,
            "graphicsRevisions": 0,
            "firstRevisionCost": null
        },
        {
            "id": "37",
            "spotName": "sp1",
            "projectId": 2,
            "campaignId": 9,
            "revisionNotCounted": null,
            "notes": null,
            "revisions": 3,
            "graphicsRevisions": 0,
            "firstRevisionCost": "90.50"
        }
    ]
}
```

### HTTP Request

`GET /spot`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | project_id | int | null | Narrow returned spots to a relation with specific single project
false | campaign_id | int | null | Narrow returned spots to a relation with specific single campaign
false | search | string | null | Search query to narrow returned results by their name
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results


## Delete Project to Campaign Relation

Delete project to campaign relation. if no other relation left betweent he campaing and any other project, then the campaign will be deleted.


> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

### HTTP Request

`DELETE /campaign/[:campaign_id]/[:project_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true* | campaign_id | int | null | Campaign ID
**true* | project_id | int | null | Project ID


## Get single Spot

Retrieve single spot data.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": "37",
        "spotName": "sp1",
        "projectId": 2,
        "campaignId": 9,
        "revisionNotCounted": null,
        "notes": null,
        "revisions": 3,
        "graphicsRevisions": 0,
        "firstRevisionCost": "90.50"
    }
}
```

### HTTP Request

`GET /spot/[:spot_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_id | int | null | Spot id


## Create spot

Create a new spot.

> Sample request

```javascript
axios.post('/spot', {
    name: 'test spot',
    project_id: 1,
    campaign_id: 1,
    notes: 'some notes for spot'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "spot_id": 18
    }
}
```

### HTTP Request

`POST /spot`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null | Spot name
**true** | project_id | int | null | Project id
**true** | campaign_id | int | null | Campaign id
false | notes | string | null | Spot note
false | revisions | int | null | Number of revisions (null=revision not included, 0=unlimited, any other number to set number of revision)
false | graphics_revisions | int | 0 | Is it a Graphics Revision or not. Send 0 or 1 (0=not a graphics revision, 1=it is a graphics revision)
false | first_revision_cost | float | null | Cost of version 1 of the spot



## Update spot

Update existing spot.

> Sample request

```javascript
axios.put('/spot/[:spot_id]', {
    name: 'test spot',
    project_id: 1,
    campaign_id: 1,
    notes: 'some notes for spot'
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

`PUT /spot/[:spot_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | name | string | null | Spot name
false | project_id | int | null | Project id
false | campaign_id | int | null | Campaign id
false | notes | string | null | Spot note
false | revisions | int | null | Number of revisions (null=revision not included, 0=unlimited, any other number to set number of revision)
false | graphics_revisions | int | 0 | Is it a Graphics Revision or not. Send 0 or 1 (0=not a graphics revision, 1=it is a graphics revision)
false | first_revision_cost | float | null | Cost of version 1 of the spot


## Delete spot

Delete existing spot.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

### HTTP Request

`DELETE /spot/[:spot_id]`



## Get sent spot via method list

Retrieve list of sent spot via method list.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 5,
            "name": "Post"
        },
        {
            "id": 6,
            "name": "Fiber"
        },
        {
            "id": 7,
            "name": "Email"
        },
        {
            "id": 8,
            "name": "Messenger",
            "children": [
                {
                    "id": 9,
                    "name": "Post"
                },
                {
                    "id": 10,
                    "name": "Fedex"
                },
                {
                    "id": 11,
                    "name": "Pickup"
                }
            ]
        }
    ]
}
```

### HTTP Request

`GET /spot-sent-via-method`

Sent request like bellow(for Audio/Visual):

`GET /spot-sent-via-method?work_type_id=2`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | work_type_id | integer | null | Work type id (obtained from /work-type GET method. Generally 1=Design or graphics, 2= audio/visual)

## Get Spot Sent list 

get spot sent entry.


> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 4,
    "object_count": 2,
    "data": [
        {
            "id": "3",
            "workTypeId": 1,
            "workType": "Design",
            "sentViaMethodId": 3,
            "sentViaMethod": "Wiredrive",
            "sentViaMethodParentId": null,
            "sentViaMethodParent": null,
            "date": "2017-05-14",
            "notes": "some note",
            "statusId": 5,
            "status": "Sent To Customer",
            "project_spot_version": []
        },
        {
            "id": "4",
            "workTypeId": 1,
            "workType": "Design",
            "sentViaMethodId": 6,
            "sentViaMethod": "Fiber",
            "sentViaMethodParentId": null,
            "sentViaMethodParent": null,
            "date": "2017-05-14",
            "notes": "some note",
            "statusId": 5,
            "status": "Sent To Customer",
            "project_spot_version": [
                {
                    "spotId": "1",
                    "spotName": "Take Over :10",
                    "versionId": "2",
                    "versionName": "1A",
                    "projectId": 23,
                    "projectName": "Test2",
                    "campaignId": null,
                    "campaignName": null
                },
                {
                    "spotId": "2",
                    "spotName": "Vertical Footage",
                    "versionId": "3",
                    "versionName": "1B",
                    "projectId": 23,
                    "projectName": "Test2",
                    "campaignId": "2",
                    "campaignName": "Trailer"
                }
            ]
        }
    ]
}
```

### HTTP Request

`GET /spot-sent`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | work_type | int | null | Work type ID 
false | sent_via_method | int | null | Sent via method ID 
false | status | string | null | Status id
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results

## Get Single Spot Sent 

Get single spot sent entry.


> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": 4,
        "workTypeId": 1,
        "workType": "Design",
        "sentViaMethodId": 6,
        "sentViaMethod": "Fiber",
        "sentViaMethodParentId": null,
        "sentViaMethodParent": null,
        "date": "2017-05-14",
        "notes": "some note",
        "statusId": 5,
        "status": "Sent To Customer",
        "final": 0,
        "projectSpotVersion": [
            {
                "spotId": "1",
                "spotName": "Take Over :10",
                "versionId": "2",
                "versionName": "1A",
                "projectId": 23,
                "projectName": "Test2",
                "campaignId": null,
                "campaignName": null,
                "worker": {
                    "editor": [
                        {
                            "id": 2,
                            "username": "kansoftkant",
                            "email": "kansoftkant@gmail.com",
                            "firstName": "Hans",
                            "lastName": "Kant",
                            "typeName": "Editor"
                        },
                        {
                            "id": 3,
                            "username": "webhkp",
                            "email": "webhkp@gmail.com",
                            "firstName": "Rizwan",
                            "lastName": "Kader",
                            "typeName": "Editor"
                        }
                    ]
                }
            },
            {
                "spotId": "2",
                "spotName": "Vertical Footage",
                "versionId": "4",
                "versionName": "1 Alt",
                "projectId": 23,
                "projectName": "Test2",
                "campaignId": "2",
                "campaignName": "Trailer",
                "worker": {
                    "editor": [
                        {
                            "id": 4,
                            "username": "AndyAustin",
                            "email": null,
                            "firstName": "Andy",
                            "lastName": "Austin",
                            "typeName": "Editor"
                        },
                        {
                            "id": 9,
                            "username": "BethRoy",
                            "email": null,
                            "firstName": "Beth",
                            "lastName": "Roy",
                            "typeName": "Editor"
                        },
                        {
                            "id": 10,
                            "username": "BillRude",
                            "email": null,
                            "firstName": "Bill",
                            "lastName": "Rude",
                            "typeName": "Editor"
                        }
                    ]
                }
            }
        ],
        "customerContact": [
            {
                "id": 1,
                "customerId": 1,
                "name": "customer one",
                "email": null,
                "mobilePhone": "8888877",
                "officePhone": null,
                "postalAddress": "some not for custmer contact 1"
            },
            {
                "id": 2,
                "customerId": 1,
                "name": "customer two",
                "email": "ea@cc.com",
                "mobilePhone": null,
                "officePhone": null,
                "postalAddress": null
            }
        ],
        "workStage": [
            {
                "id": 4,
                "workStage": "Audio Prep",
                "parentId": 2,
                "parentWorkStage": "Finishing Prep"
            },
            {
                "id": 5,
                "workStage": "Picture Prep",
                "parentId": 2,
                "parentWorkStage": "Finishing Prep"
            }
        ]
    }
}
```

### HTTP Request

`GET /spot-sent/[:spot_sent_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_sent_id | int | null | Spot sent ID

## Create Spot Sent 

Create a new spot sent entry.

> Sample request

```javascript
axios.post('/spot-sent', {
    date:"2017-05-14",
    work_type:1,
    sent_via_method:3,
    notes:"some note",
    status:5,
    spot_version:[{"spot_id":1,"version_id":2,"worker":[1,2,3]},{"spot_id":2,"version_id":3,"worker":[4]}],
    customer_contact:[1,2,3]
});
```

> 200: success response

```json
{
  "status": 1,
  "message": "Request successful.",
  "data": {
    "spot_sent_id": 4
  }
}
```

### HTTP Request

`POST /spot-sent`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | work_type | int | null | Work type id (from /work-type GET api)
**true** | sent_via_method | int or JSON string| null | Sent via method id (from /spot-sent-via-method GET api)
false | date | string | Current date | Date
false | notes | string | null | Notes
false | status | string | null | Status id (from /status GET api)
false | spot_version | JSON encoded string | null | Spot version information (send array of spot_id, version_id and array of designer or editor like: [{"spot_id":1,"version_id":2,"worker":[1,2,3]},{"spot_id":2,"version_id":3,"workder":[4]}])  
false | customer_contact | JSON encoded string | null | Customer contact list (sent value like: [1,2,3])


## Validate Spot Sent 

Validate spot sent entry.

> Sample request

```javascript
axios.put('/spot-sent-validate/:spot_sent_id', {
    final:1,
    status:5,
    spot_version:[{"spot_id":1,"version_id":2,"worker":[1,2,3]},{"spot_id":2,"version_id":3,"worker":[4]}],
    work_stage:[2,3,4],
    file:[{"name":"file one","description":"some file desc"},{"name":"file two"}]
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

`PUT /spot-sent-validate/:spot_sent_id`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | final | integer | null | Final or not (send 0 or 1, or leave blank for null)
false | status | string | null | Status id (from /status GET api)
false | spot_version | JSON encoded string | null | Spot version information (send array of spot_id, version_id and array of designer or editor like: [{"spot_id":1,"version_id":2,"worker":[1,2,3]},{"spot_id":2,"version_id":3,"workder":[4]}])  
false | work_stage | JSON encoded string | null | Work stage id from /work-stage (GET) api (sent value like: [1,2,3])
false | file | JSON encoded string | null | Files name and/or description (sent value like: [{"name":"file one","description":"some file desc"},{"name":"file two"}])



## Get versions list

Retreive list of versions.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "versionName": "1"
        },
        {
            "id": 2,
            "versionName": "1a"
        },
        {...}
    ]
}
```

### HTTP Request

`GET /version`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | spot_id | number | null | Spot ID to get only versions assigned to specific spot
false | search | string | null | Search query to narrow returned results by their name
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results


## Create version

Create a new version.

> Sample request

```javascript
axios.post('/version', {
    name: 'test version',
    spot_id: [2,3,6]
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "version_id": 18
    }
}
```

### HTTP Request

`POST /version`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | name | string | null | Version name
false | spot_id | int or JSON string| null | Spot id. send integer or JSON encoded string of spot id(like 10 or [9,4,3])
false | billing_type | string | null | Billing type




## Assign Campaign to Project

Assign Campaign to Project

```javascript
axios.post('/assign-campaign-to-project', {
    project_id: 1,
    campaign_id: 2
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

`POST /assign-campaign-to-project`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | project_id | int | null | Project ID
**true** | campaign_id | int | null | Campaign ID



## Assign Spot to Campaign

Assign Spot to Campaign

> Sample request

```javascript
axios.post('/assign-spot-to-campaign', {
    project_id: 1,
    campaign_id: 2,
    spot_id: 3
});
```


### HTTP Request

`POST /assign-spot-to-campaign`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | project_id | int | null | Project ID
**true** | campaign_id | int | null | Campaign ID



## Assign Version to Spot

Assign Version to Spot

> Sample request

```javascript
axios.post('/assign-version-to-spot', {
    spot_id: 1,
    version_id: 2
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

`POST /assign-version-to-spot`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_id | int | null | Spot ID
**true** | version_id | int | null | Version ID


## Delete Version to Spot association

Delete Version to Spot association

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

### HTTP Request

`DELETE /assign-version-to-spot/[:version_id]/[:spot_id]`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_id | int | null | Spot ID
**true** | version_id | int | null | Version ID



## Editor Project Status

Get list of project status for editor

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "statusName": "Watching"
        },
        {
            "id": 2,
            "statusName": "Screening"
        },
        {
            "id": 3,
            "statusName": "Breaking down"
        },
        {
            "id": 4,
            "statusName": "Revising spot"
        },
        {
            "id": 5,
            "statusName": "Cutting NEW spot"
        },
        {
            "id": 6,
            "statusName": "ON fiber"
        },
        {
            "id": 7,
            "statusName": "Downtime"
        },
        {
            "id": 8,
            "statusName": "Waiting"
        }
    ]
}
```

### HTTP Request

`GET /editor-project-status`



## Editor Project Progress

Create editor project progress

> Sample request

```javascript
axios.post('/editor-project-progress', {
    project_id: 1,
    campaign_id: 2,
    spot_id: 3,
    notes: 'some note',
    status_id: 3
});
```


### HTTP Request

`POST /editor-project-progress`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | project_id | int | null | Project ID
**true** | campaign_id | int | null | Campaign ID
**true** | status_id | int | null | Status ID
false | spot_id | int | null | Spot ID
false | notes | string | null | Notes
false | watched | int | null | Send 0 or 1.
false | broken_down | int | null | Send 0 or 1
false | due | string | null | Due as string
false | due_date | date | null | Due date (send one of due or due_string)




## Editor Project Spot assign

Assign spot to editor

> Sample request

```javascript
axios.post('/editor-project', {
    spot_id: 3,
    editor_id: 1
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful"
}
```

### HTTP Request

`POST /editor-project`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | spot_id | int | null | Spot ID
**true** | editor_id | int | null | Editor user  ID



## All Editor Project List

Get project, campaign, spot, and progress of all editor

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "projectId": 1,
            "projectName": "Babysitter",
            "campaignId": "1",
            "campaignName": "AV Campaign",
            "spotId": "5",
            "spotName": "Boomer",
            "editorUserId": 1,
            "editorUserName": "suda",
            "editorFullName": null,
            "notes": null,
            "watched": null,
            "brokenDown": null,
            "due": null,
            "dueDate": null,
            "statusId": null,
            "statusName": null,
            "updatedAt": null
        },
        {
            "projectId": 10,
            "projectName": "Quarry",
            "campaignId": "9",
            "campaignName": "AV Campaign",
            "spotId": "9",
            "spotName": "Enchantress",
            "editorUserId": 1,
            "editorUserName": "suda",
            "editorFullName": null,
            "notes": "some note plusddddd11",
            "watched": null,
            "brokenDown": null,
            "due": null,
            "dueDate": "2017-01-04",
            "statusId": 3,
            "statusName": "Breaking down",
            "updatedAt": "2017-02-26 20:22:39"
        }
    ]
}
```

### HTTP Request

`GET /editor-project`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | offset | int | 0 | Offset
false | length | int | 20 | Length of expected result rows


## Editor Project List(single editor)

Get project, campaign, spot, and progress of editor

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "projectId": 1,
            "projectName": "Babysitter",
            "campaignId": "1",
            "campaignName": "AV Campaign",
            "spotId": "5",
            "spotName": "Boomer",
            "editorUserId": 1,
            "editorUserName": "suda",
            "editorFullName": null,
            "notes": null,
            "watched": null,
            "brokenDown": null,
            "due": null,
            "dueDate": null,
            "statusId": null,
            "statusName": null,
            "updatedAt": null
        },
        {
            "projectId": 10,
            "projectName": "Quarry",
            "campaignId": "9",
            "campaignName": "AV Campaign",
            "spotId": "9",
            "spotName": "Enchantress",
            "editorUserId": 1,
            "editorUserName": "suda",
            "editorFullName": null,
            "notes": "some note plusddddd11",
            "watched": null,
            "brokenDown": null,
            "due": null,
            "dueDate": "2017-01-04",
            "statusId": 3,
            "statusName": "Breaking down",
            "updatedAt": "2017-02-26 20:22:39"
        }
    ]
}
```

### HTTP Request

`GET /editor-project/[:editor_user_id]`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | editor_user_id | int | null | User id of editor
false | offset | int | 0 | Offset
false | length | int | 20 | Length of expected result rows
