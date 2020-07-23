# Password Reset





## Validate token

Validate token, reset/change auto generated password and send in email
 

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful"
}
```

If token is valid a random password will be generated. (changes will be done in database ), and new password will be sent to user in email


If the user wants to change the auto generate password- he can login and change his password (use /user api POST request for that)

### HTTP Request

`GET /password-reset`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | token | string | null | token obtained from the link in email sent for password reset request






## Create password reset request

create a password reset request



> Sample request

```javascript
axios.post('/password-reset', {
    email: 'abc@gmail.com',
    url: 'http://buddhajones.com/resetpassword/'
});
```

> 200: success response

```json
{
    "status": 1,
    "message": "Request successful."
}
```

> 400: failure response

```json
{
    "status": 0,
    "message": "Please provide required data (email (or user name), url)."
}
```

or 


```json
{
    "status": 0,
    "message": "User not found."
}
```

or 


```json
{
    "status": 0,
    "message": "User does not have email address."
}
```

### HTTP Request

`POST /password-reset`

### Query Parameters

Required | Parameter | Type | Default | Description
-------- | --------- | ---- | ------- | -----------
**true** | email | string | null | email address, or send user name. use param name 'email' in both cases
**true** | url | string | null | url or the site frontend. the generated token will be added at the end of that url and the full lini will be sent in email. say, the site url is http:/redi.buddhajones.com , and password reset route is /reset-password (on frontend) and this route expectes a param named token like ?token=[:some_token_here]. Then you need to send 'http://redi.buddhajones.com/reset-password?token=' in 'url' parameter. when user click on the link, he goes to fronend token validation, and the site takes the token and send a validation request to the api function /password-reset  GET request
