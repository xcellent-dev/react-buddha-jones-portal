# Work Stage

## All work stage

Get list of all work stage

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 1,
            "name": "Active work"
        },
        {
            "id": 2,
            "name": "Finishing Prep",
            "children": [
                {
                    "id": 4,
                    "name": "Audio Prep"
                },
                {
                    "id": 5,
                    "name": "Picture Prep"
                },
                {
                    "id": 6,
                    "name": "Unmatted"
                },
                {
                    "id": 7,
                    "name": "Other"
                },
                {
                    "id": 8,
                    "name": "MX Cue Sheet Sent"
                },
                {
                    "id": 9,
                    "name": "VO Artist"
                },
                {
                    "id": 10,
                    "name": "Final Version In-House"
                }
            ]
        },
        {
            "id": 3,
            "name": "Finished Spot",
            "children": [
                {
                    "id": 11,
                    "name": "Creative Approval"
                },
                {
                    "id": 12,
                    "name": "Technical Approval"
                },
                {
                    "id": 13,
                    "name": "Delivery / Ingest"
                },
                {
                    "id": 14,
                    "name": "Submasters / Assets"
                }
            ]
        }
    ]
}
```


### HTTP Request

`GET /work-stage`
