# Time Tracking





## Get time entries list

Retrieve list of time entries.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
              "id": 8,
              "userId": 1,
              "projectId": 2,
              "projectName": "Before I Wake",
              "campaignId": 2,
              "campaignName": "Graphics Campaign",
              "spotId": null,
              "spotName": null,
              "versionId": null,
              "versionName": null,
              "activityTypeId": 5,
              "activityValue": "editorial",
              "activityDescription": null,
              "activityLabel": "Editorial",
              "startDate": "2016-04-15 00:04:00",
              "duration": "4.50",
              "notes": null,
              "status": 6,
              "statusName": "Pending Review"
            },
            {
              "id": 9,
              "userId": 1,
              "projectId": 1,
              "projectName": "Babysitter",
              "campaignId": 2,
              "campaignName": "Graphics Campaign",
              "spotId": null,
              "spotName": null,
              "versionId": null,
              "versionName": null,
              "activityTypeId": 5,
              "activityValue": "editorial",
              "activityDescription": null,
              "activityLabel": "Editorial",
              "startDate": "2017-01-04 16:59:14",
              "duration": "4.50",
              "notes": null,
              "status": null,
              "statusName": null
            },
            {
              "id": 10,
              "userId": 1,
              "projectId": 2,
              "projectName": "Before I Wake",
              "campaignId": 3,
              "campaignName": "Interactive Campaign",
              "spotId": null,
              "spotName": null,
              "versionId": null,
              "versionName": null,
              "activityTypeId": 5,
              "activityValue": "editorial",
              "activityDescription": null,
              "activityLabel": "Editorial",
              "startDate": "2017-01-04 16:59:14",
              "duration": "4.50",
              "notes": null,
              "status": 1,
              "statusName": "Draft"
            },
        {...}
    ]
}
```

### HTTP Request

`GET /time-entry`

##### Send request as bellow:

`GET /time-entry`

or 

`GET /time-entry?user_id=1`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | length | int | null | Limit number of returned results
false | offset | int | null | Offset returned results
false | user_id | int | null | user id (for filtering data)
false | start_date | date | null | start date (for filtering data). send informat 'Y-m-d'
false | end_date | date | null | end date (for filtering data). send informat 'Y-m-d'





## Get single time entry

Retrieve single time entry based on its ID.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": "2",
        "userId": 1,
        "projectId": 2,
        "projectName": "Before I Wake",
        "campaignId": 2,
        "campaignName": "Graphics Campaign",
        "spotId": 1,
        "spotName": "Take Over :10",
        "versionId": 2,
        "versionName": "1a",
        "activityTypeId": 3,
        "activityValue": "dailies",
        "activityDescription": null,
        "activityLabel": "Digitize / Assemble Dailies",
        "startDate": "2016-04-15",
        "duration": null,
        "notes": "some note",
        "status": 6,
        "statusName": "Pending Review"
    }
}
```

### HTTP Request

`GET /time-entry/<time_entry_id>`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | time_entry_id | int | null | Narrow response to single time entry with specific ID





## Create time entry

Create a new time entry with user entered data.

> Sample request

```javascript
axios.post('/time-entry', {
    worker_id: 1,
    start_date_time: '2017-01-04T16:59:14.078Z',
    duration: 4.5,
    project_id: 1,
    campaign_id: 1,    
    spot_id: 1,
    version_id: 2,
    activity_type_id: 3,
    activity_description: 'Globe animation',
    non_billable: true
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "9"
    }
}
```

### HTTP Request

`POST /time-entry`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | start_date_time | datetime | null | Specifies at which date and time work started
**true** | duration | float | null | Specifies how many hours work lasted(send value in H.M format, if duration is 5 Hour and 30 min, then send 5.30)
**true** | activity_type_id | int | null | ID of the activity type picked by worker(if not provided current logged in user will be used)
false | worker_id | int | null | Specifies worker which has entered the timesheet
false | project_id | int | null | Project on which work happened
false | campaign_id | int | null | Campaign on which work happened
false | spot_id | int | null | Spot on which work happened
false | version_id | int | null | Spot version on which work happened
false | activity_description | string | null | Selected activity type's additional notes
false | notes | string | null | Estimate notes
false | non_billable | bool | false | Defines if time entry is billable or not




## Update time entry

Update existing time entry with.

** Data can only be updated if it is in 'Draft' status.

> Sample request

```javascript
axios.put('/time-entry/12', {
    start_date_time: '2017-01-04T16:59:14.078Z',
    duration: 9.45,
    project_id: 2,
    activity_type_id: 3,
    activity_description: 'Globe animation',
    non_billable: true
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "id": "12",
        "userId": 3,
        "projectId": 2,
        "projectName": "Before I Wake",
        "campaignId": 3,
        "campaignName": "Interactive Campaign",
        "spotId": null,
        "spotName": null,
        "versionId": null,
        "versionName": null,
        "activityTypeId": 3,
        "activityValue": "assistant",
        "activityDescription": "Globe animation",
        "activityLabel": "Assistant Editorial Work",
        "startDate": "2017-01-04 16:59:14",
        "duration": "9.45",
        "notes": null,
        "status": 1,
        "statusName": "Draft"
    }
}
```

### HTTP Request

`PUT /time-entry`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | start_date_time | datetime | null | Specifies at which date and time work started
false | duration | float | null | Specifies how many hours work lasted(send value in H.M format, if duration is 5 Hour and 30 min, then send 5.30)
false | activity_type_id | int | null | ID of the activity type picked by worker(if not provided current logged in user will be used)
false | project_id | int | null | Project on which work happened
false | campaign_id | int | null | Campaign on which work happened
false | spot_id | int | null | Spot on which work happened
false | version_id | int | null | Spot version on which work happened
false | activity_description | string | null | Selected activity type's additional notes
false | notes | string | null | Estimate notes
false | non_billable | bool | null | Defines if time entry is billable or not(send true or false)



## Submit time entry for review

Submit time entry for review.

> Sample request

```javascript
axios.post('/time-entry-submit-for-review', {
    worker_id: 1,
    date: '2016-09-30'
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

`POST /time-entry-submit-for-review`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | date | date | null | date for time entry
false | worker_id | int | current user id | Specifies worker which has entered the timesheet
