# Customer (client)





## Get customer list

Retrieve list of customer.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "total_count": 3,
    "object_count": 3,
    "data": [
        {
            "id": 3,
            "customerName": "antoher customer 3"
        },
        {
            "id": 1,
            "customerName": "Test Customer 1"
        },
        {
            "id": 2,
            "customerName": "Test Customer 2"
        }
    ]
}
```

### HTTP Request

`GET /customer`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | length | int | 10 | Limit number of returned results
false | offset | int | 0 | Offset returned results
false | search | string | null | search string which will match with: customer name
false | first_letter | string | null | send this param for filter with first letter of customer name (send '0-9' or any letter from 'A' to 'Z' or for others send 'other')





## Get single customer

Retrieve single customer based on its ID.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": {
        "id": 1,
        "customerName": "Test Customer 1",
        "contact": [
            {
                "id": 1,
                "customerId": 1,
                "firstName": "custom",
                "lastName": "one",
                "email": null,
                "phone": "8888877",
                "note": "some not for custmer contact 1",
                "status": 1
            },
            {
                "id": 2,
                "customerId": 1,
                "firstName": "custome",
                "lastName": "one one",
                "email": "ea@cc.com",
                "phone": null,
                "note": null,
                "status": 0
            }
        ]
    }
}
```


### HTTP Request

`GET /customer/[:customer_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | customer_id | int | null | Narrow response to single customer with specific ID





## Get distinct first letter of customer name

Retrieve only distinct first letter of customer name.

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        "0-9",
        "A",
        "B",
        "D",
        "G",
        "L",
        "M",
        "T",
        "Z",
        "Other"
    ]
}
```

### HTTP Request

`GET /customer/first-letters`



## Get Customer Contact of a customer

Get all contact of a customer

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful",
    "data": [
        {
            "id": 16,
            "customerId": 10,
            "name": "cc 101",
            "email": "test@gmail.com",
            "mobilePhone": null,
            "officePhone": null,
            "postalAddress": null,
            "projectCampaign": [
                {
                    "projectId": 1,
                    "projectName": "Babysitter",
                    "campaignId": 2,
                    "campaignName": "Graphics Campaign"
                },
                {
                    "projectId": 3,
                    "projectName": "Bravo 14",
                    "campaignId": 5,
                    "campaignName": "AV Campaign"
                }
            ]
        }
    ]
}
```


### HTTP Request

`GET /customer-contact?customer_id=[:customer_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | customer_id | int | null | Customer id
false | search | string | null | Search string (will match with name and email)


## Create Customer Contact

Create customer contact

> Sample request

```javascript
axios.post('/customer-contact', {
    customer_id:10,
    name:'test customer',
    email:'test@gmail.com',
    project_campaign:[{"project_id":1,"campaign_id":2},{"project_id":3,"campaign_id":5}]
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful.",
    "data": {
        "customer_contact_id": 16
    }
}
```

### HTTP Request

`POST /customer-contact`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | customer_id | int | null | Customer ID
**true** | name | string | null | Name
false | email | string | null | Email address
false | mobile_phone | string | null | Mobile phone number
false | office_phone | string | null | Office phone number
false | postal_address | string | null | Postal address
false | project_campaign | JSON | null | Project to campaign relation 


## Update Customer Contact

Create customer contact

** if project_campaign is sent then all previous entry for that customer contact(for project campaign data) will be removed and the data will be added in database

> Sample request

```javascript
axios.put('/customer-contact', {
    customer_id:10,
    name:'test customer',
    email:'test@gmail.com',
    project_campaign:[{"project_id":1,"campaign_id":2},{"project_id":3,"campaign_id":5}]
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

`PUT /customer-contact`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | customer_id | int | null | Customer ID
false| name | string | null | Name
false | email | string | null | Email address
false | mobile_phone | string | null | Mobile phone number
false | office_phone | string | null | Office phone number
false | postal_address | string | null | Postal address
false | project_campaign | JSON | null | Project to campaign relation 


## Patch Customer Contact

Create customer contact

** if project_campaign is sent then all previous entry for that customer contact(for project campaign data) will be kept and the data will be added in database

> Sample request

```javascript
axios.patch('/customer-contact', {
    customer_id:10,
    name:'test customer',
    email:'test@gmail.com',
    project_campaign:[{"project_id":1,"campaign_id":2},{"project_id":3,"campaign_id":5}]
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

`PATCH /customer-contact`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
false | customer_id | int | null | Customer ID
false| name | string | null | Name
false | email | string | null | Email address
false | mobile_phone | string | null | Mobile phone number
false | office_phone | string | null | Office phone number
false | postal_address | string | null | Postal address
false | project_campaign | JSON | null | Project to campaign relation 


## Assign Customer Contact to Project campaign

Assign Customer Contact to Project campaign relation

> Sample request

```javascript
axios.post('/assign-customer-contact-to-project-campaign', {
    contact_id:10,
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

`POST /assign-customer-contact-to-project-campaign`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | contact_id | int | null | Customer contact ID
**true** | project_id | string | null | Project ID
**true** | campaign_id | string | null | Campaign ID


## Delete Customer Contact to Project campaign

Delete assign Customer Contact to Project campaign relation

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

### HTTP Request

`DELETE /assign-customer-contact-to-project-campaign/[:contact_id]/[:project_id]/[:campaign_id]`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | contact_id | int | null | Customer contact ID
**true** | project_id | string | null | Project ID
**true** | campaign_id | string | null | Campaign ID