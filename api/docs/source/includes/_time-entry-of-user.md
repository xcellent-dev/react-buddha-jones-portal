# Time entry of user


## Get time entry of user

Retrieve list of time entry of user in a date range.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "2016-04-10": [],
        "2016-04-11": [],
        "2016-04-12": [
            {
                "id": "3",
                "projectId": null,
                "projectName": null,
                "campaignId": null,
                "campaignName": null,
                "spotId": 1,
                "spotName": "Take Over :10",
                "versionId": 2,
                "versionName": "1a",
                "activityTypeId": 3,
                "activityValue": "dailies",
                "activityDescription": null,
                "activityLabel": "Digitize / Assemble Dailies",
                "startDate": "2016-04-12",
                "duration": "90.00",
                "notes": "some note",
                "status": null,
                "statusName": null
            },
            {
                "id": "6",
                "projectId": null,
                "projectName": null,
                "campaignId": null,
                "campaignName": null,
                "spotId": 1,
                "spotName": "Take Over :10",
                "versionId": 2,
                "versionName": "1a",
                "activityTypeId": 3,
                "activityValue": "dailies",
                "activityDescription": null,
                "activityLabel": "Digitize / Assemble Dailies",
                "startDate": "2016-04-12",
                "duration": "20.45",
                "notes": "some note",
                "status": null,
                "statusName": null
            }
        ],
        "2016-04-13": [
            {
                "id": "4",
                "projectId": null,
                "projectName": null,
                "campaignId": null,
                "campaignName": null,
                "spotId": 1,
                "spotName": "Take Over :10",
                "versionId": 2,
                "versionName": "1a",
                "activityTypeId": 3,
                "activityValue": "dailies",
                "activityDescription": null,
                "activityLabel": "Digitize / Assemble Dailies",
                "startDate": "2016-04-13",
                "duration": null,
                "notes": "some note",
                "status": null,
                "statusName": null
            }
        ],
        "2016-04-14": [],
        "2016-04-15": [
            {
                "id": "2",
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
            },
            {
                "id": "5",
                "projectId": null,
                "projectName": null,
                "campaignId": null,
                "campaignName": null,
                "spotId": 1,
                "spotName": "Take Over :10",
                "versionId": 2,
                "versionName": "1a",
                "activityTypeId": 3,
                "activityValue": "dailies",
                "activityDescription": null,
                "activityLabel": "Digitize / Assemble Dailies",
                "startDate": "2016-04-15",
                "duration": "80.30",
                "notes": "some note",
                "status": 6,
                "statusName": "Pending Review"
            },
            {
                "id": "8",
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
                "startDate": "2016-04-15",
                "duration": "4.50",
                "notes": null,
                "status": 6,
                "statusName": "Pending Review"
            }
        ],
        "2016-04-16": []
    }
}
```

### HTTP Request

`GET /time-entry-of-user`


##### Send request like

`/time-entry-of-user?start_date=2016-04-10&end_date=2016-04-16`


### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | start_date | date | null | Start date
**true** | end_date | date | null | End date
false | worker_id | int | logged in user id | worker id (user id).