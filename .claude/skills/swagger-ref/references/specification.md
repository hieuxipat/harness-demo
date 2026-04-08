# Swagger - Specification

**Pages:** 95

---

## Basic Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/basic-authentication/

**Contents:**
- Basic Authentication
  - Describing Basic Authentication
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Basic authentication is a simple authentication scheme built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the word Basic followed by a space and a base64-encoded string username:password. For example, to authorize as demo / p@55w0rd the client would send

Note: Because base64 is easily decoded, Basic authentication should only be used together with other security mechanisms such as HTTPS/SSL.

Using OpenAPI 3.0, you can describe Basic authentication as follows:

The first section, securitySchemes, defines a security scheme named basicAuth (an arbitrary name). This scheme must have type: http and scheme: basic. The security section then applies Basic authentication to the entire API. The square brackets [] denote the security scopes used; the list is empty because Basic authentication does not use scopes. security can be set globally (as in the example above) or on the operation level. The latter is useful if only a subset of operations require Basic authentication:

Basic authentication can also be combined with other authentication methods as explained in Using Multiple Authentication Types.

You can also define the 401 “Unauthorized” response returned for requests with missing or incorrect credentials. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global components/responses section and referenced elsewhere via $ref.

To learn more about the responses syntax, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1Authorization: Basic ZGVtbzpwQDU1dzByZA==
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3components:4  securitySchemes:5    basicAuth: # <-- arbitrary name for the security scheme6      type: http7      scheme: basic8
9security:10  - basicAuth: [] # <-- use the same name here
```

Example 3 (yaml):
```yaml
1paths:2  /something:3    get:4      security:5        - basicAuth: []
```

Example 4 (lua):
```lua
1paths:2  /something:3    get:4      ...5      responses:6        ...7        '401':8            $ref: '#/components/responses/UnauthorizedError'9    post:10      ...11      responses:12        ...13        '401':14          $ref: '#/components/responses/UnauthorizedError'15...16components:17  responses:18    UnauthorizedError:19      description: Authentication information is missing or invalid20      headers:21        WWW_Authenticate:22          schema:23            type: string
```

---

## Grouping Operations With Tags | Swagger Docs

**URL:** https://swagger.io/docs/specification/grouping-operations-with-tags

**Contents:**
- Grouping Operations With Tags

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can assign a list of tags to each API operation. Tagged operations may be handled differently by tools and libraries. For example, Swagger UI uses tags to group the displayed operations.

Optionally, you can specify description and externalDocs for each tag by using the global tags section on the root level. The tag names here should match those used in operations.

The tag order in the global tags section also controls the default sorting in Swagger UI. Note that it is possible to use a tag in an operation even if it is not defined on the root level.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /pet/findByStatus:3    get:4      summary: Finds pets by Status5      tags:6        - pets7      ...8  /pet:9    post:10      summary: Adds a new pet to the store11      tags:12        - pets13      ...14  /store/inventory:15    get:16      summary: Returns pet inventories17      tags:18        - store19      ...
```

Example 2 (yaml):
```yaml
1tags:2  - name: pets3    description: Everything about your Pets4    externalDocs:5      url: http://docs.my-api.com/pet-operations.htm6  - name: store7    description: Access to Petstore orders8    externalDocs:9      url: http://docs.my-api.com/store-orders.htm
```

---

## Enums | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/enums/

**Contents:**
- Enums
  - Nullable enums
  - Reusable enums

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can use the enum keyword to specify possible values of a request parameter or a model property. For example, the sort parameter in GET /items?sort=[asc|desc] can be described as:

In YAML, you can also specify one enum value per line:

All values in an enum must adhere to the specified type. If you need to specify descriptions for enum items, you can do this in the description of the parameter or property:

A nullable enum can be defined as follows:

Note that null must be explicitly included in the list of enum values. Using nullable: true alone is not enough here.

In OpenAPI 3.0, both operation parameters and data models use a schema, making it easy to reuse the data types. You can define reusable enums in the global components section and reference them via $ref elsewhere.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /items:3    get:4      parameters:5        - in: query6          name: sort7          description: Sort order8          schema:9            type: string10            enum: [asc, desc]
```

Example 2 (yaml):
```yaml
1enum:2  - asc3  - desc
```

Example 3 (sql):
```sql
1parameters:2  - in: query3    name: sort4    schema:5      type: string6      enum: [asc, desc]7    description: >8      Sort order:9       * `asc` - Ascending, from A to Z10       * `desc` - Descending, from Z to A
```

Example 4 (yaml):
```yaml
1type: string2nullable: true  # <---3enum:4  - asc5  - desc6  - null        # <--- without quotes, i.e. null not "null"
```

---

## Callbacks | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/callbacks/

**Contents:**
- Callbacks
  - Callback Example
  - Use Runtime Expressions to Refer to Request Fields
  - Multiple Callbacks
  - Unsubscribing From Callbacks

OAS 3 This guide is for OpenAPI 3.0.

In OpenAPI 3 specs, you can define callbacks – asynchronous, out-of-band requests that your service will send to some other service in response to certain events. This helps you improve the workflow your API offers to clients. A typical example of a callback is subscription functionality – users subscribe to certain events of your service and receive a notification when this or that event occurs. For example, an e-shop can send a notification to the manager on each purchase. These notifications will be “out-of-band”, that is, they will go through a connection other than the connection through which a visitor works, and they will be asynchronous, as they will be out of the regular request-response flow. In OpenAPI 3, you can define the format of the “subscription” operation as well as the format of callback messages and expected responses to these messages. This description will simplify communication between different servers and will help you standardize the use of webhooks in your API.

Let’s create a callback definition – a simple webhook notification. Suppose, your API provides a POST /subscribe operation that expects a callback URL in the request body:

The API acknowledges the subscription —

— and later sends notifications on certain events:

Let’s now define the /subscribe operation:

Now let’s add the callbacks keyword to this operation to define a callback:

Let’s walk through this definition line by line:

This does not mean that the API will send callbacks only when this operation is working. Your API will send callback requests when the business logic of your service requires. The hierarchy of keywords simply lets you use parameters of the /subscribe operation to configure the callback requests (see below).

This expression tells that the callback URL will be based on the parameters of the /subscribe operation. We will tell more about these expressions a bit later.

Please note that when you define a callback, you define a specification of your API. The actual implementation of the callback functionality is done in the server code.

As you can see, we use the {$request.body#/callbackUrl} expression in our example. It is a runtime expression that sets which data of the POST /subscribe request will be used in callbacks. Runtime means that unlike API endpoints, this URL is not known beforehand and is evaluated at run time based on the data supplied by API clients. This value varies from one client to another. For example, the POST /subscribe request can look as follows:

You can use the following expressions to refer to its data:

You can combine a runtime expression with static data in callback definitions. For instance, you can define the callback URL in the following way:

You can use expressions to specify query parameters:

If the string includes both runtime expressions and static text, you should enclose the runtime expressions in curly braces. If the whole string is a runtime expression, you can skip the curly braces.

As we have said above, you can use one “subscription” operation to define multiple callbacks:

The way you implement the unsubscription mechanism is up to you. For example, the receiving server can return specific code in response to the callback message to indicate that it is no longer interested in callbacks. In this case, clients can unsubscribe only in response to a callback request. To allow clients to unsubscribe at any time, your API can provide a special “unsubscribe” operation. This is a rather common approach. In this case, your service can generate an ID or token for each subscriber and return this ID or token in a response to the “subscription” request. To unsubscribe, a client can pass this ID to the “unsubscribe” operation to specify the subscriber to be removed. The following example demonstrates how you can define this behavior in your spec:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1POST /subscribe2Host: my.example.com3Content-Type: application/json4
5{6  "callbackUrl": "https://myserver.com/send/callback/here"7}
```

Example 2 (unknown):
```unknown
1HTTP/1.1 201 Created
```

Example 3 (json):
```json
1POST /send/callback/here2Host: myserver.com3Content-Type: application/json4
5{6  "message": "Something happened"7}
```

Example 4 (json):
```json
1openapi: 3.0.42info:3  version: 0.0.04  title: test5
6paths:7  /subscribe:8    post:9      summary: Subscribe to a webhook10      requestBody:11        required: true12        content:13          application/json:14            schema:15              type: object16              properties:17                callbackUrl: # Callback URL18                  type: string19                  format: uri20                  example: https://myserver.com/send/callback/here21              required:22                - callbackUrl23      responses:24        "201":25          description: Webhook created
```

---

## Grouping Operations With Tags | Swagger Docs

**URL:** https://swagger.io/docs/specification/grouping-operations-with-tags/

**Contents:**
- Grouping Operations With Tags

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can assign a list of tags to each API operation. Tagged operations may be handled differently by tools and libraries. For example, Swagger UI uses tags to group the displayed operations.

Optionally, you can specify description and externalDocs for each tag by using the global tags section on the root level. The tag names here should match those used in operations.

The tag order in the global tags section also controls the default sorting in Swagger UI. Note that it is possible to use a tag in an operation even if it is not defined on the root level.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /pet/findByStatus:3    get:4      summary: Finds pets by Status5      tags:6        - pets7      ...8  /pet:9    post:10      summary: Adds a new pet to the store11      tags:12        - pets13      ...14  /store/inventory:15    get:16      summary: Returns pet inventories17      tags:18        - store19      ...
```

Example 2 (yaml):
```yaml
1tags:2  - name: pets3    description: Everything about your Pets4    externalDocs:5      url: http://docs.my-api.com/pet-operations.htm6  - name: store7    description: Access to Petstore orders8    externalDocs:9      url: http://docs.my-api.com/store-orders.htm
```

---

## OAuth 2.0 | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/oauth2/

**Contents:**
- OAuth 2.0
  - Flows
  - Describing OAuth 2.0 Using OpenAPI
  - About Scopes
    - No Scopes
  - Relative Endpoint URLs
  - Security Scheme Examples
    - Authorization Code Flow
    - Implicit Flow
    - Resource Owner Password Flow

OAS 3 This guide is for OpenAPI 3.0.

OAuth 2.0 is an authorization protocol that gives an API client limited access to user data on a web server. GitHub, Google, and Facebook APIs notably use it. OAuth relies on authentication scenarios called flows, which allow the resource owner (user) to share the protected content from the resource server without sharing their credentials. For that purpose, an OAuth 2.0 server issues access tokens that the client applications can use to access protected resources on behalf of the resource owner. For more information about OAuth 2.0, see oauth.net and RFC 6749.

The flows (also called grant types) are scenarios an API client performs to get an access token from the authorization server. OAuth 2.0 provides several flows suitable for different types of API clients:

To describe an API protected using OAuth 2.0, first, add a security scheme with type: oauth2 to the global components/securitySchemes section. Then add the security key to apply security globally or to individual operations:

The flows keyword specifies one or more named flows supported by this OAuth 2.0 scheme. The flow names are:

The flows object can specify multiple flows, but only one of each type. Each flow contains the following information:

With OpenAPI 3.0, a user can grant scoped access to their account, which can vary depending on the operation the client application wants to perform. Each OAuth access token can be tagged with multiple scopes. Scopes are access rights that control whether the credentials a user provides allow to perform the needed call to the resource server. They do not grant any additional permissions to the client except for those it already has. Note: In the authorization code and implicit flows, the requested scopes are listed on the authorization form displayed to the user. To apply the scopes, you need to perform two steps:

If all API operations require the same scopes, you can add security on the root level of the API definition instead:

Scopes are optional, and your API may not use any. In this case, specify an empty object {} in the scopes definition, and an empty list of scopes [] in the security section:

In OpenAPI 3.0, authorizationUrl, tokenUrl and refreshUrl can be specified relative to the API server URL. This is handy if these endpoints are on same server as the rest of the API operations.

Relative URLs are resolved according to RFC 3986. In the example above, the endpoints will be resolved to:

authorizationUrl: https://api.example.com/oauth/authorize

tokenUrl: https://api.example.com/oauth/token

The authorization flow uses authorizationUrl, tokenUrl and optional refreshUrl. Here is an example for Slack API:

implicit flow defines authorizationUrl that is used to obtain the access token from the authorization server. Here is an example:

The password flow uses tokenUrl and optional refreshUrl. Here is an example:

The clientCredentials flow uses tokenUrl and optional refreshUrl. Here is an example for Getty Images API:

Below is an example of the OAuth 2.0 security definition that supports multiple flows. The clients can use any of these flows.

Should I additionally define authorizationUrl and tokenUrl as API operations?

authorizationUrl is not an API endpoint but a special web page that requires user input. So, it cannot be described using OpenAPI. Still, you can describe tokenUrl if you need it.

Should authorizationUrl and tokenUrl include query string parameters, such as grant_type, client_id and others?

The OpenAPI Specification does not state this, so it is up to you and the tools you use.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1# Step 1 - define the security scheme2components:3  securitySchemes:4    oAuthSample:    # <---- arbitrary name5      type: oauth26      description: This API uses OAuth 2 with the implicit grant flow. [More info](https://api.example.com/docs/auth)7      flows:8        implicit:   # <---- OAuth flow(authorizationCode, implicit, password or clientCredentials)9          authorizationUrl: https://api.example.com/oauth2/authorize10          scopes:11            read_pets: read your pets12            write_pets: modify pets in your account13
14# Step 2 - apply security globally...15security:16  - oAuthSample:17    - write_pets18    - read_pets19
20# ... or to individual operations21paths:22  /pets:23    patch:24      summary: Add a new pet25      security:26        - oAuthSample:27          - write_pets28          - read_pets29      ...
```

Example 2 (yaml):
```yaml
1components:2  securitySchemes:3    oAuthSample:4      type: oauth25      flows:6        implicit:7          authorizationUrl: https://api.example.com/oauth2/authorize8          scopes:9            read_pets: read pets in your account10            write_pets: modify pets in your account
```

Example 3 (lua):
```lua
1paths:2  /pets/{petId}:3    patch:4      summary: Updates a pet in the store5      security:6        - oAuthSample: [write_pets]7      ...
```

Example 4 (swift):
```swift
1security:2  - oAuthSample: [write_pets]
```

---

## Multipart Requests | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/describing-request-body/multipart-requests/

**Contents:**
- Multipart Requests
  - Specifying Content-Type
  - Specifying Custom Headers

OAS 3 This guide is for OpenAPI 3.0.

Multipart requests combine one or more sets of data into a single body, separated by boundaries. You typically use these requests for file uploads and for transferring data of several types in a single request (for example, a file along with a JSON object). In OpenAPI 3, you describe a multipart request in the following way:

You start with the requestBody/content keyword. Then, you specify the media type of request data. File uploads typically use the _multipart/form-data_ media type, and mixed-data requests usually use _multipart/mixed_. Below the media type, put the schema keyword to indicate that you start describing the request payload. You describe individual parts of the request as properties of the schema object. As you can see, a multipart request can include various data: strings, objects in JSON format, and binary data. You can also specify one or several files for uploading. (To learn more, see File Upload.) The example above corresponds to the following request:

By default, the Content-Type of individual request parts is set automatically according to the type of the schema properties that describe the request parts:

Primitive or array of primitives

Complex value or array of complex values

String in the binary or base64 format

application/octet-stream

To set a specific Content-Type for a request part, use the encoding/_{property-name}_/contentType field. You add encoding as a child of the media type property, one the same level where schema is located. In the example below, we set the contentType for the profileImage part of a multipart request to image/png, image/jpg:

Parts of multipart requests usually do not use any headers, except for Content. In case you need to include custom headers, use the encoding/_{property-name}_/headers field to describe these headers (see below). For complete information on describing headers, see Describing Parameters. Below is an example of a custom header defined for a part of a multipart request:

This declaration matches the following request:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data: # Media type4      schema: # Request payload5        type: object6        properties: # Request parts7          id: # Part 1 (string value)8            type: string9            format: uuid10          address: # Part2 (object)11            type: object12            properties:13              street:14                type: string15              city:16                type: string17          profileImage: # Part 3 (an image)18            type: string19            format: binary
```

Example 2 (sass):
```sass
1POST /upload HTTP/1.12Content-Length: 4283Content-Type: multipart/form-data; boundary=abcde123454
5--abcde123456Content-Disposition: form-data; name="id"7Content-Type: text/plain8
9123e4567-e89b-12d3-a456-42665544000010--abcde1234511Content-Disposition: form-data; name="address"12Content-Type: application/json13
14{15  "street": "3, Garden St",16  "city": "Hillsbery, UT"17}18--abcde1234519Content-Disposition: form-data; name="profileImage "; filename="image1.png"20Content-Type: application/octet-stream21
22{…file content…}23--abcde12345--
```

Example 3 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties: # Request parts7          id:8            type: string9            format: uuid10          address:11            type: object12            properties:13              street:14                type: string15              city:16                type: string17          profileImage:18            type: string19            format: base6420      encoding: # The same level as schema21        profileImage: # Property name (see above)22          contentType: image/png, image/jpeg
```

Example 4 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties:7          id:8            type: string9            format: uuid10          profileImage:11            type: string12            format: binary13      encoding:14        profileImage: # Property name15          contentType: image/png, image/jpeg16          headers: # Custom headers17            X-Custom-Header:18              description: This is a custom header19              schema:20                type: string
```

---

## Basic Structure | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/basic-structure/

**Contents:**
- Basic Structure
  - Metadata
  - Servers
  - Paths

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, visit OpenAPI 2.0 pages.

You can write OpenAPI definitions in YAML or JSON. In this guide, we use only YAML examples but JSON works equally well. A sample OpenAPI 3.0 definition written in YAML looks like:

All keyword names are case-sensitive.

Every API definition must include the version of the OpenAPI Specification that this definition is based on:

The OpenAPI version defines the overall structure of an API definition – what you can document and how you document it. OpenAPI 3.0 uses semantic versioning with a three-part version number. The available versions are 3.0.0, 3.0.1, 3.0.2, 3.0.3, and 3.0.4; they are functionally the same.

The info section contains API information: title, description (optional), version:

title is your API name. description is extended information about your API. It can be multiline and supports the CommonMark dialect of Markdown for rich text representation. HTML is supported to the extent provided by CommonMark (see HTML Blocks in CommonMark 0.27 Specification). version is an arbitrary string that specifies the version of your API (do not confuse it with file revision or the openapi version). You can use semantic versioning like major.minor.patch, or an arbitrary string like 1.0-beta or 2017-07-25. info also supports other keywords for contact information, license, terms of service, and other details.

Reference: Info Object.

The servers section specifies the API server and base URL. You can define one or several servers, such as production and sandbox.

All API paths are relative to the server URL. In the example above, /users means http://api.example.com/v1/users or http://staging-api.example.com/users, depending on the server used. For more information, see API Server and Base Path.

The paths section defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints. For example, GET /users can be described as:

**Examples:**

Example 1 (json):
```json
1openapi: 3.0.42info:3  title: Sample API4  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.5  version: 0.1.96
7servers:8  - url: http://api.example.com/v19    description: Optional server description, e.g. Main (production) server10  - url: http://staging-api.example.com11    description: Optional server description, e.g. Internal staging server for testing12
13paths:14  /users:15    get:16      summary: Returns a list of users.17      description: Optional extended description in CommonMark or HTML.18      responses:19        "200": # status code20          description: A JSON array of user names21          content:22            application/json:23              schema:24                type: array25                items:26                  type: string
```

Example 2 (yaml):
```yaml
1openapi: 3.0.4
```

Example 3 (yaml):
```yaml
1info:2  title: Sample API3  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.4  version: 0.1.9
```

Example 4 (yaml):
```yaml
1servers:2  - url: http://api.example.com/v13    description: Optional server description, e.g. Main (production) server4  - url: http://staging-api.example.com5    description: Optional server description, e.g. Internal staging server for testing
```

---

## Describing Parameters | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/describing-parameters/

**Contents:**
- Describing Parameters
  - Parameter Types
  - Path Parameters
  - Query Parameters
    - Reserved Characters in Query Parameters
  - Header Parameters
  - Cookie Parameters
  - Required and Optional Parameters
  - schema vs content
  - Default Parameter Values

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

In OpenAPI 3.0, parameters are defined in the parameters section of an operation or path. To describe a parameter, you specify its name, location (in), data type (defined by either schema or content) and other attributes, such as description or required. Here is an example:

Note that parameters is an array, so, in YAML, each parameter definition must be listed with a dash (-) in front of it.

OpenAPI 3.0 distinguishes between the following parameter types based on the parameter location. The location is determined by the parameter’s in key, for example, in: query or in: path.

Path parameters are variable parts of a URL path. They are typically used to point to a specific resource within a collection, such as a user identified by ID. A URL can have several path parameters, each denoted with curly braces { }.

Each path parameter must be substituted with an actual value when the client makes an API call. In OpenAPI, a path parameter is defined using in: path. The parameter name must be the same as specified in the path. Also remember to add required: true, because path parameters are always required. For example, the /users/{id} endpoint would be described as:

Path parameters containing arrays and objects can be serialized in different ways:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

Query parameters are the most common type of parameters. They appear at the end of the request URL after a question mark (?), with different name=value pairs separated by ampersands (&). Query parameters can be required and optional.

Use in: query to denote query parameters:

Note: To describe API keys passed as query parameters, use securitySchemes and security instead. See API Keys.

Query parameters can be primitive values, arrays and objects. OpenAPI 3.0 provides several ways to serialize objects and arrays in the query string.

Arrays can be serialized as:

Objects can be serialized as:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

RFC 3986 defines a set of reserved characters :/?#[]@!$&'()*+,;= that are used as URI component delimiters. When these characters need to be used literally in a query parameter value, they are usually percent-encoded. For example, / is encoded as %2F (or %2f), so that the parameter value quotes/h2g2.txt would be sent as

If you want a query parameter that is not percent-encoded, add allowReserved: true to the parameter definition:

In this case, the parameter value would be sent like so:

An API call may require that custom headers be sent with an HTTP request. OpenAPI lets you define custom request headers as in: header parameters. For example, suppose, a call to GET /ping requires the X-Request-ID header:

Using OpenAPI 3.0, you would define this operation as follows:

In a similar way, you can define custom response headers. Header parameter can be primitives, arrays and objects. Arrays and objects are serialized using the simple style. For more information, see Parameter Serialization.

Note: Header parameters named Accept, Content-Type and Authorization are not allowed. To describe these headers, use the corresponding OpenAPI keywords:

Operations can also pass parameters in the Cookie header, as Cookie: name=value. Multiple cookie parameters are sent in the same header, separated by a semicolon and space.

Use in: cookie to define cookie parameters:

Cookie parameters can be primitive values, arrays and objects. Arrays and objects are serialized using the form style. For more information, see Parameter Serialization.

Note: To define cookie authentication, use API keys instead.

By default, OpenAPI treats all request parameters as optional. You can add required: true to mark a parameter as required. Note that path parameters must have required: true, because they are always required.

To describe the parameter contents, you can use either the schema or content keyword. They are mutually exclusive and used in different scenarios. In most cases, you would use schema. It lets you describe primitive values, as well as simple arrays and objects serialized into a string. The serialization method for array and object parameters is defined by the style and explode keywords used in that parameter.

content is used in complex serialization scenarios that are not covered by style and explode. For example, if you need to send a JSON string in the query string like so:

In this case, you need to wrap the parameter schema into content/<media-type> as shown below. The schema defines the parameter data structure, and the media type (in this example – application/json) serves as a reference to an external specification that describes the serialization format.

Note for Swagger UI and Swagger Editor users: Parameters with content are supported in Swagger UI 3.23.7+ and Swagger Editor 3.6.34+.

Use the default keyword in the parameter schema to specify the default value for an optional parameter. The default value is the one that the server uses if the client does not supply the parameter value in the request. The value type must be the same as the parameter’s data type. A typical example is paging parameters such as offset and limit:

Assuming offset defaults to 0 and limit defaults to 20 and ranges from 0 to 100, you would define these parameters as:

There are two common mistakes when using the default keyword:

You can restrict a parameter to a fixed set of values by adding the enum to the parameter’s schema. The enum values must be of the same type as the parameter data type.

More info: Defining an Enum.

You can define a constant parameter as a required parameter with only one possible value:

The enum property specifies possible values. In this example, only one value can be used, and this will be the only value available in the Swagger UI for the user to choose from.

Note: A constant parameter is not the same as the default parameter value. A constant parameter is always sent by the client, whereas the default value is something that the server uses if the parameter is not sent by the client.

Query string parameters may only have a name and no value, like so:

Use allowEmptyValue to describe such parameters:

OpenAPI 3.0 also supports nullable in schemas, allowing operation parameters to have the null value. For example, the following schema corresponds to int? in C# and java.lang.Integer in Java:

Note: nullable is not the same as an optional parameter or an empty-valued parameter. nullable means the parameter value can be null. Specific implementations may choose to map an absent or empty-valued parameter to null, but strictly speaking these are not the same thing.

You can specify an example or multiple examples for a parameter. The example value should match the parameter schema. Single example:

Multiple named examples:

For details, see Adding Examples.

Use deprecated: true to mark a parameter as deprecated.

Parameters shared by all operations of a path can be defined on the path level instead of the operation level. Path-level parameters are inherited by all operations of that path. A typical use case are the GET/PUT/PATCH/DELETE operations that manipulate a resource accessed via a path parameter.

Any extra parameters defined at the operation level are used together with path-level parameters:

Specific path-level parameters can be overridden on the operation level, but cannot be removed.

Different API paths may have common parameters, such as pagination parameters. You can define common parameters under parameters in the global components section and reference them elsewhere via $ref.

Note that the parameters defined in components are not parameters applied to all operations — they are simply global definitions that can be easily re-used.

OpenAPI 3.0 does not support parameter dependencies and mutually exclusive parameters. There is an open feature request at https://github.com/OAI/OpenAPI-Specification/issues/256. What you can do is document the restrictions in the parameter description and define the logic in the 400 Bad Request response. For example, consider the /report endpoint that accepts either a relative date range (rdate) or an exact range (start_date+end_date):

You can describe this endpoint as follows:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /users/{userId}:3    get:4      summary: Get a user by ID5      parameters:6        - in: path7          name: userId8          schema:9            type: integer10          required: true11          description: Numeric ID of the user to get
```

Example 2 (unknown):
```unknown
1GET /users/{id}2GET /cars/{carId}/drivers/{driverId}3GET /report.{format}
```

Example 3 (yaml):
```yaml
1paths:2  /users/{id}:3    get:4      parameters:5        - in: path6          name: id # Note the name is the same as in the path7          required: true8          schema:9            type: integer10            minimum: 111          description: The user ID
```

Example 4 (sass):
```sass
1GET /pets/findByStatus?status=available2GET /notes?offset=100&limit=50
```

---

## Data Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/data-types/

**Contents:**
- Data Types
  - Mixed Types
  - Numbers
    - Minimum and Maximum
    - Multiples
  - Strings
    - String Formats
    - pattern
  - Boolean
  - Null

OAS 3 This guide is for OpenAPI 3.0.

The data type of a schema is defined by the type keyword, for example, type: string. OpenAPI defines the following basic types:

These types exist in most programming languages, though they may go by different names. Using these types, you can describe any data structures.

Note that there is no null type; instead, the nullable attribute is used as a modifier of the base type.

Additional type-specific keywords can be used to refine the data type, for example, limit the string length or specify an enum of possible values.

type takes a single value. type as a list is not valid in OpenAPI (even though it is valid in JSON Schema):

Mixed types can be described using oneOf and anyOf, which specify a list of alternate types:

OpenAPI has two numeric types, number and integer, where number includes both integer and floating-point numbers. An optional format keyword serves as a hint for the tools to use a specific numeric type:

Note that strings containing numbers, such as “17”, are considered strings and not numbers.

Use the minimum and maximum keywords to specify the range of possible values:

By default, the minimum and maximum values are included in the range, that is:

To exclude the boundary values, specify exclusiveMinimum: true and exclusiveMaximum: true. For example, you can define a floating-point number range as 0–50 and exclude the 0 value:

The word “exclusive” in exclusiveMinimum and exclusiveMaximum means the corresponding boundary is excluded:

Use the multipleOf keyword to specify that a number must be the multiple of another number:

The example above matches 10, 20, 30, 0, -10, -20, and so on. multipleOf may be used with floating-point numbers, but in practice this can be unreliable due to the limited precision or floating point math.

The value of multipleOf must be a positive number, that is, you cannot use multipleOf: -5.

A string of text is defined as:

String length can be restricted using minLength and maxLength:

Note that an empty string "" is a valid string unless minLength or pattern is specified.

An optional format modifier serves as a hint at the contents and format of the string. OpenAPI defines the following built-in string formats:

However, format is an open value, so you can use any formats, even not those defined by the OpenAPI Specification, such as:

Tools can use the format to validate the input or to map the value to a specific type in the chosen programming language. Tools that do not support a specific format may default back to the type alone, as if the format is not specified.

The pattern keyword lets you define a regular expression template for the string value. Only the values that match this template will be accepted. The regular expression syntax used is from JavaScript (more specifically, ECMA 262). Regular expressions are case-sensitive, that is, [a-z] and [A-Z] are different expressions. For example, the following pattern matches a Social Security Number (SSN) in the 123-45-6789 format:

Note that the regular expression is enclosed in the ^…$ tokens, where ^ means the beginning of the string, and $ means the end of the string. Without ^…$, pattern works as a partial match, that is, matches any string that contains the specified regular expression. For example, pattern: pet matches pet, petstore and carpet. The ^…$ token forces an exact match.

type: boolean represents two values: true and false. Note that truthy and falsy values such as “true”, "", 0 or null are not considered boolean values.

OpenAPI 3.0 does not have an explicit null type as in JSON Schema, but you can use nullable: true to specify that the value may be null. Note that null is different from an empty string "".

The example above may be mapped to the nullable types int? in C# and java.lang.Integer in Java. In objects, a nullable property is not the same as an optional property, but some tools may choose to map an optional property to the null value.

Arrays are defined as:

Unlike JSON Schema, the items keyword is required in arrays. The value of items is a schema that describes the type and format of array items. Arrays can be nested:

Item schema can be specified inline (as in the previous examples), or referenced via $ref:

Mixed-type arrays can be defined using oneOf:

oneOf allows both inline subschemas (as in the example above) and references:

An array of arbitrary types can be defined as:

Here, {} is the “any-type” schema (see below). Note that the following syntax for items is not valid:

You can define the minimum and maximum length of an array like so:

Without minItems, an empty array is considered valid.

You can use uniqueItems: true to specify that all items in the array must be unique:

An object is a collection of property/value pairs. The properties keyword is used to define the object properties – you need to list the property names and specify a schema for each property.

Tip: In OpenAPI, objects are usually defined in the global components/schemas section rather than inline in the request and response definitions.

By default, all object properties are optional. You can specify the required properties in the required list:

Note that required is an object-level attribute, not a property attribute:

An empty list required: [] is not valid. If all properties are optional, do not specify the required keyword.

You can use the readOnly and writeOnly keywords to mark specific properties as read-only or write-only. This is useful, for example, when GET returns more properties than used in POST – you can use the same schema in both GET and POST and mark the extra properties as readOnly. readOnly properties are included in responses but not in requests, and writeOnly properties may be sent in requests but not in responses.

If a readOnly or writeOnly property is included in the required list, required affects just the relevant scope – responses only or requests only. That is, read-only required properties apply to responses only, and write-only required properties – to requests only.

An object can include nested objects:

You may want to split nested objects into multiple schemas and use $ref to reference the nested schemas:

A free-form object (arbitrary property/value pairs) is defined as:

This is equivalent to

The minProperties and maxProperties keywords let you restrict the number of properties allowed in an object. This can be useful when using additionalProperties or free-form objects.

In this example, {"id": 5, "username": "trillian"} matches the schema, but {"id": 5} does not.

Unlike OpenAPI 2.0, Open API 3.0 does not have the file type. Files are defined as strings:

depending on the desired file transfer method. For more information, see File Upload, Multipart Requests and Response That Returns a File.

A schema without a type matches any data type – numbers, strings, objects, and so on. {} is shorthand syntax for an arbitrary-type schema:

If you want to provide a description:

The above is equivalent to:

If the null value needs to be allowed, add nullable: true:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1# Incorrect2type:3  - string4  - integer
```

Example 2 (json):
```json
1# Correct2oneOf:3  - type: string4  - type: integer
```

Example 3 (yaml):
```yaml
1type: integer2minimum: 13maximum: 20
```

Example 4 (unknown):
```unknown
1minimum ≤ value ≤ maximum
```

---

## oneOf, anyOf, allOf, not | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/oneof-anyof-allof-not/

**Contents:**
- oneOf, anyOf, allOf, not
  - oneOf
  - allOf
  - anyOf
  - Difference Between anyOf and oneOf
  - not

OAS 3 This guide is for OpenAPI 3.0.

OpenAPI 3.0 provides several keywords which you can use to combine schemas. You can use these keywords to create a complex schema, or validate a value against multiple criteria.

Besides these, there is a not keyword which you can use to make sure the value is not valid against the specified schema.

Use the oneOf keyword to ensure the given data is valid against one of the specified schemas.

The example above shows how to validate the request body in the “update” operation (PATCH). You can use it to validate the request body contains all the necessary information about the object to be updated, depending on the object type. Note the inline or referenced schema must be a schema object, not a standard JSON Schema. Now, to validation. The following JSON object is valid against one of the schemas, so the request body is correct:

The following JSON object is not valid against both schemas, so the request body is incorrect:

The following JSON object is valid against both schemas, so the request body is incorrect – it should be valid against only one of the schemas, since we are using the oneOf keyword.

OpenAPI lets you combine and extend model definitions using the allOf keyword. allOf takes an array of object definitions that are used for independent validation but together compose a single object. Still, it does not imply a hierarchy between the models. For that purpose, you should include the discriminator. To be valid against allOf, the data provided by the client must be valid against all of the given subschemas. In the following example, allOf acts as a tool for combining schemas used in specific cases with the general one. For more clearness, oneOf is also used with a discriminator.

As you can see, this example validates the request body content to make sure it includes all the information needed to update a pet item with the PUT operation. It requires user to specify which type of the item should be updated, and validates against the specified schema according to their choice. Note the inline or referenced schema must be a schema object, not a standard JSON schema. For that example, all of the following request bodies are valid:

The following request bodies are not valid:

Use the anyOf keyword to validate the data against any amount of the given subschemas. That is, the data may be valid against one or more subschemas at the same time.

Note the inline or referenced schema must be a schema object, not a standard JSON schema. With this example, the following JSON request bodies are valid:

The following example is not valid, because it does not contain any of the required properties for both of the schemas:

oneOf matches exactly one subschema, and anyOf can match one or more subschemas. To better understand the difference, use the example above but replace anyOf with oneOf. When using oneOf, the following request body is not valid because it matches both schemas and not just one:

The not keyword does not exactly combine schemas, but as all of the keywords mentioned above it helps you to modify your schemas and make them more specific.

In this example, user should specify the pet_type value of any type except integer (that is, it should be an array, boolean, number, object, or string). The following request body is valid:

And the following is not valid:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    patch:4      requestBody:5        content:6          application/json:7            schema:8              oneOf:9                - $ref: "#/components/schemas/Cat"10                - $ref: "#/components/schemas/Dog"11      responses:12        "200":13          description: Updated14
15components:16  schemas:17    Dog:18      type: object19      properties:20        bark:21          type: boolean22        breed:23          type: string24          enum: [Dingo, Husky, Retriever, Shepherd]25    Cat:26      type: object27      properties:28        hunts:29          type: boolean30        age:31          type: integer
```

Example 2 (json):
```json
1{ "bark": true, "breed": "Dingo" }
```

Example 3 (json):
```json
1{ "bark": true, "hunts": true }
```

Example 4 (json):
```json
1{ "bark": true, "hunts": true, "breed": "Husky", "age": 3 }
```

---

## Paths and Operations | Swagger Docs

**URL:** https://swagger.io/docs/specification/paths-and-operations/

**Contents:**
- Paths and Operations
  - Paths
  - Path Templating
  - Operations
  - Operation Parameters
  - Query String in Paths
  - operationId
  - Deprecated Operations
  - Overriding Global Servers

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

In OpenAPI terms, paths are endpoints (resources), such as /users or /reports/summary/, that your API exposes, and operations are the HTTP methods used to manipulate these paths, such as GET, POST or DELETE.

API paths and operations are defined in the global paths section of the API specification.

All paths are relative to the API server URL. The full request URL is constructed as <server-url>/path. Global servers can also be overridden on the path level or operation level (more on that below). Paths may have an optional short summary and a longer description for documentation purposes. This information is supposed to be relevant to all operations in this path. description can be multi-line and supports Markdown (CommonMark) for rich text representation.

You can use curly braces {} to mark parts of an URL as path parameters:

The API client needs to provide appropriate parameter values when making an API call, such as /users/5 or /users/12.

For each path, you define operations (HTTP methods) that can be used to access that path. OpenAPI 3.0 supports get, post, put, patch, delete, head, options, and trace. A single path can support multiple operations, for example GET /users to get a list of users and POST /users to add a new user. OpenAPI defines a unique operation as a combination of a path and an HTTP method. This means that two GET or two POST methods for the same path are not allowed – even if they have different parameters (parameters have no effect on uniqueness). Below is a minimal example of an operation:

Here is a more detailed example with parameters and response schema:

Operations also support some optional elements for documentation purposes:

OpenAPI 3.0 supports operation parameters passed via path, query string, headers, and cookies. You can also define the request body for operations that transmit data to the server, such as POST, PUT and PATCH. For details, see Describing Parameters and Describing Request Body.

Query string parameters must not be included in paths. They should be defined as query parameters instead.

This also means that it is impossible to have multiple paths that differ only in query string, such as:

This is because OpenAPI considers a unique operation as a combination of a path and the HTTP method, and additional parameters do not make the operation unique. Instead, you should use unique paths such as:

operationId is an optional unique string used to identify an operation. If provided, these IDs must be unique among all operations described in your API.

Some common use cases for operationId are:

You can mark specific operations as deprecated to indicate that they should be transitioned out of usage:

Tools may handle deprecated operations in a specific way. For example, Swagger UI displays them with a different style:

The global servers array can be overridden on the path level or operation level. This is useful if some endpoints use a different server or base path than the rest of the API. Common examples are:

Different base URL for file upload and download operations.

Deprecated but still functional endpoints.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /ping: ...3  /users: ...4  /users/{id}: ...
```

Example 2 (lua):
```lua
1paths:2  /users/{id}:3    summary: Represents a user4    description: >5      This resource represents an individual user in the system.6      Each user is identified by a numeric `id`.7
8    get: ...9    patch: ...10    delete: ...
```

Example 3 (unknown):
```unknown
1/users/{id}2/organizations/{orgId}/members/{memberId}3/report.{format}
```

Example 4 (json):
```json
1paths:2  /ping:3    get:4      responses:5        "200":6          description: OK
```

---

## Enums | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/enums/

**Contents:**
- Enums
  - Reusable Enums

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

You can use the enum keyword to specify possible values of a request parameter or a model property. For example, the sort parameter in:

In YAML, you can also specify one enum value per line:

All values in an enum must adhere to the specified type. If you need to specify descriptions for enum items, you can do this in the description of the parameter or property:

Reusable enum definitions are supported in OpenAPI 3.0.

While Swagger 2.0 does not have built-in support for reusable enums, it is possible to define them in YAML using YAML anchors – provided that your tool supports them. Anchors are a handy feature of YAML where you can mark a key with &anchor-name and then further down use *anchor-name to reference that key’s value. This lets you easily duplicate the content across a YAML file.

Note: An anchor (&) must be defined before it is used.

If your tool’s YAML parser supports YAML merge keys (<<), you can use this trick to reference both the type and the enum values.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (unknown):
```unknown
1GET /items?sort=[asc|desc]
```

Example 2 (yaml):
```yaml
1paths:2  /items:3    get:4      parameters:5        - in: query6          name: sort7          description: Sort order8          type: string9          enum: [asc, desc]
```

Example 3 (yaml):
```yaml
1enum:2  - asc3  - desc
```

Example 4 (sql):
```sql
1type: string2enum:3  - asc4  - desc5description: >6  Sort order:7   * asc - Ascending, from A to Z.8   * desc - Descending, from Z to A.
```

---

## Adding Examples | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/adding-examples/

**Contents:**
- Adding Examples
  - Schema Examples
    - Property Examples
    - Object Examples
    - Array Examples
    - Whole Schema Examples
  - Response Examples
    - JSON and YAML Examples
    - XML Examples
    - Text Examples

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

An API specification can include examples for:

Examples can be used by tools and libraries, for instance, Swagger UI auto-populates request bodies based on input schema examples, and some API mocking tools use examples to generate mock responses.

Note: Do not confuse example values with the default values. An example is used to illustrate what the value is supposed to be like. A default value is something that the server uses if the value is not provided in the request.

The example key is used to provide a schema example. Examples can be given for individual properties, objects and the whole schema.

Property examples can be specified inline. The example value must conform to the property type.

Note that multiple example values per property or schema are not supported, that is, you cannot have:

Properties of a type object can have complex inline examples that include that object’s properties. The example should comply with the object schema.

An example for an array of primitives:

Similarly, an array of objects would be specified as:

An example can be specified for the entire schema (including all nested schema), provided that the example conforms to the schema.

Swagger allows examples on the response level, each example corresponding to a specific MIME type returned by the operation. Such as one example for application/json, another one for text/csv and so on. Each MIME type must be one of the operation’s produces values — either explicit or inherited from the global scope.

All examples are free-form, meaning their interpretation is up to tools and libraries.

Since JSON and YAML are interchangeable (YAML is a superset of JSON), both can be specified either using the JSON syntax:

There is no specific syntax for XML response examples. But, since the response examples are free-form, you can use any format that you wish or that is supported by your tool.

Alternatively, you can specify the example values in the response schema, as explained above.

Since all response examples are free-form, you can use any format supported by your tool or library. For instance, something like:

See also this post on Stack Overflow for tips on how to write multi-line strings in YAML.

If there are multiple examples on different levels (property, schema, response), the higher-level example is used by the tool that is processing the spec. That is, the order of precedence is:

OpenAPI 2.0 example and examples keywords require inline examples and do not support $ref. The example values are displayed as is, so $ref would be displayed as an object property named $ref.

Referencing examples is supported in OpenAPI 3.0.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1definitions:2  CatalogItem:3    type: object4    properties:5      id:6        type: integer7        example: 388      title:9        type: string10        example: T-shirt11    required:12      - id13      - title
```

Example 2 (yaml):
```yaml
1title:2  type: string3  example: T-shirt4  example: Phone
```

Example 3 (yaml):
```yaml
1definitions:2  CatalogItem:3    type: object4    properties:5      id:6        type: integer7        example: 388      title:9        type: string10        example: T-shirt11      image:12        type: object13        properties:14          url:15            type: string16          width:17            type: integer18          height:19            type: integer20        required:21          - url22        example:   # <-----23          url: images/38.png24          width: 10025          height: 10026    required:27      - id28      - title
```

Example 4 (yaml):
```yaml
1definitions:2  ArrayOfStrings:3    type: array4    items:5      type: string6    example:7      - foo8      - bar9      - baz
```

---

## Swagger Extensions | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/swagger-extensions/

**Contents:**
- Swagger Extensions
  - Example

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Extensions, or vendor extensions, are custom properties that start with x-, such as x-logo. They can be used to describe extra functionality that is not covered by the standard Swagger specification. Many API-related products that support Swagger make use of extensions to document their own attributes, such as Amazon API Gateway, ReDoc, APIMatic and others. Extensions are supported on the root level of the API spec and in the following places:

The extension value can be a primitive, an array, an object or null. If the value is an object or array of objects, the object’s property names do not need to start with x-.

An API that uses Amazon API Gateway custom authorizer would include extensions similar to this:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1securityDefinitions:2  APIGatewayAuthorizer:3    type: apiKey4    name: Authorization5    in: header6    x-amazon-apigateway-authtype: oauth27    x-amazon-apigateway-authorizer:8      type: token9      authorizerUri: arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:account-id:function:function-name/invocations10      authorizerCredentials: arn:aws:iam::account-id:role11      identityValidationExpression: "^x-[a-z]+"12      authorizerResultTtlInSeconds: 60
```

---

## What Is OpenAPI? | Swagger Docs

**URL:** https://swagger.io/docs/specification/

**Contents:**
- What Is OpenAPI?
  - What Is Swagger?
  - Why Use OpenAPI?

OpenAPI Specification (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file allows you to describe your entire API, including:

API specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines. The complete OpenAPI Specification can be found on GitHub: OpenAPI 3.0 Specification

Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs. The major Swagger tools include:

The ability of APIs to describe their own structure is the root of all awesomeness in OpenAPI. Once written, an OpenAPI specification and Swagger tools can drive your API development further in various ways:

---

## Media Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/media-types

**Contents:**
- Media Types
  - Media Type Names
  - Multiple Media Types

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

Media type is a format of a request or response body data. Web service operations can accept and return data in different formats, the most common being JSON, XML and images. You specify the media type in request and response definitions. Here is an example of a response definition:

Under responses we have definitions of individual responses. As you can see, each response is defined by its code ('200' in our example.). The keyword content below the code corresponds to the response body. One or multiple media types go as child keywords of this content keyword. Each media type includes a schema, defining the data type of the message body, and, optionally, one or several examples. For more information on defining body data, see Defining Request Body and Defining Responses.

The media types listed below the content field should be compliant with RFC 6838. For example, you can use standard types or vendor-specific types (indicated by .vnd) –

You may want to specify multiple media types:

To use the same data format for several media types, define a custom object in the components section of your spec and then refer to this object in each media type:

To define the same format for multiple media types, you can also use placeholders like */*, application/*, image/* or others:

The value you use as media type – image/* in our example – is very similar to what you can see in the Accept or Content-Type headers of HTTP requests and responses. Do not confuse the placeholder and the actual value of the Accept or Content-Type headers. For example, the image/* placeholder for a response body means that the server will use the same data structure for all the responses that match the placeholder. It does not mean that the string image/* will be specified in the Content-Type header. The Content-Type header most likely will have image/png, image/jpeg, or some other similar value.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # Media type10              schema: # Must-have11                type: object # Data type12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19                example: # Sample data20                  id: 121                  name: Jessica Right22                  fullTime: true
```

Example 2 (sass):
```sass
1application/json2application/xml3application/x-www-form-urlencoded4multipart/form-data5text/plain; charset=utf-86text/html7application/pdf8image/png
```

Example 3 (sass):
```sass
1application/vnd.mycompany.myapp.v2+json2application/vnd.ms-excel3application/vnd.openstreetmap.data+xml4application/vnd.github-issue.text+json5application/vnd.github.v3.diff6image/vnd.djvu
```

Example 4 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # One of media types10              schema:11                type: object12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19            application/xml: # Another media types20              schema:21                type: object22                properties:23                  id:24                    type: integer25                  name:26                    type: string27                  fullTime:28                    type: boolean
```

---

## Describing Responses | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-responses/

**Contents:**
- Describing Responses
  - Response Media Types
  - HTTP Status Codes
  - Response Body
  - Response That Returns a File
  - anyOf, oneOf
  - Empty Response Body
  - Response Headers
  - Default Response
  - Reusing Responses

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

An API specification needs to specify the responses for all API operations. Each operation must have at least one response defined, usually a successful response. A response is defined by its HTTP status code and the data returned in the response body and/or headers. Here is a minimal example:

An API can respond with various media types. JSON is the most common format for data exchange, but not the only one possible. To specify the response media types, use the content keyword at the operation level.

More info: Media Types.

Under responses, each response definition starts with a status code, such as 200 or 404. An operation typically returns one successful status code and one or more error statuses. To define a range of response codes, you may use the following range definitions: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response range is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code. Each response status requires a description. For example, you can describe the conditions for error responses. Markdown (CommonMark) can be used for rich text representation.

Note that an API specification does not necessarily need to cover all possible HTTP response codes, since they may not be known in advance. However, it is expected to cover successful responses and any known errors. By “known errors” we mean, for example, a 404 Not Found response for an operation that returns a resource by ID, or a 400 Bad Request response in case of invalid operation parameters.

The schema keyword is used to describe the response body. A schema can define:

Schema can be defined inline in the operation:

or defined in the global components.schemas section and referenced via $ref. This is useful if multiple media types use the same schema.

An API operation can return a file, such as an image or PDF. OpenAPI 3.0 defines file input/output content as type: string with format: binary or format: base64. This is in contrast with OpenAPI 2.0, which uses type: file to describe file input/output content. If the response returns the file alone, you would typically use a binary string schema and specify the appropriate media type for the response content:

Files can also be embedded into, say, JSON or XML as a base64-encoded string. In this case, you would use something like:

OpenAPI 3.0 also supports oneOf and anyOf, so you can specify alternate schemas for the response body.

Some responses, such as 204 No Content, have no body. To indicate the response body is empty, do not specify a content for the response:

Responses from an API can include custom headers to provide additional information on the result of an API call. For example, a rate-limited API may provide the rate limit status via response headers as follows:

You can define custom headers for each response as follows:

Note that, currently, OpenAPI Specification does not permit to define common response headers for different response codes or different API operations. You need to define the headers for each response individually.

Sometimes, an operation can return multiple errors with different HTTP status codes, but all of them have the same response structure:

You can use the default response to describe these errors collectively, not individually. “Default” means this response is used for all HTTP codes that are not covered individually for this operation.

If multiple operations return the same response (status code and data), you can define it in the responses section of the global components object and then reference that definition via $ref at the operation level. This is useful for error responses with the same status codes and response body.

Note that responses defined in components.responses are not automatically applied to all operations. These are just definitions that can be referenced and reused by multiple operations.

Certain values in the response could be used as parameters to other operations. A typical example is the “create resource” operation that returns the ID of the created resource, and this ID can be used to get that resource, update or delete it. OpenAPI 3.0 provides the links keyword to describe such relationships between a response and other API calls. For more information, see Links.

Can I have different responses based on a request parameter? Such as:

In OpenAPI 3.0, you can use oneOf to specify alternate schemas for the response and document possible dependencies verbally in the response description. However, there is no way to link specific schemas to certain parameter combinations.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /ping:3    get:4      responses:5        "200":6          description: OK7          content:8            text/plain:9              schema:10                type: string11                example: pong
```

Example 2 (scss):
```scss
1paths:2  /users:3    get:4      summary: Get all users5      responses:6        "200":7          description: A list of users8          content:9            application/json:10              schema:11                $ref: "#/components/schemas/ArrayOfUsers"12            application/xml:13              schema:14                $ref: "#/components/schemas/ArrayOfUsers"15            text/plain:16              schema:17                type: string18
19  # This operation returns image20  /logo:21    get:22      summary: Get the logo image23      responses:24        "200":25          description: Logo image in PNG format26          content:27            image/png:28              schema:29                type: string30                format: binary
```

Example 3 (json):
```json
1responses:2  "200":3    description: OK4  "400":5    description: Bad request. User ID must be an integer and larger than 0.6  "401":7    description: Authorization information is missing or invalid.8  "404":9    description: A user with the specified ID was not found.10  "5XX":11    description: Unexpected error.
```

Example 4 (json):
```json
1responses:2  "200":3    description: A User object4    content:5      application/json:6        schema:7          type: object8          properties:9            id:10              type: integer11              description: The user ID.12            username:13              type: string14              description: The user name.
```

---

## MIME Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/2-0/mime-types/

**Contents:**
- MIME Types

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

An API can accept and return data in different formats, the most common being JSON and XML. You can use the consumes and produces keywords to specify the MIME types understood by your API. The value of consumes and produces is an array of MIME types. Global MIME types can be defined on the root level of an API specification and are inherited by all API operations. Here the API uses JSON and XML:

Note that consumes only affects operations with a request body, such as POST, PUT and PATCH. It is ignored for bodiless operations like GET. When used on the operation level, consumes and produces override (not extend) the global definitions. In the following example, the GET /logo operation redefines the produces array to return an image:

MIME types listed in consumes and produces should be compliant with RFC 6838. For example, you can use standard MIME types such as:

as well as vendor-specific MIME types (indicated by vnd.):

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1consumes:2  - application/json3  - application/xml4produces:5  - application/json6  - application/xml
```

Example 2 (yaml):
```yaml
1paths:2  /logo:3    get:4      summary: Returns the logo image5      produces:6        - image/png7        - image/gif8        - image/jpeg9      responses:10        200:11          description: OK12          schema:13            type: file
```

Example 3 (sass):
```sass
1application/json2application/xml3application/x-www-form-urlencoded4multipart/form-data5text/plain; charset=utf-86text/html7application/pdf8image/png
```

Example 4 (sass):
```sass
1application/vnd.mycompany.myapp.v2+json2application/vnd.ms-excel3application/vnd.openstreetmap.data+xml4application/vnd.github-issue.text+json5application/vnd.github.v3.diff6image/vnd.djvu
```

---

## Using $ref | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/using-ref/

**Contents:**
- Using $ref
  - $ref Syntax
  - Escape Characters
  - Considerations
    - Places Where $ref Can Be Used
    - $ref and Sibling Elements

OAS 3 This guide is for OpenAPI 3.0.

When you document an API, it is common to have some features which you use across several of API resources. In that case, you can create a snippet for such elements in order to use them multiple times when you need it. With OpenAPI 3.0, you can reference a definition hosted on any location. It can be the same server, or another one – for example, GitHub, SwaggerHub, and so on. To reference a definition, use the $ref keyword:

For example, suppose you have the following schema object, which you want to use inside your response:

To refer that object, you need to add $ref with the corresponding path to your response:

The value of $ref uses the JSON Reference notation, and the portion starting with # uses the JSON Pointer notation. This notation lets you specify the target file or a specific part of a file you want to reference. In the previous example, #/components/schemas/User means the resolving starts from the root of the current document, and then finds the values of components, schemas, and User one after another.

According to RFC3986, the $ref string value (JSON Reference) should contain a URI, which identifies the location of the JSON value you are referencing to. If the string value does not conform URI syntax rules, it causes an error during the resolving. Any members other than $ref in a JSON Reference object are ignored. Check this list for example values of a JSON reference in specific cases:

Note: When using local references such as #/components/schemas/User in YAML, enclose the value in quotes: '#/components/schemas/User'. Otherwise it will be treated as a comment.

/ and ~ are special characters in JSON Pointers, and need to be escaped when used literally (for example, in path names).

For example, to refer to the path /blogs/{blog_id}/new~posts, you would use:

A common misconception is that $ref is allowed anywhere in an OpenAPI specification file. Actually $ref is only allowed in places where the OpenAPI 3.0 Specification explicitly states that the value may be a reference. For example, $ref cannot be used in the info section and directly under paths:

However, you can $ref individual paths, like so:

Any sibling elements of a $ref are ignored. This is because $ref works by replacing itself and everything on its level with the definition it is pointing at. Consider this example:

In the second schema, the description and default properties are ignored, so this schema ends up exactly the same as the referenced Date schema.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1$ref: "reference to definition"
```

Example 2 (json):
```json
1"components":2  {3    "schemas":4      {5        "user":6          {7            "properties":8              { "id": { "type": "integer" }, "name": { "type": "string" } },9          },10      },11  }
```

Example 3 (yaml):
```yaml
1components:2  schemas:3    User:4      properties:5        id:6          type: integer7        name:8          type: string
```

Example 4 (json):
```json
1"responses":2  {3    "200":4      {5        "description": "The response",6        "schema": { "$ref": "#/components/schemas/user" },7      },8  }
```

---

## Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication

**Contents:**
- Authentication
  - Changes from OpenAPI 2.0
  - Describing Security
    - Step 1. Defining securitySchemes
    - Step 2. Applying security
  - Scopes
  - Using Multiple Authentication Types
  - Reference

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

OpenAPI uses the term security scheme for authentication and authorization schemes. OpenAPI 3.0 lets you describe APIs protected using the following security schemes:

Follow the links above for the guides on specific security types, or continue reading to learn how to describe security in general.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Security is described using the securitySchemes and security keywords. You use securitySchemes to define all security schemes your API supports, then use security to apply specific schemes to the whole API or individual operations.

All security schemes used by the API must be defined in the global components/securitySchemes section. This section contains a list of named security schemes, where each scheme can be of type:

Other required properties for security schemes depend on the type. The following example shows how various security schemes are defined. The BasicAuth, BearerAuth names and others are arbitrary names that will be used to refer to these definitions from other places in the spec.

After you have defined the security schemes in the securitySchemes section, you can apply them to the whole API or individual operations by adding the security section on the root level or operation level, respectively. When used on the root level, security applies the specified security schemes globally to all API operations, unless overridden on the operation level. In the following example, the API calls can be authenticated using either an API key or OAuth 2. The ApiKeyAuth and OAuth2 names refer to the schemes previously defined in securitySchemes.

For each scheme, you specify a list of security scopes required for API calls (see below). Scopes are used only for OAuth 2 and OpenID Connect Discovery; other security schemes use an empty array [] instead. Global security can be overridden in individual operations to use a different authentication type, different OAuth/OpenID scopes, or no authentication at all:

OAuth 2 and OpenID Connect use scopes to control permissions to various user resources. For example, the scopes for a pet store may include read_pets, write_pets, read_orders, write_orders, admin. When applying security, the entries corresponding to OAuth 2 and OpenID Connect need to specify a list of scopes required for a specific operation (if security is used on the operation level) or all API calls (if security is used on the root level).

Different operations typically require different scopes, such as read vs write vs admin. In this case, you should apply scoped security to specific operations instead of doing it globally.

Some REST APIs support several authentication types. The security section lets you combine the security requirements using logical OR and AND to achieve the desired result. security uses the following logic:

That is, security is an array of hashmaps, where each hashmap contains one or more named security schemes. Items in a hashmap are combined using logical AND, and array items are combined using logical OR. Security schemes combined via OR are alternatives – any one can be used in the given context. Security schemes combined via AND must be used simultaneously in the same request. Here, we can use either Basic authentication or an API key:

Here, the API requires a pair of API keys to be included in requests:

Here, we can use either OAuth 2 or a pair of API keys:

Security Scheme Object

Security Requirement Object

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  securitySchemes:3    BasicAuth:4      type: http5      scheme: basic6
7    BearerAuth:8      type: http9      scheme: bearer10
11    ApiKeyAuth:12      type: apiKey13      in: header14      name: X-API-Key15
16    OpenID:17      type: openIdConnect18      openIdConnectUrl: https://example.com/.well-known/openid-configuration19
20    OAuth2:21      type: oauth222      flows:23        authorizationCode:24          authorizationUrl: https://example.com/oauth/authorize25          tokenUrl: https://example.com/oauth/token26          scopes:27            read: Grants read access28            write: Grants write access29            admin: Grants access to admin operations
```

Example 2 (yaml):
```yaml
1security:2  - ApiKeyAuth: []3  - OAuth2:4      - read5      - write6# The syntax is:7# - scheme name:8#     - scope 19#     - scope 2
```

Example 3 (json):
```json
1paths:2  /billing_info:3    get:4      summary: Gets the account billing info5      security:6        - OAuth2: [admin] # Use OAuth with a different scope7      responses:8        "200":9          description: OK10        "401":11          description: Not authenticated12        "403":13          description: Access token does not have the required scope14
15  /ping:16    get:17      summary: Checks if the server is running18      security: [] # No security19      responses:20        "200":21          description: Server is up and running22        default:23          description: Something is wrong
```

Example 4 (yaml):
```yaml
1security:2  - OAuth2:3      - scope14      - scope25  - OpenId:6      - scopeA7      - scopeB8  - BasicAuth: []
```

---

## OpenID Connect Discovery | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/openid-connect-discovery/

**Contents:**
- OpenID Connect Discovery
  - Describing OpenID Connect Discovery
  - Relative Discovery URL
  - Swagger UI support

OAS 3 This guide is for OpenAPI 3.0.

OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 protocol and supported by some OAuth 2.0 providers, such as Google and Azure Active Directory. It defines a sign-in flow that enables a client application to authenticate a user, and to obtain information (or “claims”) about that user, such as the user name, email, and so on. User identity information is encoded in a secure JSON Web Token (JWT), called ID token. OpenID Connect defines a discovery mechanism, called OpenID Connect Discovery, where an OpenID server publishes its metadata at a well-known URL, typically

https://server.com/.well-known/openid-configuration

This URL returns a JSON listing of the OpenID/OAuth endpoints, supported scopes and claims, public keys used to sign the tokens, and other details. The clients can use this information to construct a request to the OpenID server. The field names and values are defined in the OpenID Connect Discovery Specification. Here is an example of data returned:

OpenAPI 3.0 lets you describe OpenID Connect Discovery as follows:

The first section, components/securitySchemes, defines the security scheme type (openIdConnect) and the URL of the discovery endpoint (openIdConnectUrl). Unlike OAuth 2.0, you do not need to list the available scopes in securitySchemes – the clients are supposed to read them from the discovery endpoint instead. The security section then applies the chosen security scheme to your API. The actual scopes required for API calls need to be listed here. These may be a subset of the scopes returned by the discovery endpoint. If different API operations require different scopes, you can apply security on the operation level instead of globally. This way you can list the relevant scopes for each operation:

openIdConnectUrl can be specified relative to the server URL, like so:

Relative URLs are resolved according to RFC 3986. In the example above, it will be resolved to https://api.example.com/.well-known/openid-configuration.

Support for OpenID Connect Discovery was added in Swagger UI v. 3.38.0 and Swagger Editor 3.14.8.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1{2  "issuer": "https://example.com/",3  "authorization_endpoint": "https://example.com/authorize",4  "token_endpoint": "https://example.com/token",5  "userinfo_endpoint": "https://example.com/userinfo",6  "jwks_uri": "https://example.com/.well-known/jwks.json",7  "scopes_supported": ["pets_read", "pets_write", "admin"],8  "response_types_supported": ["code", "id_token", "token id_token"],9  "token_endpoint_auth_methods_supported": ["client_secret_basic"],10  ...,11}
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the security scheme type and attributes4components:5  securitySchemes:6    openId: # <--- Arbitrary name for the security scheme. Used to refer to it from elsewhere.7      type: openIdConnect8      openIdConnectUrl: https://example.com/.well-known/openid-configuration9
10# 2) Apply security globally to all operations11security:12  - openId: # <--- Use the same name as specified in securitySchemes13      - pets_read14      - pets_write15      - admin
```

Example 3 (lua):
```lua
1paths:2  /pets/{petId}:3    get:4      summary: Get a pet by ID5      security:6        - openId:7          - pets_read8      ...9
10    delete:11      summary: Delete a pet by ID12      security:13        - openId:14          - pets_write15      ...
```

Example 4 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v2
```

---

## Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/

**Contents:**
- Authentication
  - Changes from OpenAPI 2.0
  - Describing Security
    - Step 1. Defining securitySchemes
    - Step 2. Applying security
  - Scopes
  - Using Multiple Authentication Types
  - Reference

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

OpenAPI uses the term security scheme for authentication and authorization schemes. OpenAPI 3.0 lets you describe APIs protected using the following security schemes:

Follow the links above for the guides on specific security types, or continue reading to learn how to describe security in general.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Security is described using the securitySchemes and security keywords. You use securitySchemes to define all security schemes your API supports, then use security to apply specific schemes to the whole API or individual operations.

All security schemes used by the API must be defined in the global components/securitySchemes section. This section contains a list of named security schemes, where each scheme can be of type:

Other required properties for security schemes depend on the type. The following example shows how various security schemes are defined. The BasicAuth, BearerAuth names and others are arbitrary names that will be used to refer to these definitions from other places in the spec.

After you have defined the security schemes in the securitySchemes section, you can apply them to the whole API or individual operations by adding the security section on the root level or operation level, respectively. When used on the root level, security applies the specified security schemes globally to all API operations, unless overridden on the operation level. In the following example, the API calls can be authenticated using either an API key or OAuth 2. The ApiKeyAuth and OAuth2 names refer to the schemes previously defined in securitySchemes.

For each scheme, you specify a list of security scopes required for API calls (see below). Scopes are used only for OAuth 2 and OpenID Connect Discovery; other security schemes use an empty array [] instead. Global security can be overridden in individual operations to use a different authentication type, different OAuth/OpenID scopes, or no authentication at all:

OAuth 2 and OpenID Connect use scopes to control permissions to various user resources. For example, the scopes for a pet store may include read_pets, write_pets, read_orders, write_orders, admin. When applying security, the entries corresponding to OAuth 2 and OpenID Connect need to specify a list of scopes required for a specific operation (if security is used on the operation level) or all API calls (if security is used on the root level).

Different operations typically require different scopes, such as read vs write vs admin. In this case, you should apply scoped security to specific operations instead of doing it globally.

Some REST APIs support several authentication types. The security section lets you combine the security requirements using logical OR and AND to achieve the desired result. security uses the following logic:

That is, security is an array of hashmaps, where each hashmap contains one or more named security schemes. Items in a hashmap are combined using logical AND, and array items are combined using logical OR. Security schemes combined via OR are alternatives – any one can be used in the given context. Security schemes combined via AND must be used simultaneously in the same request. Here, we can use either Basic authentication or an API key:

Here, the API requires a pair of API keys to be included in requests:

Here, we can use either OAuth 2 or a pair of API keys:

Security Scheme Object

Security Requirement Object

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  securitySchemes:3    BasicAuth:4      type: http5      scheme: basic6
7    BearerAuth:8      type: http9      scheme: bearer10
11    ApiKeyAuth:12      type: apiKey13      in: header14      name: X-API-Key15
16    OpenID:17      type: openIdConnect18      openIdConnectUrl: https://example.com/.well-known/openid-configuration19
20    OAuth2:21      type: oauth222      flows:23        authorizationCode:24          authorizationUrl: https://example.com/oauth/authorize25          tokenUrl: https://example.com/oauth/token26          scopes:27            read: Grants read access28            write: Grants write access29            admin: Grants access to admin operations
```

Example 2 (yaml):
```yaml
1security:2  - ApiKeyAuth: []3  - OAuth2:4      - read5      - write6# The syntax is:7# - scheme name:8#     - scope 19#     - scope 2
```

Example 3 (json):
```json
1paths:2  /billing_info:3    get:4      summary: Gets the account billing info5      security:6        - OAuth2: [admin] # Use OAuth with a different scope7      responses:8        "200":9          description: OK10        "401":11          description: Not authenticated12        "403":13          description: Access token does not have the required scope14
15  /ping:16    get:17      summary: Checks if the server is running18      security: [] # No security19      responses:20        "200":21          description: Server is up and running22        default:23          description: Something is wrong
```

Example 4 (yaml):
```yaml
1security:2  - OAuth2:3      - scope14      - scope25  - OpenId:6      - scopeA7      - scopeB8  - BasicAuth: []
```

---

## Parameter Serialization | Swagger Docs

**URL:** https://swagger.io/docs/specification/serialization/

**Contents:**
- Parameter Serialization
  - Path Parameters
  - Query Parameters
  - Header Parameters
  - Cookie Parameters
  - Serialization and RFC 6570
  - Other Serialization Methods

OAS 3 This guide is for OpenAPI 3.0.

Serialization means translating data structures or object state into a format that can be transmitted and reconstructed later. OpenAPI 3.0 supports arrays and objects in operation parameters (path, query, header, and cookie) and lets you specify how these parameters should be serialized. The serialization method is defined by the style and explode keywords:

OpenAPI serialization rules are based on a subset of URI template patterns defined by RFC 6570. Tool implementers can use existing URI template libraries to handle the serialization, as explained below.

Path parameters support the following style values:

The default serialization method is style: simple and explode: false. Given the path /users/{id}, the path parameter id is serialized as follows:

The label and matrix styles are sometimes used with partial path parameters, such as /users{id}, because the parameter values get prefixed.

Query parameters support the following style values:

The default serialization method is style: form and explode: true. This corresponds to collectionFormat: multi from OpenAPI 2.0. Given the path /users with a query parameter id, the query string is serialized as follows:

* Default serialization method

Additionally, the allowReserved keyword specifies whether the reserved characters :/?#[]@!$&'()*+,;= in parameter values are allowed to be sent as they are, or should be percent-encoded. By default, allowReserved is false, and reserved characters are percent-encoded. For example, / is encoded as %2F (or %2f), so that the parameter value quotes/h2g2.txt will be sent as quotes%2Fh2g2.txt.

Header parameters always use the simple style, that is, comma-separated values. This corresponds to the {param_name} URI template. An optional explode keyword controls the object serialization. Given the request header named X-MyHeader, the header value is serialized as follows:

Cookie parameters always use the form style. An optional explode keyword controls the array and object serialization. Given the cookie named id, the cookie value is serialized as follows:

OpenAPI serialization rules are based on a subset of URI templates defined by RFC 6570. Tool implementers can use existing URI template libraries to handle the serialization. You will need to construct the URI template based on the path and parameter definitions. The following table shows how OpenAPI keywords are mapped to the URI Template modifiers.

For example, consider the path /users{id} with a query parameter metadata, defined like so:

The path parameter id uses the matrix style with the explode modifier, which corresponds to the {;id*} template. The query parameter metadata uses the default form style, which corresponds to the {?metadata} template. The complete URI template would look like:

A client application can then use an URI template library to generate the request URL based on this template and specific parameter values.

style and explode cover the most common serialization methods, but not all. For more complex scenarios (for example, a JSON-formatted object in the query string), you can use the content keyword and specify the media type that defines the serialization format. For more information, see schema vs content.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1paths:2  # /users;id=3;id=4?metadata=true3  /users{id}:4    get:5      parameters:6        - in: path7          name: id8          required: true9          schema:10            type: array11            items:12              type: integer13            minItems: 114          style: matrix15          explode: true16        - in: query17          name: metadata18          schema:19            type: boolean20          # Using the default serialization for query parameters:21          # style=form, explode=false, allowReserved=false22      responses:23        '200':24          description: A list of users
```

Example 2 (unknown):
```unknown
1/users{;id*}{?metadata}
```

---

## Adding Examples | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/adding-examples/

**Contents:**
- Adding Examples
  - Parameter Examples
  - Request and Response Body Examples
  - Object and Property Examples
  - Array Example
  - Examples for XML and HTML Data
  - External Examples
  - Reusing Examples

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can add examples to parameters, properties and objects to make OpenAPI specification of your web service clearer. Examples can be read by tools and libraries that process your API in some way. For example, an API mocking tool can use sample values to generate mock requests. You can specify examples for objects, individual properties and operation parameters. To specify an example, you use the example or examples keys. See below for details.

Note for Swagger UI users: Support for multiple examples is available since Swagger UI 3.23.0 and Swagger Editor 3.6.31.

Note: Do not confuse example values with default values. An example illustrates what the value is supposed to be. A default value is what the server uses if the client does not provide the value.

Here is an example of a parameter value:

Multiple examples for a parameter:

As you can see, each example has a distinct key name. Also, in the code above, we used an optional summary keys with description. Note: the sample values you specify should match the parameter data type.

Here is an example of the example keyword in a request body:

Note that in the code above, example is a child of schema. If schema refers to some object defined in the components section, then you should make example a child of the media type keyword:

This is needed because $ref overwrites all the siblings alongside it. If needed, you can use multiple examples:

Here is an example of the example in response bodies:

Multiple examples in response bodies:

Note: The examples in response and request bodies are free-form, but are expected to be compatible with the body schema.

You can also specify examples for objects and individual properties in the components section.

Note that schemas and properties support single example but not multiple examples.

You can add an example of an individual array item:

or an array-level example containing multiple items:

If the array contains objects, you can specify a multi-item example as follows:

Note that arrays and array items support single example but not multiple examples.

To describe an example value that cannot be presented in JSON or YAML format, specify it as a string:

You can find information on writing multiline string in YAML in this Stack Overflow post: https://stackoverflow.com/questions/3790454/in-yaml-how-do-i-break-a-string-over-multiple-lines.

If a sample value cannot be inserted into your specification for some reason, for instance, it is neither YAML-, nor JSON-conformant, you can use the externalValue keyword to specify the URL of the example value. The URL should point to the resource that contains the literal example contents (an object, file or image, for example):

You can define common examples in the components/examples section of your specification and then re-use them in various parameter descriptions, request and response body descriptions, objects and properties:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1parameters:2  - in: query3    name: status4    schema:5      type: string6      enum: [approved, pending, closed, new]7      example: approved # Example of a parameter value
```

Example 2 (yaml):
```yaml
1parameters:2  - in: query3    name: limit4    schema:5      type: integer6      maximum: 507    examples: # Multiple examples8      zero: # Distinct name9        value: 0 # Example value10        summary: A sample limit value # Optional description11      max: # Distinct name12        value: 50 # Example value13        summary: A sample limit value # Optional description
```

Example 3 (json):
```json
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json:8            schema: # Request body contents9              type: object10              properties:11                id:12                  type: integer13                name:14                  type: string15              example: # Sample object16                id: 1017                name: Jessica Smith18      responses:19        "200":20          description: OK
```

Example 4 (scss):
```scss
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json: # Media type8            schema: # Request body contents9              $ref: "#/components/schemas/User" # Reference to an object10            example: # Child of media type because we use $ref above11              # Properties of a referenced object12              id: 1013              name: Jessica Smith14      responses:15        "200":16          description: OK
```

---

## What Is OpenAPI? | Swagger Docs

**URL:** https://swagger.io/docs/specification/about

**Contents:**
- What Is OpenAPI?
  - What Is Swagger?
  - Why Use OpenAPI?

OpenAPI Specification (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file allows you to describe your entire API, including:

API specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines. The complete OpenAPI Specification can be found on GitHub: OpenAPI 3.0 Specification

Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs. The major Swagger tools include:

The ability of APIs to describe their own structure is the root of all awesomeness in OpenAPI. Once written, an OpenAPI specification and Swagger tools can drive your API development further in various ways:

---

## Cookie Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/cookie-authentication/

**Contents:**
- Cookie Authentication
  - Describing Cookie Authentication
  - Describing the Set-Cookie Header

OAS 3 This guide is for OpenAPI 3.0.

Cookie authentication uses HTTP cookies to authenticate client requests and maintain session information. It works as follows:

Note: Cookie authentication is vulnerable to Cross-Site Request Forgeries (CSRF) attacks, so it should be used together with other security measures, such as CSRF tokens.

Note for Swagger UI and Swagger Editor users: Cookie authentication is currently not supported for “try it out” requests due to browser security restrictions. See this issue for more information. SwaggerHub does not have this limitation.

In OpenAPI 3.0 terms, cookie authentication is an API key that is sent in: cookie. For example, authentication via a cookie named JSESSIONID is defined as follows:

In this example, cookie authentication is applied globally to the whole API using the security key at the root level of the specification. If cookies are required for just a subset of operations, apply security on the operation level instead of doing it globally:

Cookie authentication can be combined with other authentication methods as explained in Using Multiple Authentication Types.

You may also want to document that your login operation returns the cookie in the Set-Cookie header. You can include this information in the description, and also define the Set-Cookie header in the response headers, like so:

Note that the Set-Cookie header and securitySchemes are not connected in any way, and the Set-Header definition is for documentation purposes only.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1Set-Cookie: JSESSIONID=abcde12345; Path=/; HttpOnly
```

Example 2 (sass):
```sass
1Cookie: JSESSIONID=abcde12345
```

Example 3 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the cookie name4components:5  securitySchemes:6    cookieAuth: # arbitrary name for the security scheme; will be used in the "security" key later7      type: apiKey8      in: cookie9      name: JSESSIONID # cookie name10
11# 2) Apply cookie auth globally to all operations12security:13  - cookieAuth: []
```

Example 4 (json):
```json
1paths:2  /users:3    get:4      security:5        - cookieAuth: []6      description: Returns a list of users.7      responses:8        "200":9          description: OK
```

---

## Grouping Operations With Tags | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/grouping-operations-with-tags/

**Contents:**
- Grouping Operations With Tags

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can assign a list of tags to each API operation. Tagged operations may be handled differently by tools and libraries. For example, Swagger UI uses tags to group the displayed operations.

Optionally, you can specify description and externalDocs for each tag by using the global tags section on the root level. The tag names here should match those used in operations.

The tag order in the global tags section also controls the default sorting in Swagger UI. Note that it is possible to use a tag in an operation even if it is not defined on the root level.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /pet/findByStatus:3    get:4      summary: Finds pets by Status5      tags:6        - pets7      ...8  /pet:9    post:10      summary: Adds a new pet to the store11      tags:12        - pets13      ...14  /store/inventory:15    get:16      summary: Returns pet inventories17      tags:18        - store19      ...
```

Example 2 (yaml):
```yaml
1tags:2  - name: pets3    description: Everything about your Pets4    externalDocs:5      url: http://docs.my-api.com/pet-operations.htm6  - name: store7    description: Access to Petstore orders8    externalDocs:9      url: http://docs.my-api.com/store-orders.htm
```

---

## Describing Parameters | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/describing-parameters/

**Contents:**
- Describing Parameters
  - Parameter Types
  - Query Parameters
  - Path Parameters
  - Header Parameters
  - Form Parameters
  - Required and Optional Parameters
  - Default Parameter Values
    - Common Mistakes
  - Enum Parameters

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

In Swagger, API operation parameters are defined under the parameters section in the operation definition. Each parameter has name, value type (for primitive value parameters) or schema (for request body), and optional description. Here is an example:

Note that parameters is an array, so, in YAML, each parameter definition must be listed with a dash (-) in front of it.

Swagger distinguishes between the following parameter types based on the parameter location. The location is determined by the parameter’s in key, for example, in: query or in: path.

Query parameters are the most common type of parameters. They appear at the end of the request URL after a question mark (?), with different name=value pairs separated by ampersands (&). Query parameters can be required and optional.

Use in: query to denote query parameters:

Query parameters only support primitive types. You can have an array, but the items must be a primitive value type. Objects are not supported.

Note: To describe API keys passed as query parameters, use a security definition instead. See API Keys.

Path parameters are components of a URL path that can vary. They are typically used to point to a specific resource within a collection, such as a user identified by ID. A URL can have several path parameters, each denoted with curly braces { }.

Each path parameter must be substituted with an actual value when the client makes an API call. In Swagger, a path parameter is defined using in: path and other attributes as necessary. The parameter name must be the same as specified in the path. Also, remember to add required: true, because path parameters are always required. Here is an example for GET /users/{id}:

Path parameters can be multi-valued, such as GET /users/12,34,56. This is achieved by specifying the parameter type as array. See Array and Multi-Value Parameters below.

An API call may require that custom headers be sent with an HTTP request. Swagger lets you define custom request headers as in: header parameters. For example, suppose, a call to GET /ping requires the X-Request-ID header:

In Swagger, you would define this operation as follows:

In a similar way, you can define custom response headers.

Note: Swagger specification has special keywords for some headers:

Form parameters are used to describe the payload of requests with Content-Type of:

That is, the operation’s consumes property must specify one of these content types. Form parameters are defined as in: formData. They can only be primitives (strings, numbers, booleans) or arrays of primitives (meaning you cannot use a $ref as the items value). Also, form parameters cannot coexist with the in: bodyparameter, because formData is a specific way of describing the body. To illustrate form parameters, consider an HTML POST form:

This form POSTs data to the form’s endpoint:

In Swagger, you can describe the endpoint as follows:

To learn how to define form parameters for file uploads, see File Upload.

By default, Swagger treats all request parameters as optional. You can add required: true to mark a parameter as required. Note that path parameters must have required: true, because they are always required.

You can use the default key to specify the default value for an optional parameter. The default value is the one that the server uses if the client does not supply the parameter value in the request. The value type must be the same as the parameter’s data type. A typical example is paging parameters such as offset and limit:

Assuming offset defaults to 0 and limit defaults to 20 and ranges from 0 to 100, you would define these parameters as:

There are two common mistakes when using the default keyword:

The enum keyword allows you to restrict a parameter value to a fixed set of values. The enum values must be of the same type as the parameter type.

More info: Defining an Enum.

Path, query, header and form parameters can accept a list of values, for example:

A multi-value parameter must be defined with type: array and the appropriate collectionFormat.

collectionFormat specifies the array format (a single parameter with multiple parameter or multiple parameters with the same name) and the separator for array items.

Additionally, you can:

You can also specify the default array that the server will use if this parameter is omitted:

You can define a constant parameter as a required parameter with only one possible value:

The enum property specifies possible values. In this example, only one value can be used, and this will be the only value available in the Swagger UI for the user to choose from.

Note: A constant parameter is not the same as the default parameter value. A constant parameter is always sent by the client, whereas the default value is something that the server uses if the parameter is not sent by the client.

Query string and form data parameters may only have a name and no value:

Use allowEmptyValue to describe such parameters:

Parameters can be defined under a path itself, in this case, the parameters exist in all operations described under this path. A typical example is the GET/PUT/PATCH/DELETE operations that manipulate the same resource accessed via a path parameter.

Any extra parameters defined at the operation level are used together with path-level parameters:

Specific path-level parameters can be overridden on the operation level, but cannot be removed.

Different API paths may have some common parameters, such as pagination parameters. You can define common parameters in the global parameters section and reference them in individual operations via $ref.

Note that the global parameters are not parameters applied to all operations — they are simply global definitions that can be easily re-used.

Swagger does not support parameter dependencies and mutually exclusive parameters. There is an open feature request at https://github.com/OAI/OpenAPI-Specification/issues/256. What you can do is document the restrictions in the parameter description and define the logic in the 400 Bad Request response. For example, consider the /report endpoint that accepts either a relative date range (rdate) or an exact range (start_date+ end_date):

You can describe this endpoint as follows:

When should I use “type” vs “schema”?

schema is only used with in: body parameters. Any other parameters expect a primitive type, such as type: string, or an array of primitives.

Can I have an object as a query parameter?

This is possible in OpenAPI 3.0, but not in 2.0.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /users/{userId}:3    get:4      summary: Gets a user by ID.5      parameters:6        - in: path7          name: userId8          type: integer9          required: true10          description: Numeric ID of the user to get.
```

Example 2 (sass):
```sass
1GET /pets/findByStatus?status=available2GET /notes?offset=100&limit=50
```

Example 3 (yaml):
```yaml
1parameters:2  - in: query3    name: offset4    type: integer5    description: The number of items to skip before starting to collect the result set.6  - in: query7    name: limit8    type: integer9    description: The numbers of items to return.
```

Example 4 (unknown):
```unknown
1GET /users/{id}2GET /cars/{carId}/drivers/{driverId}
```

---

## Bearer Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/bearer-authentication/

**Contents:**
- Bearer Authentication
  - Describing Bearer Authentication
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0.

Bearer authentication (also called token authentication) is an HTTP authentication scheme that involves security tokens called bearer tokens. The name “Bearer authentication” can be understood as “give access to the bearer of this token.” The bearer token is a cryptic string, usually generated by the server in response to a login request. The client must send this token in the Authorization header when making requests to protected resources:

The Bearer authentication scheme was originally created as part of OAuth 2.0 in RFC 6750, but is sometimes also used on its own. Similarly to Basic authentication, Bearer authentication should only be used over HTTPS (SSL).

In OpenAPI 3.0, Bearer authentication is a security scheme with type: http and scheme: bearer. You first need to define the security scheme under components/securitySchemes, then use the security keyword to apply this scheme to the desired scope – global (as in the example below) or specific operations:

Optional bearerFormat is an arbitrary string that specifies how the bearer token is formatted. Since bearer tokens are usually generated by the server, bearerFormat is used mainly for documentation purposes, as a hint to the clients. In the example above, it is “JWT”, meaning JSON Web Token. The square brackets [] in bearerAuth: [] contain a list of security scopes required for API calls. The list is empty because scopes are only used with OAuth 2 and OpenID Connect. In the example above, Bearer authentication is applied globally to the whole API. If you need to apply it to just a few operations, add security on the operation level instead of doing this globally:

Bearer authentication can also be combined with other authentication methods as explained in Using Multiple Authentication Types.

You can also define the 401 “Unauthorized” response returned for requests that do not contain a proper bearer token. Since the 401 response will be used by multiple operations, you can define it in the global components/responses section and reference elsewhere via $ref.

To learn more about responses, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1Authorization: Bearer <token>
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the security scheme type (HTTP bearer)4components:5  securitySchemes:6    bearerAuth: # arbitrary name for the security scheme7      type: http8      scheme: bearer9      bearerFormat: JWT # optional, arbitrary value for documentation purposes10
11# 2) Apply the security globally to all operations12security:13  - bearerAuth: [] # use the same name as above
```

Example 3 (yaml):
```yaml
1paths:2  /something:3    get:4      security:5        - bearerAuth: []
```

Example 4 (lua):
```lua
1paths:2  /something:3    get:4      ...5      responses:6        '401':7          $ref: '#/components/responses/UnauthorizedError'8        ...9    post:10      ...11      responses:12        '401':13          $ref: '#/components/responses/UnauthorizedError'14        ...15
16components:17  responses:18    UnauthorizedError:19      description: Access token is missing or invalid
```

---

## Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/authentication/authentication/

**Contents:**
- Authentication
  - Using Multiple Authentication Types
  - FAQ
  - Reference

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Swagger 2.0 lets you define the following authentication types for an API:

Follow the links above for examples specific to these authentication types, or continue reading to learn how to describe authentication in general.

Authentication is described by using the securityDefinitions and security keywords. You use securityDefinitions to define all authentication types supported by the API, then use security to apply specific authentication types to the whole API or individual operations.

The securityDefinitions section is used to define all security schemes (authentication types) supported by the API. It is a name->definition map that maps arbitrary names to the security scheme definitions. Here, the API supports three security schemes named BasicAuth, ApiKeyAuth and OAuth2, and these names will be used to refer to these security schemes from elsewhere:

Each security scheme can be of type:

Other required properties depend on the security type. For details, check the Swagger Specification or our examples for Basic auth and API keys.

After you have defined the security schemes in securityDefinitions, you can apply them to the whole API or individual operations by adding the security section on the root level or operation level, respectively. When used on the root level, security applies the specified security schemes globally to all API operations, unless overridden on the operation level.

In the following example, the API calls can be authenticated using either an API key or OAuth 2. The ApiKeyAuth and OAuth2 names refer to the security schemes previously defined in securityDefinitions.

Global security can be overridden in individual operations to use a different authentication type, different OAuth 2 scopes, or no authentication at all:

Some REST APIs support several authentication types. The security section lets you combine the security requirements using logical OR and AND to achieve the desired result. security uses the following logic:

That is, security is an array of hashmaps, where each hashmap contains one or more named security schemes. Items in a hashmap are combined using logical AND, and array items are combined using logical OR. Security schemes combined via OR are alternatives – any one can be used in the given context. Security schemes combined via AND must be used simultaneously in the same request. Here, we can use either Basic authentication or an API key:

Here, the API requires a pair of API keys to be included in requests:

Here, we can use either OAuth 2 or a pair of API keys:

What does [ ] mean in “securitySchemeName: [ ]”?

[] is a YAML/JSON syntax for an empty array. The Swagger Specification requires that items in the security array specify a list of required scopes, as in:

Scopes are only used with OAuth 2, so the Basic and API key security items use an empty array instead.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1securityDefinitions:2  BasicAuth:3    type: basic4  ApiKeyAuth:5    type: apiKey6    in: header7    name: X-API-Key8  OAuth2:9    type: oauth210    flow: accessCode11    authorizationUrl: https://example.com/oauth/authorize12    tokenUrl: https://example.com/oauth/token13    scopes:14      read: Grants read access15      write: Grants write access16      admin: Grants read and write access to administrative information
```

Example 2 (yaml):
```yaml
1security:2  - ApiKeyAuth: []3  - OAuth2: [read, write]
```

Example 3 (elixir):
```elixir
1paths:2/billing_info:3  get:4    summary: Gets the account billing info5    security:6      - OAuth2: [admin]   # Use OAuth with a different scope7    responses:8      200:9        description: OK10      401:11        description: Not authenticated12      403:13        description: Access token does not have the required scope14
15/ping:16  get:17    summary: Checks if the server is running18    security: []   # No security19    responses:20      200:21        description: Server is up and running22      default:23        description: Something is wrong
```

Example 4 (yaml):
```yaml
1security:    # A OR B2  - A3  - B4
5security:    # A AND B6  - A7    B8
9security:    # (A AND B) OR (C AND D)10  - A11    B12  - C13    D
```

---

## Components Section | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/components/

**Contents:**
- Components Section
  - Components Structure
  - Components Example
  - Externally Defined Components
  - Differences From OpenAPI 2.0
  - References

OAS 3 This guide is for OpenAPI 3.0.

Often, multiple API operations have some common parameters or return the same response structure. To avoid code duplication, you can place the common definitions in the global components section and reference them using $ref. In the example below, duplicate definitions of a User object are replaced with a single component and references to that component. Before:

components serve as a container for various reusable definitions – schemas (data models), parameters, responses, examples, and others. The definitions in components have no direct effect on the API unless you explicitly reference them from somewhere outside the components. That is, components are not parameters and responses that apply to all operations; they are just pieces of information to be referenced elsewhere. Under components, the definitions are grouped by type – schemas, parameters and so on. The following example lists the available subsections. All subsections are optional.

Each subsection contains one or more named components (definitions):

The component names can consist of the following characters only:

Examples of valid names:

The component names are used to reference the components via $ref from other parts of the API specification:

An exception are definitions in securitySchemes which are referenced directly by name (see Authentication).

Below is an example of components that contains reusable data schemas, parameters and responses. Other component types (links, examples, and others) are defined similarly.

Individual definitions in components can be specified either inline (as in the previous example) or using a $ref reference to an external definition:

This way you can define local “aliases” for external definitions that you can use instead of repeating the external file paths in all references. If the location of the referenced file changes, you only need to change it in one place (in components) instead of in all references.

OpenAPI 2.0 had separate sections for reusable components – definitions, parameters, responses and securityDefinitions. In OpenAPI 3.0, they all were moved inside components. Also, definitions were renamed to schemas and securityDefinitions were renamed to securitySchemes (note the different spelling: schem_A_s vs securitySchem_E_s). The references are changed accordingly to reflect the new structure:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /users/{userId}:3    get:4      summary: Get a user by ID5      parameters: ...6      responses:7        "200":8          description: A single user.9          content:10            application/json:11              schema:12                type: object13                properties:14                  id:15                    type: integer16                  name:17                    type: string18  /users:19    get:20      summary: Get all users21      responses:22        "200":23          description: A list of users.24          content:25            application/json:26              schema:27                type: array28                items:29                  type: object30                  properties:31                    id:32                      type: integer33                    name:34                      type: string
```

Example 2 (lua):
```lua
1paths:2  /users/{userId}:3    get:4      summary: Get a user by ID5      parameters: ...6      responses:7        "200":8          description: A single user.9          content:10            application/json:11              schema:12                $ref: "#/components/schemas/User"13  /users:14    get:15      summary: Get all users16      responses:17        "200":18          description: A list of users.19          content:20            application/json:21              schema:22                type: array23                items:24                  $ref: "#/components/schemas/User"25
26components:27  schemas:28    User:29      type: object30      properties:31        id:32          type: integer33        name:34          type: string
```

Example 3 (lua):
```lua
1components:2  # Reusable schemas (data models)3  schemas: ...4
5  # Reusable path, query, header and cookie parameters6  parameters: ...7
8  # Security scheme definitions (see Authentication)9  securitySchemes: ...10
11  # Reusable request bodies12  requestBodies: ...13
14  # Reusable responses, such as 401 Unauthorized or 400 Bad Request15  responses: ...16
17  # Reusable response headers18  headers: ...19
20  # Reusable examples21  examples: ...22
23  # Reusable links24  links: ...25
26  # Reusable callbacks27  callbacks: ...
```

Example 4 (lua):
```lua
1components:2  schemas:3    User:4      type: object5      ...6    Pet:7      type: object8      ...
```

---

## Links | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/links/

**Contents:**
- Links
  - When to Use Links?
  - Defining Links
  - operationId
  - operationRef
  - parameters and requestBody
  - Runtime Expression Syntax
    - Examples
  - server
  - Reusing Links

OAS 3 This guide is for OpenAPI 3.0.

Links are one of the new features of OpenAPI 3.0. Using links, you can describe how various values returned by one operation can be used as input for other operations. This way, links provide a known relationship and traversal mechanism between the operations. The concept of links is somewhat similar to hypermedia, but OpenAPI links do not require the link information present in the actual responses.

Consider the “create user” operation:

This user ID can then be used to read, update or delete the user: GET /users/305, PATCH /users/305 and DELETE /users/305. Using links, you can specify that the id value returned by “create user” can be used as a parameter to “get user”, “update user” and “delete user”. Another example is pagination via cursors, where the response includes a cursor to retrieve the next data set:

However, linking relationships are not necessarily within the same resource, or even the same API specification.

Links are defined in the links section of each response:

To better understand this, let’s look at a complete example. This API defines the “create user” and “get user” operations, and the result of “create user” is used as an input to “get user”.

The links section contains named link definitions, in this example – just one link named GetUserByUserId. The link names can only contain the following characters:

Each link contains the following information:

The rest of this page goes into more detail about these keywords.

If the target operation has operationId specified, the link can point to this ID – as in the image above. This approach can be used for local links only, because the operationId values are resolved in the scope of the current API specification.

operationRef can be used when operationId is not available. operationRef is a reference to the target operation using the JSON Reference syntax – same as used by the $ref keyword. References can be local (within the current API specification):

Here, the string #/paths/~1users~1{userId}/get actually means #/paths//users/{userId}/get, but the inner slashes / in the path name need to be escaped as ~1 because they are special characters.

This syntax can be difficult to read, so we recommend using it for external links only. In case of local links, it is easier to assign operationId to all operations and link to these IDs instead.

The most important part of a link is computing the input for the target operation based on the values from the original operation. This is what the parameters and requestBody keywords are for.

The syntax is _parameter_name: value_ or requestBody: value. The parameter names and request body are those of the target operation. There is no need to list all the parameters, just those required to follow the link. Similarly, requestBody is only used if the target operation has a body and the link purpose is to define the body contents. If two or more parameters have the same name, prefix the names with the parameter location – path, query, header, or cookie, like so:

The values for parameters and requestBody can be defined in the following ways:

You would typically use constant values if you need to pass a specific combination of evaluated and hard-coded parameters for the target operation.

OpenAPI runtime expressions are syntax for extracting various values from an operation’s request and response. Links use runtime expressions to specify the parameter values to be passed to the linked operation. The expressions are called “runtime” because the values are extracted from the actual request and response of the API call and not, say, the example values provided in the API specification. The following table describes the runtime expression syntax. All expressions refer to the current operation where the links are defined.

The full request URL, including the query string.

Request HTTP method, such as GET or POST.

$request.query._param_name_

The value of the specified query parameter. The parameter must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Parameter names are case-sensitive.

$request.path._param_name_

The value of the specified path parameter. The parameter must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Parameter names are case-sensitive.

$request.header._header_name_

The value of the specified request header. This header must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Header names are case-insensitive.

The entire request body.

$request.body_#/foo/bar_

A portion of the request body specified by a JSON Pointer.

HTTP status code of the response. For example, 200 or 404.

$response.header._header_name_

The complete value of the specified response header, as a string. Header names are case-insensitive. The header does not need to be defined in the response’s headers section.

The entire response body.

$response.body_#/foo/bar_

A portion of the request body specified by a JSON Pointer.

foo{$request.path.id}bar

Enclose an expression into {} curly braces to embed it into a string.

Consider the following request and response:

Below are some examples of runtime expressions and the values they evaluate to:

By default, the target operation is called against its default servers – either global servers, or operation-specific servers. However, the server can be overridden by the link using the server keyword. server has the same fields as global servers, but it is a single server and not an array.

Links can be defined inline (as in the previous examples), or placed in the global components/links section and referenced from an operation’s links section via $ref. This can be useful if multiple operations link to another operation in the same way – referencing helps reduce code duplication. In the following example, both the “create user” and “update user” operations return the user ID in the response body, and this ID is used in the “get user” operation. The source operations reuse the same link definition from components/links.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1POST /users HTTP/1.12Host: example.com3Content-Type: application/json4
5{6  "name": "Alex",7  "age": 278}9
10which returns the ID of the created user:11
12HTTP/1.1 201 Created13Content-Type: application/json14
15{16  "id": 30517}
```

Example 2 (lua):
```lua
1GET /items?limit=1002
3  ⇩4
5{6  "metadata": {7    "previous": null,8    "next": "Q1MjAwNz",9    "count": 1010  },11  ...12}13
14  ⇩15
16GET /items?cursor=Q1MjAwNz&limit=100
```

Example 3 (lua):
```lua
1responses:2  "200":3    description: Created4    content: ...5    links: # <----6      ...7  "400":8    description: Bad request9    content: ...10    links: # <----11      ...
```

Example 4 (scala):
```scala
1openapi: 3.0.42info:3  version: 0.0.04  title: Links example5
6paths:7  /users:8    post:9      summary: Creates a user and returns the user ID10      operationId: createUser11      requestBody:12        required: true13        description: A JSON object that contains the user name and age.14        content:15          application/json:16            schema:17              $ref: "#/components/schemas/User"18      responses:19        "201":20          description: Created21          content:22            application/json:23              schema:24                type: object25                properties:26                  id:27                    type: integer28                    format: int6429                    description: ID of the created user.30          # -----------------------------------------------------31          # Links32          # -----------------------------------------------------33          links:34            GetUserByUserId: # <---- arbitrary name for the link35              operationId: getUser36              # or37              # operationRef: '#/paths/~1users~1{userId}/get'38              parameters:39                userId: "$response.body#/id"40
41              description: >42                The `id` value returned in the response can be used as43                the `userId` parameter in `GET /users/{userId}`.44          # -----------------------------------------------------45
46  /users/{userId}:47    get:48      summary: Gets a user by ID49      operationId: getUser50      parameters:51        - in: path52          name: userId53          required: true54          schema:55            type: integer56            format: int6457      responses:58        "200":59          description: A User object60          content:61            application/json:62              schema:63                $ref: "#/components/schemas/User"64
65components:66  schemas:67    User:68      type: object69      properties:70        id:71          type: integer72          format: int6473          readOnly: true74        name:75          type: string
```

---

## File Upload | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-request-body/file-upload/

**Contents:**
- File Upload
  - Upload via Multipart Requests
  - Multiple File Upload
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

In OpenAPI 3.0, you can describe files uploaded directly with the request content and files uploaded with multipart requests. Use the requestBody keyword to describe the request payload containing a file. Under content, specify the request media type (such as image/png or application/octet-stream). Files use a type: string schema with format: binary or format: base64, depending on how the file contents will be encoded. For example:

This definition corresponds to an HTTP request that looks as follows:

To describe a file sent with other data, use the multipart media type. For example:

The corresponding HTTP request payload will include multiple parts:

Use the multipart media type to define uploading an arbitrary number of files (an array of files):

The corresponding HTTP request will look as follows:

For more information about file upload in OpenAPI, see the following sections of the OpenAPI 3.0 Specification:

Considerations for File Uploads

Special Considerations for multipart Content

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1requestBody:2  content:3    image/png:4      schema:5        type: string6        format: binary
```

Example 2 (json):
```json
1POST /upload2Host: example.com3Content-Length: 8084Content-Type: image/png5
6[file content goes there]
```

Example 3 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties:7          orderId:8            type: integer9          userId:10            type: integer11          fileName:12            type: string13            format: binary
```

Example 4 (sass):
```sass
1POST /upload2Host: example.com3Content-Length: 27404Content-Type: multipart/form-data; boundary=abcde123455
6--abcde123457Content-Disposition: form-data; name="orderId"8
9119510--abcde1234511Content-Disposition: form-data; name="userId"12
1354514--abcde1234515Content-Disposition: form-data; name="fileName"; filename="attachment.txt"16Content-Type: text/plain17
18[file content goes there]19--abcde12345--
```

---

## Links | Swagger Docs

**URL:** https://swagger.io/docs/specification/links/

**Contents:**
- Links
  - When to Use Links?
  - Defining Links
  - operationId
  - operationRef
  - parameters and requestBody
  - Runtime Expression Syntax
    - Examples
  - server
  - Reusing Links

OAS 3 This guide is for OpenAPI 3.0.

Links are one of the new features of OpenAPI 3.0. Using links, you can describe how various values returned by one operation can be used as input for other operations. This way, links provide a known relationship and traversal mechanism between the operations. The concept of links is somewhat similar to hypermedia, but OpenAPI links do not require the link information present in the actual responses.

Consider the “create user” operation:

This user ID can then be used to read, update or delete the user: GET /users/305, PATCH /users/305 and DELETE /users/305. Using links, you can specify that the id value returned by “create user” can be used as a parameter to “get user”, “update user” and “delete user”. Another example is pagination via cursors, where the response includes a cursor to retrieve the next data set:

However, linking relationships are not necessarily within the same resource, or even the same API specification.

Links are defined in the links section of each response:

To better understand this, let’s look at a complete example. This API defines the “create user” and “get user” operations, and the result of “create user” is used as an input to “get user”.

The links section contains named link definitions, in this example – just one link named GetUserByUserId. The link names can only contain the following characters:

Each link contains the following information:

The rest of this page goes into more detail about these keywords.

If the target operation has operationId specified, the link can point to this ID – as in the image above. This approach can be used for local links only, because the operationId values are resolved in the scope of the current API specification.

operationRef can be used when operationId is not available. operationRef is a reference to the target operation using the JSON Reference syntax – same as used by the $ref keyword. References can be local (within the current API specification):

Here, the string #/paths/~1users~1{userId}/get actually means #/paths//users/{userId}/get, but the inner slashes / in the path name need to be escaped as ~1 because they are special characters.

This syntax can be difficult to read, so we recommend using it for external links only. In case of local links, it is easier to assign operationId to all operations and link to these IDs instead.

The most important part of a link is computing the input for the target operation based on the values from the original operation. This is what the parameters and requestBody keywords are for.

The syntax is _parameter_name: value_ or requestBody: value. The parameter names and request body are those of the target operation. There is no need to list all the parameters, just those required to follow the link. Similarly, requestBody is only used if the target operation has a body and the link purpose is to define the body contents. If two or more parameters have the same name, prefix the names with the parameter location – path, query, header, or cookie, like so:

The values for parameters and requestBody can be defined in the following ways:

You would typically use constant values if you need to pass a specific combination of evaluated and hard-coded parameters for the target operation.

OpenAPI runtime expressions are syntax for extracting various values from an operation’s request and response. Links use runtime expressions to specify the parameter values to be passed to the linked operation. The expressions are called “runtime” because the values are extracted from the actual request and response of the API call and not, say, the example values provided in the API specification. The following table describes the runtime expression syntax. All expressions refer to the current operation where the links are defined.

The full request URL, including the query string.

Request HTTP method, such as GET or POST.

$request.query._param_name_

The value of the specified query parameter. The parameter must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Parameter names are case-sensitive.

$request.path._param_name_

The value of the specified path parameter. The parameter must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Parameter names are case-sensitive.

$request.header._header_name_

The value of the specified request header. This header must be defined in the operation’s parameters section, otherwise, it cannot be evaluated. Header names are case-insensitive.

The entire request body.

$request.body_#/foo/bar_

A portion of the request body specified by a JSON Pointer.

HTTP status code of the response. For example, 200 or 404.

$response.header._header_name_

The complete value of the specified response header, as a string. Header names are case-insensitive. The header does not need to be defined in the response’s headers section.

The entire response body.

$response.body_#/foo/bar_

A portion of the request body specified by a JSON Pointer.

foo{$request.path.id}bar

Enclose an expression into {} curly braces to embed it into a string.

Consider the following request and response:

Below are some examples of runtime expressions and the values they evaluate to:

By default, the target operation is called against its default servers – either global servers, or operation-specific servers. However, the server can be overridden by the link using the server keyword. server has the same fields as global servers, but it is a single server and not an array.

Links can be defined inline (as in the previous examples), or placed in the global components/links section and referenced from an operation’s links section via $ref. This can be useful if multiple operations link to another operation in the same way – referencing helps reduce code duplication. In the following example, both the “create user” and “update user” operations return the user ID in the response body, and this ID is used in the “get user” operation. The source operations reuse the same link definition from components/links.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1POST /users HTTP/1.12Host: example.com3Content-Type: application/json4
5{6  "name": "Alex",7  "age": 278}9
10which returns the ID of the created user:11
12HTTP/1.1 201 Created13Content-Type: application/json14
15{16  "id": 30517}
```

Example 2 (lua):
```lua
1GET /items?limit=1002
3  ⇩4
5{6  "metadata": {7    "previous": null,8    "next": "Q1MjAwNz",9    "count": 1010  },11  ...12}13
14  ⇩15
16GET /items?cursor=Q1MjAwNz&limit=100
```

Example 3 (lua):
```lua
1responses:2  "200":3    description: Created4    content: ...5    links: # <----6      ...7  "400":8    description: Bad request9    content: ...10    links: # <----11      ...
```

Example 4 (scala):
```scala
1openapi: 3.0.42info:3  version: 0.0.04  title: Links example5
6paths:7  /users:8    post:9      summary: Creates a user and returns the user ID10      operationId: createUser11      requestBody:12        required: true13        description: A JSON object that contains the user name and age.14        content:15          application/json:16            schema:17              $ref: "#/components/schemas/User"18      responses:19        "201":20          description: Created21          content:22            application/json:23              schema:24                type: object25                properties:26                  id:27                    type: integer28                    format: int6429                    description: ID of the created user.30          # -----------------------------------------------------31          # Links32          # -----------------------------------------------------33          links:34            GetUserByUserId: # <---- arbitrary name for the link35              operationId: getUser36              # or37              # operationRef: '#/paths/~1users~1{userId}/get'38              parameters:39                userId: "$response.body#/id"40
41              description: >42                The `id` value returned in the response can be used as43                the `userId` parameter in `GET /users/{userId}`.44          # -----------------------------------------------------45
46  /users/{userId}:47    get:48      summary: Gets a user by ID49      operationId: getUser50      parameters:51        - in: path52          name: userId53          required: true54          schema:55            type: integer56            format: int6457      responses:58        "200":59          description: A User object60          content:61            application/json:62              schema:63                $ref: "#/components/schemas/User"64
65components:66  schemas:67    User:68      type: object69      properties:70        id:71          type: integer72          format: int6473          readOnly: true74        name:75          type: string
```

---

## Parameter Serialization | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/serialization/

**Contents:**
- Parameter Serialization
  - Path Parameters
  - Query Parameters
  - Header Parameters
  - Cookie Parameters
  - Serialization and RFC 6570
  - Other Serialization Methods

OAS 3 This guide is for OpenAPI 3.0.

Serialization means translating data structures or object state into a format that can be transmitted and reconstructed later. OpenAPI 3.0 supports arrays and objects in operation parameters (path, query, header, and cookie) and lets you specify how these parameters should be serialized. The serialization method is defined by the style and explode keywords:

OpenAPI serialization rules are based on a subset of URI template patterns defined by RFC 6570. Tool implementers can use existing URI template libraries to handle the serialization, as explained below.

Path parameters support the following style values:

The default serialization method is style: simple and explode: false. Given the path /users/{id}, the path parameter id is serialized as follows:

The label and matrix styles are sometimes used with partial path parameters, such as /users{id}, because the parameter values get prefixed.

Query parameters support the following style values:

The default serialization method is style: form and explode: true. This corresponds to collectionFormat: multi from OpenAPI 2.0. Given the path /users with a query parameter id, the query string is serialized as follows:

* Default serialization method

Additionally, the allowReserved keyword specifies whether the reserved characters :/?#[]@!$&'()*+,;= in parameter values are allowed to be sent as they are, or should be percent-encoded. By default, allowReserved is false, and reserved characters are percent-encoded. For example, / is encoded as %2F (or %2f), so that the parameter value quotes/h2g2.txt will be sent as quotes%2Fh2g2.txt.

Header parameters always use the simple style, that is, comma-separated values. This corresponds to the {param_name} URI template. An optional explode keyword controls the object serialization. Given the request header named X-MyHeader, the header value is serialized as follows:

Cookie parameters always use the form style. An optional explode keyword controls the array and object serialization. Given the cookie named id, the cookie value is serialized as follows:

OpenAPI serialization rules are based on a subset of URI templates defined by RFC 6570. Tool implementers can use existing URI template libraries to handle the serialization. You will need to construct the URI template based on the path and parameter definitions. The following table shows how OpenAPI keywords are mapped to the URI Template modifiers.

For example, consider the path /users{id} with a query parameter metadata, defined like so:

The path parameter id uses the matrix style with the explode modifier, which corresponds to the {;id*} template. The query parameter metadata uses the default form style, which corresponds to the {?metadata} template. The complete URI template would look like:

A client application can then use an URI template library to generate the request URL based on this template and specific parameter values.

style and explode cover the most common serialization methods, but not all. For more complex scenarios (for example, a JSON-formatted object in the query string), you can use the content keyword and specify the media type that defines the serialization format. For more information, see schema vs content.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1paths:2  # /users;id=3;id=4?metadata=true3  /users{id}:4    get:5      parameters:6        - in: path7          name: id8          required: true9          schema:10            type: array11            items:12              type: integer13            minItems: 114          style: matrix15          explode: true16        - in: query17          name: metadata18          schema:19            type: boolean20          # Using the default serialization for query parameters:21          # style=form, explode=false, allowReserved=false22      responses:23        '200':24          description: A list of users
```

Example 2 (unknown):
```unknown
1/users{;id*}{?metadata}
```

---

## What Is OpenAPI? | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/about/

**Contents:**
- What Is OpenAPI?
  - What Is Swagger?
  - Why Use OpenAPI?

OpenAPI Specification (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file allows you to describe your entire API, including:

API specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines. The complete OpenAPI Specification can be found on GitHub: OpenAPI 3.0 Specification

Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs. The major Swagger tools include:

The ability of APIs to describe their own structure is the root of all awesomeness in OpenAPI. Once written, an OpenAPI specification and Swagger tools can drive your API development further in various ways:

---

## Bearer Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/

**Contents:**
- Bearer Authentication
  - Describing Bearer Authentication
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0.

Bearer authentication (also called token authentication) is an HTTP authentication scheme that involves security tokens called bearer tokens. The name “Bearer authentication” can be understood as “give access to the bearer of this token.” The bearer token is a cryptic string, usually generated by the server in response to a login request. The client must send this token in the Authorization header when making requests to protected resources:

The Bearer authentication scheme was originally created as part of OAuth 2.0 in RFC 6750, but is sometimes also used on its own. Similarly to Basic authentication, Bearer authentication should only be used over HTTPS (SSL).

In OpenAPI 3.0, Bearer authentication is a security scheme with type: http and scheme: bearer. You first need to define the security scheme under components/securitySchemes, then use the security keyword to apply this scheme to the desired scope – global (as in the example below) or specific operations:

Optional bearerFormat is an arbitrary string that specifies how the bearer token is formatted. Since bearer tokens are usually generated by the server, bearerFormat is used mainly for documentation purposes, as a hint to the clients. In the example above, it is “JWT”, meaning JSON Web Token. The square brackets [] in bearerAuth: [] contain a list of security scopes required for API calls. The list is empty because scopes are only used with OAuth 2 and OpenID Connect. In the example above, Bearer authentication is applied globally to the whole API. If you need to apply it to just a few operations, add security on the operation level instead of doing this globally:

Bearer authentication can also be combined with other authentication methods as explained in Using Multiple Authentication Types.

You can also define the 401 “Unauthorized” response returned for requests that do not contain a proper bearer token. Since the 401 response will be used by multiple operations, you can define it in the global components/responses section and reference elsewhere via $ref.

To learn more about responses, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1Authorization: Bearer <token>
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the security scheme type (HTTP bearer)4components:5  securitySchemes:6    bearerAuth: # arbitrary name for the security scheme7      type: http8      scheme: bearer9      bearerFormat: JWT # optional, arbitrary value for documentation purposes10
11# 2) Apply the security globally to all operations12security:13  - bearerAuth: [] # use the same name as above
```

Example 3 (yaml):
```yaml
1paths:2  /something:3    get:4      security:5        - bearerAuth: []
```

Example 4 (lua):
```lua
1paths:2  /something:3    get:4      ...5      responses:6        '401':7          $ref: '#/components/responses/UnauthorizedError'8        ...9    post:10      ...11      responses:12        '401':13          $ref: '#/components/responses/UnauthorizedError'14        ...15
16components:17  responses:18    UnauthorizedError:19      description: Access token is missing or invalid
```

---

## API Server and Base Path | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/api-host-and-base-path/

**Contents:**
- API Server and Base Path
  - Server URL Format
  - Server Templating
    - Examples
      - HTTPS and HTTP
      - Production, Development and Staging
      - SaaS and On-Premise
      - Regional Endpoints for Different Geographical Areas
  - Overriding Servers
  - Relative URLs

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

All API endpoints are relative to the base URL. For example, assuming the base URL of https://api.example.com/v1, the /users endpoint refers to https://api.example.com/v1/users.

In OpenAPI 3.0, you use the servers array to specify one or more base URLs for your API. servers replaces the host, basePath and schemes keywords used in OpenAPI 2.0. Each server has a url and an optional Markdown-formatted description.

You can also have multiple servers, for example, production and sandbox:

Server URL format follows RFC 3986 and usually looks like this:

The host can be a name or IP address (IPv4 or IPv6). WebSocket schemes ws:// and wss:// from OpenAPI 2.0 are also supported in OpenAPI 3.0. Examples of valid server URLs:

If the server URL is relative, it is resolved against the server where the given OpenAPI definition file is hosted (more on that below). Note: Server URL must not include query string parameters. For example, this is invalid:

If the servers array is not provided or is empty, the server URL defaults to /:

Any part of the server URL – scheme, host name or its parts, port, subpath – can be parameterized using variables. Variables are indicated by {curly braces} in the server url, like so:

Unlike path parameters, server variables do not use a schema. Instead, they are assumed to be strings. Variables can have arbitrary values, or may be restricted to an enum. In any case, a default value is required, which will be used if the client does not supply a value. Variable description is optional, but useful to have and supports Markdown (CommonMark) for rich text formatting. Common use cases for server templating:

Note: These two examples are semantically different. The second example explicitly sets the HTTPS server as default, whereas the first example does not have a default server.

The global servers array can be overridden on the path level or operation level. This is handy if some endpoints use a different server or base path than the rest of the API. Common examples are:

The URLs in the servers array can be relative, such as /v2. In this case, the URL is resolved against the server that hosts the given OpenAPI definition. This is useful in on-premises installations hosted on your customer’s own servers. For example, if the definition hosted at http://localhost:3001/openapi.yaml specifies url: /v2, the url is resolved to http://localhost:3001/v2. Relative URL resolution rules follow RFC 3986. Moreover, almost all other URLs in an API definition, including OAuth 2 flow endpoints, termsOfService, external documentation URL and others, can be specified relative to the server URL.

Note that if using multiple servers, the resources specified by relative URLs are expected to exist on all servers.

Relative References in URLs

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1https://api.example.com/v1/users?role=admin&status=active2\________________________/\____/ \______________________/3server URL       endpoint    query parameters4path
```

Example 2 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v1    # The "url: " prefix is required
```

Example 3 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v13    description: Production server (uses live data)4  - url: https://sandbox-api.example.com:8443/v15    description: Sandbox server (uses test data)
```

Example 4 (yaml):
```yaml
1scheme://host[:port][/path]
```

---

## API Keys | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/api-keys/

**Contents:**
- API Keys
  - Describing API Keys
  - Multiple API Keys
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Some APIs use API keys for authorization. An API key is a token that a client provides when making API calls. The key can be sent in the query string:

or as a request header:

API keys are supposed to be a secret that only the client and server know. Like Basic authentication, API key-based authentication is only considered secure if used together with other security mechanisms such as HTTPS/SSL.

In OpenAPI 3.0, API keys are described as follows:

This example defines an API key named X-API-Key sent as a request header X-API-Key: <key>. The key name ApiKeyAuth is an arbitrary name for the security scheme (not to be confused with the API key name, which is specified by the name key). The name ApiKeyAuth is used again in the security section to apply this security scheme to the API. Note: The securitySchemes section alone is not enough; you must also use security for the API key to have effect. security can also be set on the operation level instead of globally. This is useful if just a subset of the operations need the API key:

Note that it is possible to support multiple authorization types in an API. See Using Multiple Authentication Types.

Some APIs use a pair of security keys, say, API Key and App ID. To specify that the keys are used together (as in logical AND), list them in the same array item in the security array:

Note the difference from:

which means either key can be used (as in logical OR). For more examples, see Using Multiple Authentication Types.

You can define the 401 “Unauthorized” response returned for requests with missing or invalid API key. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global components/responses section and referenced elsewhere via $ref.

To learn more about describing responses, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1GET /something?api_key=abcdef12345
```

Example 2 (unknown):
```unknown
1GET /something HTTP/1.12X-API-Key: abcdef12345
```

Example 3 (sass):
```sass
1GET /something HTTP/1.12Cookie: X-API-KEY=abcdef12345
```

Example 4 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the key name and location4components:5  securitySchemes:6    ApiKeyAuth: # arbitrary name for the security scheme7      type: apiKey8      in: header # can be "header", "query" or "cookie"9      name: X-API-KEY # name of the header, query parameter or cookie10
11# 2) Apply the API key globally to all operations12security:13  - ApiKeyAuth: [] # use the same name as under securitySchemes
```

---

## Basic Structure | Swagger Docs

**URL:** https://swagger.io/docs/specification/basic-structure

**Contents:**
- Basic Structure
  - Metadata
  - Servers
  - Paths

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, visit OpenAPI 2.0 pages.

You can write OpenAPI definitions in YAML or JSON. In this guide, we use only YAML examples but JSON works equally well. A sample OpenAPI 3.0 definition written in YAML looks like:

All keyword names are case-sensitive.

Every API definition must include the version of the OpenAPI Specification that this definition is based on:

The OpenAPI version defines the overall structure of an API definition – what you can document and how you document it. OpenAPI 3.0 uses semantic versioning with a three-part version number. The available versions are 3.0.0, 3.0.1, 3.0.2, 3.0.3, and 3.0.4; they are functionally the same.

The info section contains API information: title, description (optional), version:

title is your API name. description is extended information about your API. It can be multiline and supports the CommonMark dialect of Markdown for rich text representation. HTML is supported to the extent provided by CommonMark (see HTML Blocks in CommonMark 0.27 Specification). version is an arbitrary string that specifies the version of your API (do not confuse it with file revision or the openapi version). You can use semantic versioning like major.minor.patch, or an arbitrary string like 1.0-beta or 2017-07-25. info also supports other keywords for contact information, license, terms of service, and other details.

Reference: Info Object.

The servers section specifies the API server and base URL. You can define one or several servers, such as production and sandbox.

All API paths are relative to the server URL. In the example above, /users means http://api.example.com/v1/users or http://staging-api.example.com/users, depending on the server used. For more information, see API Server and Base Path.

The paths section defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints. For example, GET /users can be described as:

**Examples:**

Example 1 (json):
```json
1openapi: 3.0.42info:3  title: Sample API4  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.5  version: 0.1.96
7servers:8  - url: http://api.example.com/v19    description: Optional server description, e.g. Main (production) server10  - url: http://staging-api.example.com11    description: Optional server description, e.g. Internal staging server for testing12
13paths:14  /users:15    get:16      summary: Returns a list of users.17      description: Optional extended description in CommonMark or HTML.18      responses:19        "200": # status code20          description: A JSON array of user names21          content:22            application/json:23              schema:24                type: array25                items:26                  type: string
```

Example 2 (yaml):
```yaml
1openapi: 3.0.4
```

Example 3 (yaml):
```yaml
1info:2  title: Sample API3  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.4  version: 0.1.9
```

Example 4 (yaml):
```yaml
1servers:2  - url: http://api.example.com/v13    description: Optional server description, e.g. Main (production) server4  - url: http://staging-api.example.com5    description: Optional server description, e.g. Internal staging server for testing
```

---

## What Is OpenAPI? | Swagger Docs

**URL:** https://swagger.io/docs/specification/about/

**Contents:**
- What Is OpenAPI?
  - What Is Swagger?
  - Why Use OpenAPI?

OpenAPI Specification (formerly Swagger Specification) is an API description format for REST APIs. An OpenAPI file allows you to describe your entire API, including:

API specifications can be written in YAML or JSON. The format is easy to learn and readable to both humans and machines. The complete OpenAPI Specification can be found on GitHub: OpenAPI 3.0 Specification

Swagger is a set of open-source tools built around the OpenAPI Specification that can help you design, build, document, and consume REST APIs. The major Swagger tools include:

The ability of APIs to describe their own structure is the root of all awesomeness in OpenAPI. Once written, an OpenAPI specification and Swagger tools can drive your API development further in various ways:

---

## Multipart Requests | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-request-body/multipart-requests/

**Contents:**
- Multipart Requests
  - Specifying Content-Type
  - Specifying Custom Headers

OAS 3 This guide is for OpenAPI 3.0.

Multipart requests combine one or more sets of data into a single body, separated by boundaries. You typically use these requests for file uploads and for transferring data of several types in a single request (for example, a file along with a JSON object). In OpenAPI 3, you describe a multipart request in the following way:

You start with the requestBody/content keyword. Then, you specify the media type of request data. File uploads typically use the _multipart/form-data_ media type, and mixed-data requests usually use _multipart/mixed_. Below the media type, put the schema keyword to indicate that you start describing the request payload. You describe individual parts of the request as properties of the schema object. As you can see, a multipart request can include various data: strings, objects in JSON format, and binary data. You can also specify one or several files for uploading. (To learn more, see File Upload.) The example above corresponds to the following request:

By default, the Content-Type of individual request parts is set automatically according to the type of the schema properties that describe the request parts:

Primitive or array of primitives

Complex value or array of complex values

String in the binary or base64 format

application/octet-stream

To set a specific Content-Type for a request part, use the encoding/_{property-name}_/contentType field. You add encoding as a child of the media type property, one the same level where schema is located. In the example below, we set the contentType for the profileImage part of a multipart request to image/png, image/jpg:

Parts of multipart requests usually do not use any headers, except for Content. In case you need to include custom headers, use the encoding/_{property-name}_/headers field to describe these headers (see below). For complete information on describing headers, see Describing Parameters. Below is an example of a custom header defined for a part of a multipart request:

This declaration matches the following request:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data: # Media type4      schema: # Request payload5        type: object6        properties: # Request parts7          id: # Part 1 (string value)8            type: string9            format: uuid10          address: # Part2 (object)11            type: object12            properties:13              street:14                type: string15              city:16                type: string17          profileImage: # Part 3 (an image)18            type: string19            format: binary
```

Example 2 (sass):
```sass
1POST /upload HTTP/1.12Content-Length: 4283Content-Type: multipart/form-data; boundary=abcde123454
5--abcde123456Content-Disposition: form-data; name="id"7Content-Type: text/plain8
9123e4567-e89b-12d3-a456-42665544000010--abcde1234511Content-Disposition: form-data; name="address"12Content-Type: application/json13
14{15  "street": "3, Garden St",16  "city": "Hillsbery, UT"17}18--abcde1234519Content-Disposition: form-data; name="profileImage "; filename="image1.png"20Content-Type: application/octet-stream21
22{…file content…}23--abcde12345--
```

Example 3 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties: # Request parts7          id:8            type: string9            format: uuid10          address:11            type: object12            properties:13              street:14                type: string15              city:16                type: string17          profileImage:18            type: string19            format: base6420      encoding: # The same level as schema21        profileImage: # Property name (see above)22          contentType: image/png, image/jpeg
```

Example 4 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties:7          id:8            type: string9            format: uuid10          profileImage:11            type: string12            format: binary13      encoding:14        profileImage: # Property name15          contentType: image/png, image/jpeg16          headers: # Custom headers17            X-Custom-Header:18              description: This is a custom header19              schema:20                type: string
```

---

## Describing Parameters | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-parameters/

**Contents:**
- Describing Parameters
  - Parameter Types
  - Path Parameters
  - Query Parameters
    - Reserved Characters in Query Parameters
  - Header Parameters
  - Cookie Parameters
  - Required and Optional Parameters
  - schema vs content
  - Default Parameter Values

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

In OpenAPI 3.0, parameters are defined in the parameters section of an operation or path. To describe a parameter, you specify its name, location (in), data type (defined by either schema or content) and other attributes, such as description or required. Here is an example:

Note that parameters is an array, so, in YAML, each parameter definition must be listed with a dash (-) in front of it.

OpenAPI 3.0 distinguishes between the following parameter types based on the parameter location. The location is determined by the parameter’s in key, for example, in: query or in: path.

Path parameters are variable parts of a URL path. They are typically used to point to a specific resource within a collection, such as a user identified by ID. A URL can have several path parameters, each denoted with curly braces { }.

Each path parameter must be substituted with an actual value when the client makes an API call. In OpenAPI, a path parameter is defined using in: path. The parameter name must be the same as specified in the path. Also remember to add required: true, because path parameters are always required. For example, the /users/{id} endpoint would be described as:

Path parameters containing arrays and objects can be serialized in different ways:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

Query parameters are the most common type of parameters. They appear at the end of the request URL after a question mark (?), with different name=value pairs separated by ampersands (&). Query parameters can be required and optional.

Use in: query to denote query parameters:

Note: To describe API keys passed as query parameters, use securitySchemes and security instead. See API Keys.

Query parameters can be primitive values, arrays and objects. OpenAPI 3.0 provides several ways to serialize objects and arrays in the query string.

Arrays can be serialized as:

Objects can be serialized as:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

RFC 3986 defines a set of reserved characters :/?#[]@!$&'()*+,;= that are used as URI component delimiters. When these characters need to be used literally in a query parameter value, they are usually percent-encoded. For example, / is encoded as %2F (or %2f), so that the parameter value quotes/h2g2.txt would be sent as

If you want a query parameter that is not percent-encoded, add allowReserved: true to the parameter definition:

In this case, the parameter value would be sent like so:

An API call may require that custom headers be sent with an HTTP request. OpenAPI lets you define custom request headers as in: header parameters. For example, suppose, a call to GET /ping requires the X-Request-ID header:

Using OpenAPI 3.0, you would define this operation as follows:

In a similar way, you can define custom response headers. Header parameter can be primitives, arrays and objects. Arrays and objects are serialized using the simple style. For more information, see Parameter Serialization.

Note: Header parameters named Accept, Content-Type and Authorization are not allowed. To describe these headers, use the corresponding OpenAPI keywords:

Operations can also pass parameters in the Cookie header, as Cookie: name=value. Multiple cookie parameters are sent in the same header, separated by a semicolon and space.

Use in: cookie to define cookie parameters:

Cookie parameters can be primitive values, arrays and objects. Arrays and objects are serialized using the form style. For more information, see Parameter Serialization.

Note: To define cookie authentication, use API keys instead.

By default, OpenAPI treats all request parameters as optional. You can add required: true to mark a parameter as required. Note that path parameters must have required: true, because they are always required.

To describe the parameter contents, you can use either the schema or content keyword. They are mutually exclusive and used in different scenarios. In most cases, you would use schema. It lets you describe primitive values, as well as simple arrays and objects serialized into a string. The serialization method for array and object parameters is defined by the style and explode keywords used in that parameter.

content is used in complex serialization scenarios that are not covered by style and explode. For example, if you need to send a JSON string in the query string like so:

In this case, you need to wrap the parameter schema into content/<media-type> as shown below. The schema defines the parameter data structure, and the media type (in this example – application/json) serves as a reference to an external specification that describes the serialization format.

Note for Swagger UI and Swagger Editor users: Parameters with content are supported in Swagger UI 3.23.7+ and Swagger Editor 3.6.34+.

Use the default keyword in the parameter schema to specify the default value for an optional parameter. The default value is the one that the server uses if the client does not supply the parameter value in the request. The value type must be the same as the parameter’s data type. A typical example is paging parameters such as offset and limit:

Assuming offset defaults to 0 and limit defaults to 20 and ranges from 0 to 100, you would define these parameters as:

There are two common mistakes when using the default keyword:

You can restrict a parameter to a fixed set of values by adding the enum to the parameter’s schema. The enum values must be of the same type as the parameter data type.

More info: Defining an Enum.

You can define a constant parameter as a required parameter with only one possible value:

The enum property specifies possible values. In this example, only one value can be used, and this will be the only value available in the Swagger UI for the user to choose from.

Note: A constant parameter is not the same as the default parameter value. A constant parameter is always sent by the client, whereas the default value is something that the server uses if the parameter is not sent by the client.

Query string parameters may only have a name and no value, like so:

Use allowEmptyValue to describe such parameters:

OpenAPI 3.0 also supports nullable in schemas, allowing operation parameters to have the null value. For example, the following schema corresponds to int? in C# and java.lang.Integer in Java:

Note: nullable is not the same as an optional parameter or an empty-valued parameter. nullable means the parameter value can be null. Specific implementations may choose to map an absent or empty-valued parameter to null, but strictly speaking these are not the same thing.

You can specify an example or multiple examples for a parameter. The example value should match the parameter schema. Single example:

Multiple named examples:

For details, see Adding Examples.

Use deprecated: true to mark a parameter as deprecated.

Parameters shared by all operations of a path can be defined on the path level instead of the operation level. Path-level parameters are inherited by all operations of that path. A typical use case are the GET/PUT/PATCH/DELETE operations that manipulate a resource accessed via a path parameter.

Any extra parameters defined at the operation level are used together with path-level parameters:

Specific path-level parameters can be overridden on the operation level, but cannot be removed.

Different API paths may have common parameters, such as pagination parameters. You can define common parameters under parameters in the global components section and reference them elsewhere via $ref.

Note that the parameters defined in components are not parameters applied to all operations — they are simply global definitions that can be easily re-used.

OpenAPI 3.0 does not support parameter dependencies and mutually exclusive parameters. There is an open feature request at https://github.com/OAI/OpenAPI-Specification/issues/256. What you can do is document the restrictions in the parameter description and define the logic in the 400 Bad Request response. For example, consider the /report endpoint that accepts either a relative date range (rdate) or an exact range (start_date+end_date):

You can describe this endpoint as follows:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /users/{userId}:3    get:4      summary: Get a user by ID5      parameters:6        - in: path7          name: userId8          schema:9            type: integer10          required: true11          description: Numeric ID of the user to get
```

Example 2 (unknown):
```unknown
1GET /users/{id}2GET /cars/{carId}/drivers/{driverId}3GET /report.{format}
```

Example 3 (yaml):
```yaml
1paths:2  /users/{id}:3    get:4      parameters:5        - in: path6          name: id # Note the name is the same as in the path7          required: true8          schema:9            type: integer10            minimum: 111          description: The user ID
```

Example 4 (sass):
```sass
1GET /pets/findByStatus?status=available2GET /notes?offset=100&limit=50
```

---

## File Upload | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/file-upload/

**Contents:**
- File Upload
  - Upload a File + Other Data
  - Multiple Upload
  - FAQ

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Swagger 2.0 supports file uploads sent with Content-Type: multipart/form-data. That is, your API server must consume multipart/form-data for this operation:

The operation payload is defined using formData parameters (not body parameters). The file parameter must have type: file:

This definition corresponds to the following HTTP request:

Swagger UI displays file parameters using a file input control, allowing the users to browse for a local file to upload.

File parameters can be sent along with other form data:

The corresponding HTTP request payload will include multiple parts:

You can have several named file parameters, each defined individually:

However, uploading an arbitrary number of files (an array of files) is not supported. There is an open feature request at https://github.com/OAI/OpenAPI-Specification/issues/254. For now, you can use a binary string array as a workaround for uploading an arbitrary number of files:

Note that this will not produce the file upload interface in Swagger UI.

Can I upload files via PUT?

Swagger 2.0 supports file upload requests with Content-Type: multipart/form-data, but does not care about the HTTP method. You can use POST, PUT or any other method, provided that the operation consumes multipart/form-data. Uploads where the payload is just the raw file contents are not supported in Swagger 2.0, because they are not multipart/form-data. That is, Swagger 2.0 does NOT support something like:

Note also that file uploading in Swagger UI only works for POST requests, because HTML forms in browsers support GET and POST methods only.

Can I define the Content-Type for uploaded files?

This is supported in OpenAPI 3.0, but not in OpenAPI/Swagger 2.0. In 2.0, you can say that an operation accepts a file, but you cannot say that this file is of a specific type or structure.

As a workaround, vendor extensions may be used to extend this functionality, for example:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1consumes:2  - multipart/form-data
```

Example 2 (yaml):
```yaml
1paths:2  /upload:3    post:4      summary: Uploads a file.5      consumes:6        - multipart/form-data7      parameters:8        - in: formData9          name: upfile10          type: file11          description: The file to upload.
```

Example 3 (sass):
```sass
1POST /upload2Host: example.com3Content-Type: multipart/form-data; boundary=abcde123454Content-Length: 2045
6--abcde123457Content-Disposition: form-data; name="upfile"; filename="example.txt"8Content-Type: text/plain9
10File contents go here.11--abcde12345--
```

Example 4 (yaml):
```yaml
1parameters:2  - in: formData3    name: upfile4    type: file5    required: true6    description: The file to upload.7  - in: formData8    name: note9    type: string10    required: false11    description: Description of file contents.
```

---

## oneOf, anyOf, allOf, not | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/oneof-anyof-allof-not/

**Contents:**
- oneOf, anyOf, allOf, not
  - oneOf
  - allOf
  - anyOf
  - Difference Between anyOf and oneOf
  - not

OAS 3 This guide is for OpenAPI 3.0.

OpenAPI 3.0 provides several keywords which you can use to combine schemas. You can use these keywords to create a complex schema, or validate a value against multiple criteria.

Besides these, there is a not keyword which you can use to make sure the value is not valid against the specified schema.

Use the oneOf keyword to ensure the given data is valid against one of the specified schemas.

The example above shows how to validate the request body in the “update” operation (PATCH). You can use it to validate the request body contains all the necessary information about the object to be updated, depending on the object type. Note the inline or referenced schema must be a schema object, not a standard JSON Schema. Now, to validation. The following JSON object is valid against one of the schemas, so the request body is correct:

The following JSON object is not valid against both schemas, so the request body is incorrect:

The following JSON object is valid against both schemas, so the request body is incorrect – it should be valid against only one of the schemas, since we are using the oneOf keyword.

OpenAPI lets you combine and extend model definitions using the allOf keyword. allOf takes an array of object definitions that are used for independent validation but together compose a single object. Still, it does not imply a hierarchy between the models. For that purpose, you should include the discriminator. To be valid against allOf, the data provided by the client must be valid against all of the given subschemas. In the following example, allOf acts as a tool for combining schemas used in specific cases with the general one. For more clearness, oneOf is also used with a discriminator.

As you can see, this example validates the request body content to make sure it includes all the information needed to update a pet item with the PUT operation. It requires user to specify which type of the item should be updated, and validates against the specified schema according to their choice. Note the inline or referenced schema must be a schema object, not a standard JSON schema. For that example, all of the following request bodies are valid:

The following request bodies are not valid:

Use the anyOf keyword to validate the data against any amount of the given subschemas. That is, the data may be valid against one or more subschemas at the same time.

Note the inline or referenced schema must be a schema object, not a standard JSON schema. With this example, the following JSON request bodies are valid:

The following example is not valid, because it does not contain any of the required properties for both of the schemas:

oneOf matches exactly one subschema, and anyOf can match one or more subschemas. To better understand the difference, use the example above but replace anyOf with oneOf. When using oneOf, the following request body is not valid because it matches both schemas and not just one:

The not keyword does not exactly combine schemas, but as all of the keywords mentioned above it helps you to modify your schemas and make them more specific.

In this example, user should specify the pet_type value of any type except integer (that is, it should be an array, boolean, number, object, or string). The following request body is valid:

And the following is not valid:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    patch:4      requestBody:5        content:6          application/json:7            schema:8              oneOf:9                - $ref: "#/components/schemas/Cat"10                - $ref: "#/components/schemas/Dog"11      responses:12        "200":13          description: Updated14
15components:16  schemas:17    Dog:18      type: object19      properties:20        bark:21          type: boolean22        breed:23          type: string24          enum: [Dingo, Husky, Retriever, Shepherd]25    Cat:26      type: object27      properties:28        hunts:29          type: boolean30        age:31          type: integer
```

Example 2 (json):
```json
1{ "bark": true, "breed": "Dingo" }
```

Example 3 (json):
```json
1{ "bark": true, "hunts": true }
```

Example 4 (json):
```json
1{ "bark": true, "hunts": true, "breed": "Husky", "age": 3 }
```

---

## Paths and Operations | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/paths-and-operations/

**Contents:**
- Paths and Operations
  - Paths
  - Path Templating
  - Operations
  - Operation Parameters
  - Query String in Paths
  - operationId
  - Deprecated Operations
  - Overriding Global Servers

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

In OpenAPI terms, paths are endpoints (resources), such as /users or /reports/summary/, that your API exposes, and operations are the HTTP methods used to manipulate these paths, such as GET, POST or DELETE.

API paths and operations are defined in the global paths section of the API specification.

All paths are relative to the API server URL. The full request URL is constructed as <server-url>/path. Global servers can also be overridden on the path level or operation level (more on that below). Paths may have an optional short summary and a longer description for documentation purposes. This information is supposed to be relevant to all operations in this path. description can be multi-line and supports Markdown (CommonMark) for rich text representation.

You can use curly braces {} to mark parts of an URL as path parameters:

The API client needs to provide appropriate parameter values when making an API call, such as /users/5 or /users/12.

For each path, you define operations (HTTP methods) that can be used to access that path. OpenAPI 3.0 supports get, post, put, patch, delete, head, options, and trace. A single path can support multiple operations, for example GET /users to get a list of users and POST /users to add a new user. OpenAPI defines a unique operation as a combination of a path and an HTTP method. This means that two GET or two POST methods for the same path are not allowed – even if they have different parameters (parameters have no effect on uniqueness). Below is a minimal example of an operation:

Here is a more detailed example with parameters and response schema:

Operations also support some optional elements for documentation purposes:

OpenAPI 3.0 supports operation parameters passed via path, query string, headers, and cookies. You can also define the request body for operations that transmit data to the server, such as POST, PUT and PATCH. For details, see Describing Parameters and Describing Request Body.

Query string parameters must not be included in paths. They should be defined as query parameters instead.

This also means that it is impossible to have multiple paths that differ only in query string, such as:

This is because OpenAPI considers a unique operation as a combination of a path and the HTTP method, and additional parameters do not make the operation unique. Instead, you should use unique paths such as:

operationId is an optional unique string used to identify an operation. If provided, these IDs must be unique among all operations described in your API.

Some common use cases for operationId are:

You can mark specific operations as deprecated to indicate that they should be transitioned out of usage:

Tools may handle deprecated operations in a specific way. For example, Swagger UI displays them with a different style:

The global servers array can be overridden on the path level or operation level. This is useful if some endpoints use a different server or base path than the rest of the API. Common examples are:

Different base URL for file upload and download operations.

Deprecated but still functional endpoints.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /ping: ...3  /users: ...4  /users/{id}: ...
```

Example 2 (lua):
```lua
1paths:2  /users/{id}:3    summary: Represents a user4    description: >5      This resource represents an individual user in the system.6      Each user is identified by a numeric `id`.7
8    get: ...9    patch: ...10    delete: ...
```

Example 3 (unknown):
```unknown
1/users/{id}2/organizations/{orgId}/members/{memberId}3/report.{format}
```

Example 4 (json):
```json
1paths:2  /ping:3    get:4      responses:5        "200":6          description: OK
```

---

## API Keys | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/authentication/api-keys/

**Contents:**
- API Keys
  - Pair of API Keys
  - 401 Response

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Some APIs use API keys for authorization. An API key is a special token that the client needs to provide when making API calls. The key is usually sent as a request header:

or as a query parameter:

API keys are supposed to be a secret that only the client and server know. But, as well as Basic authentication, API key-based authentication is not considered secure unless used together with other security mechanisms such as HTTPS/SSL.

To define API key-based security:

Then, use the security section on the root level or operation level to apply API keys to the whole API or specific operations.

Note that it is possible to support multiple authorization types in an API. See Using Multiple Authentication Types.

Some APIs use a pair of security keys, say, API Key and App ID. To specify that the keys are used together (as in logical AND), list them in the same array item in the security array:

Note the difference from:

which means either key can be used (as in logical OR). For more examples, see Using Multiple Authentication Types.

You can also define the 401 “Unauthorized” response returned for requests with missing or invalid API key. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global responses section and referenced from multiple operations.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (unknown):
```unknown
1GET /something HTTP/1.12X-API-Key: abcdef12345
```

Example 2 (sass):
```sass
1GET /something?api_key=abcdef12345
```

Example 3 (sass):
```sass
1securityDefinitions:2  # X-API-Key: abcdef123453  APIKeyHeader:4    type: apiKey5    in: header6    name: X-API-Key7  # /path?api_key=abcdef123458  APIKeyQueryParam:9    type: apiKey10    in: query11    name: api_key
```

Example 4 (json):
```json
1# Global security (applies to all operations):2security:3  - APIKeyHeader: []4paths:5  /something:6    get:7      # Operation-specific security:8      security:9        - APIKeyQueryParam: []10      responses:11        200:12          description: OK (successfully authenticated)
```

---

## API Server and Base Path | Swagger Docs

**URL:** https://swagger.io/docs/specification/api-host-and-base-path/

**Contents:**
- API Server and Base Path
  - Server URL Format
  - Server Templating
    - Examples
      - HTTPS and HTTP
      - Production, Development and Staging
      - SaaS and On-Premise
      - Regional Endpoints for Different Geographical Areas
  - Overriding Servers
  - Relative URLs

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

All API endpoints are relative to the base URL. For example, assuming the base URL of https://api.example.com/v1, the /users endpoint refers to https://api.example.com/v1/users.

In OpenAPI 3.0, you use the servers array to specify one or more base URLs for your API. servers replaces the host, basePath and schemes keywords used in OpenAPI 2.0. Each server has a url and an optional Markdown-formatted description.

You can also have multiple servers, for example, production and sandbox:

Server URL format follows RFC 3986 and usually looks like this:

The host can be a name or IP address (IPv4 or IPv6). WebSocket schemes ws:// and wss:// from OpenAPI 2.0 are also supported in OpenAPI 3.0. Examples of valid server URLs:

If the server URL is relative, it is resolved against the server where the given OpenAPI definition file is hosted (more on that below). Note: Server URL must not include query string parameters. For example, this is invalid:

If the servers array is not provided or is empty, the server URL defaults to /:

Any part of the server URL – scheme, host name or its parts, port, subpath – can be parameterized using variables. Variables are indicated by {curly braces} in the server url, like so:

Unlike path parameters, server variables do not use a schema. Instead, they are assumed to be strings. Variables can have arbitrary values, or may be restricted to an enum. In any case, a default value is required, which will be used if the client does not supply a value. Variable description is optional, but useful to have and supports Markdown (CommonMark) for rich text formatting. Common use cases for server templating:

Note: These two examples are semantically different. The second example explicitly sets the HTTPS server as default, whereas the first example does not have a default server.

The global servers array can be overridden on the path level or operation level. This is handy if some endpoints use a different server or base path than the rest of the API. Common examples are:

The URLs in the servers array can be relative, such as /v2. In this case, the URL is resolved against the server that hosts the given OpenAPI definition. This is useful in on-premises installations hosted on your customer’s own servers. For example, if the definition hosted at http://localhost:3001/openapi.yaml specifies url: /v2, the url is resolved to http://localhost:3001/v2. Relative URL resolution rules follow RFC 3986. Moreover, almost all other URLs in an API definition, including OAuth 2 flow endpoints, termsOfService, external documentation URL and others, can be specified relative to the server URL.

Note that if using multiple servers, the resources specified by relative URLs are expected to exist on all servers.

Relative References in URLs

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1https://api.example.com/v1/users?role=admin&status=active2\________________________/\____/ \______________________/3server URL       endpoint    query parameters4path
```

Example 2 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v1    # The "url: " prefix is required
```

Example 3 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v13    description: Production server (uses live data)4  - url: https://sandbox-api.example.com:8443/v15    description: Sandbox server (uses test data)
```

Example 4 (yaml):
```yaml
1scheme://host[:port][/path]
```

---

## Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/2-0/authentication/

**Contents:**
- Authentication
  - Using Multiple Authentication Types
  - FAQ
  - Reference

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Swagger 2.0 lets you define the following authentication types for an API:

Follow the links above for examples specific to these authentication types, or continue reading to learn how to describe authentication in general.

Authentication is described by using the securityDefinitions and security keywords. You use securityDefinitions to define all authentication types supported by the API, then use security to apply specific authentication types to the whole API or individual operations.

The securityDefinitions section is used to define all security schemes (authentication types) supported by the API. It is a name->definition map that maps arbitrary names to the security scheme definitions. Here, the API supports three security schemes named BasicAuth, ApiKeyAuth and OAuth2, and these names will be used to refer to these security schemes from elsewhere:

Each security scheme can be of type:

Other required properties depend on the security type. For details, check the Swagger Specification or our examples for Basic auth and API keys.

After you have defined the security schemes in securityDefinitions, you can apply them to the whole API or individual operations by adding the security section on the root level or operation level, respectively. When used on the root level, security applies the specified security schemes globally to all API operations, unless overridden on the operation level.

In the following example, the API calls can be authenticated using either an API key or OAuth 2. The ApiKeyAuth and OAuth2 names refer to the security schemes previously defined in securityDefinitions.

Global security can be overridden in individual operations to use a different authentication type, different OAuth 2 scopes, or no authentication at all:

Some REST APIs support several authentication types. The security section lets you combine the security requirements using logical OR and AND to achieve the desired result. security uses the following logic:

That is, security is an array of hashmaps, where each hashmap contains one or more named security schemes. Items in a hashmap are combined using logical AND, and array items are combined using logical OR. Security schemes combined via OR are alternatives – any one can be used in the given context. Security schemes combined via AND must be used simultaneously in the same request. Here, we can use either Basic authentication or an API key:

Here, the API requires a pair of API keys to be included in requests:

Here, we can use either OAuth 2 or a pair of API keys:

What does [ ] mean in “securitySchemeName: [ ]”?

[] is a YAML/JSON syntax for an empty array. The Swagger Specification requires that items in the security array specify a list of required scopes, as in:

Scopes are only used with OAuth 2, so the Basic and API key security items use an empty array instead.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1securityDefinitions:2  BasicAuth:3    type: basic4  ApiKeyAuth:5    type: apiKey6    in: header7    name: X-API-Key8  OAuth2:9    type: oauth210    flow: accessCode11    authorizationUrl: https://example.com/oauth/authorize12    tokenUrl: https://example.com/oauth/token13    scopes:14      read: Grants read access15      write: Grants write access16      admin: Grants read and write access to administrative information
```

Example 2 (yaml):
```yaml
1security:2  - ApiKeyAuth: []3  - OAuth2: [read, write]
```

Example 3 (elixir):
```elixir
1paths:2/billing_info:3  get:4    summary: Gets the account billing info5    security:6      - OAuth2: [admin]   # Use OAuth with a different scope7    responses:8      200:9        description: OK10      401:11        description: Not authenticated12      403:13        description: Access token does not have the required scope14
15/ping:16  get:17    summary: Checks if the server is running18    security: []   # No security19    responses:20      200:21        description: Server is up and running22      default:23        description: Something is wrong
```

Example 4 (yaml):
```yaml
1security:    # A OR B2  - A3  - B4
5security:    # A AND B6  - A7    B8
9security:    # (A AND B) OR (C AND D)10  - A11    B12  - C13    D
```

---

## Enums | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/enums/

**Contents:**
- Enums
  - Nullable enums
  - Reusable enums

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can use the enum keyword to specify possible values of a request parameter or a model property. For example, the sort parameter in GET /items?sort=[asc|desc] can be described as:

In YAML, you can also specify one enum value per line:

All values in an enum must adhere to the specified type. If you need to specify descriptions for enum items, you can do this in the description of the parameter or property:

A nullable enum can be defined as follows:

Note that null must be explicitly included in the list of enum values. Using nullable: true alone is not enough here.

In OpenAPI 3.0, both operation parameters and data models use a schema, making it easy to reuse the data types. You can define reusable enums in the global components section and reference them via $ref elsewhere.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /items:3    get:4      parameters:5        - in: query6          name: sort7          description: Sort order8          schema:9            type: string10            enum: [asc, desc]
```

Example 2 (yaml):
```yaml
1enum:2  - asc3  - desc
```

Example 3 (sql):
```sql
1parameters:2  - in: query3    name: sort4    schema:5      type: string6      enum: [asc, desc]7    description: >8      Sort order:9       * `asc` - Ascending, from A to Z10       * `desc` - Descending, from Z to A
```

Example 4 (yaml):
```yaml
1type: string2nullable: true  # <---3enum:4  - asc5  - desc6  - null        # <--- without quotes, i.e. null not "null"
```

---

## Using $ref | Swagger Docs

**URL:** https://swagger.io/docs/specification/using-ref/

**Contents:**
- Using $ref
  - $ref Syntax
  - Escape Characters
  - Considerations
    - Places Where $ref Can Be Used
    - $ref and Sibling Elements

OAS 3 This guide is for OpenAPI 3.0.

When you document an API, it is common to have some features which you use across several of API resources. In that case, you can create a snippet for such elements in order to use them multiple times when you need it. With OpenAPI 3.0, you can reference a definition hosted on any location. It can be the same server, or another one – for example, GitHub, SwaggerHub, and so on. To reference a definition, use the $ref keyword:

For example, suppose you have the following schema object, which you want to use inside your response:

To refer that object, you need to add $ref with the corresponding path to your response:

The value of $ref uses the JSON Reference notation, and the portion starting with # uses the JSON Pointer notation. This notation lets you specify the target file or a specific part of a file you want to reference. In the previous example, #/components/schemas/User means the resolving starts from the root of the current document, and then finds the values of components, schemas, and User one after another.

According to RFC3986, the $ref string value (JSON Reference) should contain a URI, which identifies the location of the JSON value you are referencing to. If the string value does not conform URI syntax rules, it causes an error during the resolving. Any members other than $ref in a JSON Reference object are ignored. Check this list for example values of a JSON reference in specific cases:

Note: When using local references such as #/components/schemas/User in YAML, enclose the value in quotes: '#/components/schemas/User'. Otherwise it will be treated as a comment.

/ and ~ are special characters in JSON Pointers, and need to be escaped when used literally (for example, in path names).

For example, to refer to the path /blogs/{blog_id}/new~posts, you would use:

A common misconception is that $ref is allowed anywhere in an OpenAPI specification file. Actually $ref is only allowed in places where the OpenAPI 3.0 Specification explicitly states that the value may be a reference. For example, $ref cannot be used in the info section and directly under paths:

However, you can $ref individual paths, like so:

Any sibling elements of a $ref are ignored. This is because $ref works by replacing itself and everything on its level with the definition it is pointing at. Consider this example:

In the second schema, the description and default properties are ignored, so this schema ends up exactly the same as the referenced Date schema.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1$ref: "reference to definition"
```

Example 2 (json):
```json
1"components":2  {3    "schemas":4      {5        "user":6          {7            "properties":8              { "id": { "type": "integer" }, "name": { "type": "string" } },9          },10      },11  }
```

Example 3 (yaml):
```yaml
1components:2  schemas:3    User:4      properties:5        id:6          type: integer7        name:8          type: string
```

Example 4 (json):
```json
1"responses":2  {3    "200":4      {5        "description": "The response",6        "schema": { "$ref": "#/components/schemas/user" },7      },8  }
```

---

## Enums | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/enums

**Contents:**
- Enums
  - Nullable enums
  - Reusable enums

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can use the enum keyword to specify possible values of a request parameter or a model property. For example, the sort parameter in GET /items?sort=[asc|desc] can be described as:

In YAML, you can also specify one enum value per line:

All values in an enum must adhere to the specified type. If you need to specify descriptions for enum items, you can do this in the description of the parameter or property:

A nullable enum can be defined as follows:

Note that null must be explicitly included in the list of enum values. Using nullable: true alone is not enough here.

In OpenAPI 3.0, both operation parameters and data models use a schema, making it easy to reuse the data types. You can define reusable enums in the global components section and reference them via $ref elsewhere.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /items:3    get:4      parameters:5        - in: query6          name: sort7          description: Sort order8          schema:9            type: string10            enum: [asc, desc]
```

Example 2 (yaml):
```yaml
1enum:2  - asc3  - desc
```

Example 3 (sql):
```sql
1parameters:2  - in: query3    name: sort4    schema:5      type: string6      enum: [asc, desc]7    description: >8      Sort order:9       * `asc` - Ascending, from A to Z10       * `desc` - Descending, from Z to A
```

Example 4 (yaml):
```yaml
1type: string2nullable: true  # <---3enum:4  - asc5  - desc6  - null        # <--- without quotes, i.e. null not "null"
```

---

## What is Swagger | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/what-is-swagger/

**Contents:**
- What is Swagger
  - So, I’ve got a Swagger spec for my API. Now what?

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Swagger allows you to describe the structure of your APIs so that machines can read them. The ability of APIs to describe their own structure is the root of all awesomeness in Swagger. Why is it so great? Well, by reading your API’s structure, we can automatically build beautiful and interactive API documentation. We can also automatically generate client libraries for your API in many languages and explore other possibilities like automated testing. Swagger does this by asking your API to return a YAML or JSON that contains a detailed description of your entire API. This file is essentially a resource listing of your API which adheres to OpenAPI Specification. The specification asks you to include information like:

You can write a Swagger spec for your API manually, or have it generated automatically from annotations in your source code. Check swagger.io/open-source-integrations for a list of tools that let you generate Swagger from code.

There are a few ways in which Swagger can help drive your API development further:

---

## Callbacks | Swagger Docs

**URL:** https://swagger.io/docs/specification/callbacks/

**Contents:**
- Callbacks
  - Callback Example
  - Use Runtime Expressions to Refer to Request Fields
  - Multiple Callbacks
  - Unsubscribing From Callbacks

OAS 3 This guide is for OpenAPI 3.0.

In OpenAPI 3 specs, you can define callbacks – asynchronous, out-of-band requests that your service will send to some other service in response to certain events. This helps you improve the workflow your API offers to clients. A typical example of a callback is subscription functionality – users subscribe to certain events of your service and receive a notification when this or that event occurs. For example, an e-shop can send a notification to the manager on each purchase. These notifications will be “out-of-band”, that is, they will go through a connection other than the connection through which a visitor works, and they will be asynchronous, as they will be out of the regular request-response flow. In OpenAPI 3, you can define the format of the “subscription” operation as well as the format of callback messages and expected responses to these messages. This description will simplify communication between different servers and will help you standardize the use of webhooks in your API.

Let’s create a callback definition – a simple webhook notification. Suppose, your API provides a POST /subscribe operation that expects a callback URL in the request body:

The API acknowledges the subscription —

— and later sends notifications on certain events:

Let’s now define the /subscribe operation:

Now let’s add the callbacks keyword to this operation to define a callback:

Let’s walk through this definition line by line:

This does not mean that the API will send callbacks only when this operation is working. Your API will send callback requests when the business logic of your service requires. The hierarchy of keywords simply lets you use parameters of the /subscribe operation to configure the callback requests (see below).

This expression tells that the callback URL will be based on the parameters of the /subscribe operation. We will tell more about these expressions a bit later.

Please note that when you define a callback, you define a specification of your API. The actual implementation of the callback functionality is done in the server code.

As you can see, we use the {$request.body#/callbackUrl} expression in our example. It is a runtime expression that sets which data of the POST /subscribe request will be used in callbacks. Runtime means that unlike API endpoints, this URL is not known beforehand and is evaluated at run time based on the data supplied by API clients. This value varies from one client to another. For example, the POST /subscribe request can look as follows:

You can use the following expressions to refer to its data:

You can combine a runtime expression with static data in callback definitions. For instance, you can define the callback URL in the following way:

You can use expressions to specify query parameters:

If the string includes both runtime expressions and static text, you should enclose the runtime expressions in curly braces. If the whole string is a runtime expression, you can skip the curly braces.

As we have said above, you can use one “subscription” operation to define multiple callbacks:

The way you implement the unsubscription mechanism is up to you. For example, the receiving server can return specific code in response to the callback message to indicate that it is no longer interested in callbacks. In this case, clients can unsubscribe only in response to a callback request. To allow clients to unsubscribe at any time, your API can provide a special “unsubscribe” operation. This is a rather common approach. In this case, your service can generate an ID or token for each subscriber and return this ID or token in a response to the “subscription” request. To unsubscribe, a client can pass this ID to the “unsubscribe” operation to specify the subscriber to be removed. The following example demonstrates how you can define this behavior in your spec:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1POST /subscribe2Host: my.example.com3Content-Type: application/json4
5{6  "callbackUrl": "https://myserver.com/send/callback/here"7}
```

Example 2 (unknown):
```unknown
1HTTP/1.1 201 Created
```

Example 3 (json):
```json
1POST /send/callback/here2Host: myserver.com3Content-Type: application/json4
5{6  "message": "Something happened"7}
```

Example 4 (json):
```json
1openapi: 3.0.42info:3  version: 0.0.04  title: test5
6paths:7  /subscribe:8    post:9      summary: Subscribe to a webhook10      requestBody:11        required: true12        content:13          application/json:14            schema:15              type: object16              properties:17                callbackUrl: # Callback URL18                  type: string19                  format: uri20                  example: https://myserver.com/send/callback/here21              required:22                - callbackUrl23      responses:24        "201":25          description: Webhook created
```

---

## Basic Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/basic-authentication/

**Contents:**
- Basic Authentication
  - Describing Basic Authentication
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Basic authentication is a simple authentication scheme built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the word Basic followed by a space and a base64-encoded string username:password. For example, to authorize as demo / p@55w0rd the client would send

Note: Because base64 is easily decoded, Basic authentication should only be used together with other security mechanisms such as HTTPS/SSL.

Using OpenAPI 3.0, you can describe Basic authentication as follows:

The first section, securitySchemes, defines a security scheme named basicAuth (an arbitrary name). This scheme must have type: http and scheme: basic. The security section then applies Basic authentication to the entire API. The square brackets [] denote the security scopes used; the list is empty because Basic authentication does not use scopes. security can be set globally (as in the example above) or on the operation level. The latter is useful if only a subset of operations require Basic authentication:

Basic authentication can also be combined with other authentication methods as explained in Using Multiple Authentication Types.

You can also define the 401 “Unauthorized” response returned for requests with missing or incorrect credentials. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global components/responses section and referenced elsewhere via $ref.

To learn more about the responses syntax, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1Authorization: Basic ZGVtbzpwQDU1dzByZA==
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3components:4  securitySchemes:5    basicAuth: # <-- arbitrary name for the security scheme6      type: http7      scheme: basic8
9security:10  - basicAuth: [] # <-- use the same name here
```

Example 3 (yaml):
```yaml
1paths:2  /something:3    get:4      security:5        - basicAuth: []
```

Example 4 (lua):
```lua
1paths:2  /something:3    get:4      ...5      responses:6        ...7        '401':8            $ref: '#/components/responses/UnauthorizedError'9    post:10      ...11      responses:12        ...13        '401':14          $ref: '#/components/responses/UnauthorizedError'15...16components:17  responses:18    UnauthorizedError:19      description: Authentication information is missing or invalid20      headers:21        WWW_Authenticate:22          schema:23            type: string
```

---

## Describing Request Body | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/describing-request-body/describing-request-body

**Contents:**
- Describing Request Body
  - Differences From OpenAPI 2.0
  - requestBody, content and Media Types
  - anyOf, oneOf
  - File Upload
  - Request Body Examples
  - Reusable Bodies
  - Form Data
    - Complex Serialization in Form Data
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Request bodies are typically used with “create” and “update” operations (POST, PUT, PATCH). For example, when creating a resource using POST or PUT, the request body usually contains the representation of the resource to be created. OpenAPI 3.0 provides the requestBody keyword to describe request bodies.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Unlike OpenAPI 2.0, where the request body was defined using body and formData parameters, OpenAPI 3.0 uses the requestBody keyword to distinguish the payload from parameters (such as query string). The requestBody is more flexible in that it lets you consume different media types, such as JSON, XML, form data, plain text, and others, and use different schemas for different media types. requestBody consists of the content object, an optional Markdown-formatted description, and an optional required flag (false by default). content lists the media types consumed by the operation (such as application/json) and specifies the schema for each media type. Request bodies are optional by default. To mark the body as required, use required: true.

content allows wildcard media types. For example, image/* represents all image types; */* represents all types and is functionally equivalent to application/octet-stream. Specific media types have preference over wildcard media types when interpreting the spec, for example, image/png > image/* > */*.

OpenAPI 3.0 supports anyOf and oneOf, so you can specify alternate schemas for the request body:

To learn how to describe file upload, see File Upload and Multipart Requests.

The request body can have an example or multiple examples. example and examples are properties of the requestBody.content.<media-type> object. If provided, these examples override the examples provided by the schema. This is handy, for example, if the request and response use the same schema but you want to have different examples. example allows a single inline example:

The examples (plural) are more flexible – you can have an inline example, a $ref reference, or point to an external URL containing the payload example. Each example can also have optional summary and description for documentation purposes.

See Adding Examples for more information.

You can put the request body definitions in the global components.requestBodies section and $ref them elsewhere. This is handy if multiple operations have the same request body – this way you can reuse the same definition easily.

The term “form data” is used for the media types application/x-www-form-urlencoded and multipart/form-data, which are commonly used to submit HTML forms.

To illustrate form data, consider an HTML POST form:

This form POSTs data to the form’s endpoint:

In OpenAPI 3.0, form data is modelled using a type: object schema where the object properties represent the form fields:

Form fields can contain primitives values, arrays and objects. By default, arrays are serialized as array_name=value1&array_name=value2 and objects as prop1=value1&prop=value2, but you can use other serialization strategies as defined by the OpenAPI 3.0 Specification. The serialization strategy is specified in the encoding section like so:

By default, reserved characters :/?#[]@!$&'()*+,;= in form field values within application/x-www-form-urlencoded bodies are percent-encoded when sent. To allow these characters to be sent as is, use the allowReserved keyword like so:

Arbitrary key=value pairs can be modelled using a free-form schema:

The serialization rules provided by the style and explode keywords only have defined behavior for arrays of primitives and objects with primitive properties. For more complex scenarios, such as nested arrays or JSON in form data, you need to use the contentType keyword to specify the media type for encoding the value of a complex field. Consider Slack incoming webhooks for an example. A message can be sent directly as JSON, or the JSON data can be sent inside a form field named payload like so (before URL-encoding is applied):

This can be described as:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    post:4      summary: Add a new pet5
6      requestBody:7        description: Optional description in *Markdown*8        required: true9        content:10          application/json:11            schema:12              $ref: "#/components/schemas/Pet"13          application/xml:14            schema:15              $ref: "#/components/schemas/Pet"16          application/x-www-form-urlencoded:17            schema:18              $ref: "#/components/schemas/PetForm"19          text/plain:20            schema:21              type: string22
23      responses:24        "201":25          description: Created
```

Example 2 (yaml):
```yaml
1paths:2  /avatar:3    put:4      summary: Upload an avatar5      requestBody:6        content:7          image/*: # Can be image/png, image/svg, image/gif, etc.8            schema:9              type: string10              format: binary
```

Example 3 (scala):
```scala
1requestBody:2  description: A JSON object containing pet information3  content:4    application/json:5      schema:6        oneOf:7          - $ref: "#/components/schemas/Cat"8          - $ref: "#/components/schemas/Dog"9          - $ref: "#/components/schemas/Hamster"
```

Example 4 (scss):
```scss
1requestBody:2  content:3    application/json:4      schema:5        $ref: "#/components/schemas/Pet"6      example:7        name: Fluffy8        petType: dog
```

---

## Data Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/data-types/

**Contents:**
- Data Types
  - Mixed Types
  - Numbers
    - Minimum and Maximum
    - Multiples
  - Strings
    - String Formats
    - pattern
  - Boolean
  - Null

OAS 3 This guide is for OpenAPI 3.0.

The data type of a schema is defined by the type keyword, for example, type: string. OpenAPI defines the following basic types:

These types exist in most programming languages, though they may go by different names. Using these types, you can describe any data structures.

Note that there is no null type; instead, the nullable attribute is used as a modifier of the base type.

Additional type-specific keywords can be used to refine the data type, for example, limit the string length or specify an enum of possible values.

type takes a single value. type as a list is not valid in OpenAPI (even though it is valid in JSON Schema):

Mixed types can be described using oneOf and anyOf, which specify a list of alternate types:

OpenAPI has two numeric types, number and integer, where number includes both integer and floating-point numbers. An optional format keyword serves as a hint for the tools to use a specific numeric type:

Note that strings containing numbers, such as “17”, are considered strings and not numbers.

Use the minimum and maximum keywords to specify the range of possible values:

By default, the minimum and maximum values are included in the range, that is:

To exclude the boundary values, specify exclusiveMinimum: true and exclusiveMaximum: true. For example, you can define a floating-point number range as 0–50 and exclude the 0 value:

The word “exclusive” in exclusiveMinimum and exclusiveMaximum means the corresponding boundary is excluded:

Use the multipleOf keyword to specify that a number must be the multiple of another number:

The example above matches 10, 20, 30, 0, -10, -20, and so on. multipleOf may be used with floating-point numbers, but in practice this can be unreliable due to the limited precision or floating point math.

The value of multipleOf must be a positive number, that is, you cannot use multipleOf: -5.

A string of text is defined as:

String length can be restricted using minLength and maxLength:

Note that an empty string "" is a valid string unless minLength or pattern is specified.

An optional format modifier serves as a hint at the contents and format of the string. OpenAPI defines the following built-in string formats:

However, format is an open value, so you can use any formats, even not those defined by the OpenAPI Specification, such as:

Tools can use the format to validate the input or to map the value to a specific type in the chosen programming language. Tools that do not support a specific format may default back to the type alone, as if the format is not specified.

The pattern keyword lets you define a regular expression template for the string value. Only the values that match this template will be accepted. The regular expression syntax used is from JavaScript (more specifically, ECMA 262). Regular expressions are case-sensitive, that is, [a-z] and [A-Z] are different expressions. For example, the following pattern matches a Social Security Number (SSN) in the 123-45-6789 format:

Note that the regular expression is enclosed in the ^…$ tokens, where ^ means the beginning of the string, and $ means the end of the string. Without ^…$, pattern works as a partial match, that is, matches any string that contains the specified regular expression. For example, pattern: pet matches pet, petstore and carpet. The ^…$ token forces an exact match.

type: boolean represents two values: true and false. Note that truthy and falsy values such as “true”, "", 0 or null are not considered boolean values.

OpenAPI 3.0 does not have an explicit null type as in JSON Schema, but you can use nullable: true to specify that the value may be null. Note that null is different from an empty string "".

The example above may be mapped to the nullable types int? in C# and java.lang.Integer in Java. In objects, a nullable property is not the same as an optional property, but some tools may choose to map an optional property to the null value.

Arrays are defined as:

Unlike JSON Schema, the items keyword is required in arrays. The value of items is a schema that describes the type and format of array items. Arrays can be nested:

Item schema can be specified inline (as in the previous examples), or referenced via $ref:

Mixed-type arrays can be defined using oneOf:

oneOf allows both inline subschemas (as in the example above) and references:

An array of arbitrary types can be defined as:

Here, {} is the “any-type” schema (see below). Note that the following syntax for items is not valid:

You can define the minimum and maximum length of an array like so:

Without minItems, an empty array is considered valid.

You can use uniqueItems: true to specify that all items in the array must be unique:

An object is a collection of property/value pairs. The properties keyword is used to define the object properties – you need to list the property names and specify a schema for each property.

Tip: In OpenAPI, objects are usually defined in the global components/schemas section rather than inline in the request and response definitions.

By default, all object properties are optional. You can specify the required properties in the required list:

Note that required is an object-level attribute, not a property attribute:

An empty list required: [] is not valid. If all properties are optional, do not specify the required keyword.

You can use the readOnly and writeOnly keywords to mark specific properties as read-only or write-only. This is useful, for example, when GET returns more properties than used in POST – you can use the same schema in both GET and POST and mark the extra properties as readOnly. readOnly properties are included in responses but not in requests, and writeOnly properties may be sent in requests but not in responses.

If a readOnly or writeOnly property is included in the required list, required affects just the relevant scope – responses only or requests only. That is, read-only required properties apply to responses only, and write-only required properties – to requests only.

An object can include nested objects:

You may want to split nested objects into multiple schemas and use $ref to reference the nested schemas:

A free-form object (arbitrary property/value pairs) is defined as:

This is equivalent to

The minProperties and maxProperties keywords let you restrict the number of properties allowed in an object. This can be useful when using additionalProperties or free-form objects.

In this example, {"id": 5, "username": "trillian"} matches the schema, but {"id": 5} does not.

Unlike OpenAPI 2.0, Open API 3.0 does not have the file type. Files are defined as strings:

depending on the desired file transfer method. For more information, see File Upload, Multipart Requests and Response That Returns a File.

A schema without a type matches any data type – numbers, strings, objects, and so on. {} is shorthand syntax for an arbitrary-type schema:

If you want to provide a description:

The above is equivalent to:

If the null value needs to be allowed, add nullable: true:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1# Incorrect2type:3  - string4  - integer
```

Example 2 (json):
```json
1# Correct2oneOf:3  - type: string4  - type: integer
```

Example 3 (yaml):
```yaml
1type: integer2minimum: 13maximum: 20
```

Example 4 (unknown):
```unknown
1minimum ≤ value ≤ maximum
```

---

## Describing Responses | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/describing-responses/

**Contents:**
- Describing Responses
  - Response Media Types
  - HTTP Status Codes
  - Response Body
  - Response That Returns a File
  - anyOf, oneOf
  - Empty Response Body
  - Response Headers
  - Default Response
  - Reusing Responses

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

An API specification needs to specify the responses for all API operations. Each operation must have at least one response defined, usually a successful response. A response is defined by its HTTP status code and the data returned in the response body and/or headers. Here is a minimal example:

An API can respond with various media types. JSON is the most common format for data exchange, but not the only one possible. To specify the response media types, use the content keyword at the operation level.

More info: Media Types.

Under responses, each response definition starts with a status code, such as 200 or 404. An operation typically returns one successful status code and one or more error statuses. To define a range of response codes, you may use the following range definitions: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response range is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code. Each response status requires a description. For example, you can describe the conditions for error responses. Markdown (CommonMark) can be used for rich text representation.

Note that an API specification does not necessarily need to cover all possible HTTP response codes, since they may not be known in advance. However, it is expected to cover successful responses and any known errors. By “known errors” we mean, for example, a 404 Not Found response for an operation that returns a resource by ID, or a 400 Bad Request response in case of invalid operation parameters.

The schema keyword is used to describe the response body. A schema can define:

Schema can be defined inline in the operation:

or defined in the global components.schemas section and referenced via $ref. This is useful if multiple media types use the same schema.

An API operation can return a file, such as an image or PDF. OpenAPI 3.0 defines file input/output content as type: string with format: binary or format: base64. This is in contrast with OpenAPI 2.0, which uses type: file to describe file input/output content. If the response returns the file alone, you would typically use a binary string schema and specify the appropriate media type for the response content:

Files can also be embedded into, say, JSON or XML as a base64-encoded string. In this case, you would use something like:

OpenAPI 3.0 also supports oneOf and anyOf, so you can specify alternate schemas for the response body.

Some responses, such as 204 No Content, have no body. To indicate the response body is empty, do not specify a content for the response:

Responses from an API can include custom headers to provide additional information on the result of an API call. For example, a rate-limited API may provide the rate limit status via response headers as follows:

You can define custom headers for each response as follows:

Note that, currently, OpenAPI Specification does not permit to define common response headers for different response codes or different API operations. You need to define the headers for each response individually.

Sometimes, an operation can return multiple errors with different HTTP status codes, but all of them have the same response structure:

You can use the default response to describe these errors collectively, not individually. “Default” means this response is used for all HTTP codes that are not covered individually for this operation.

If multiple operations return the same response (status code and data), you can define it in the responses section of the global components object and then reference that definition via $ref at the operation level. This is useful for error responses with the same status codes and response body.

Note that responses defined in components.responses are not automatically applied to all operations. These are just definitions that can be referenced and reused by multiple operations.

Certain values in the response could be used as parameters to other operations. A typical example is the “create resource” operation that returns the ID of the created resource, and this ID can be used to get that resource, update or delete it. OpenAPI 3.0 provides the links keyword to describe such relationships between a response and other API calls. For more information, see Links.

Can I have different responses based on a request parameter? Such as:

In OpenAPI 3.0, you can use oneOf to specify alternate schemas for the response and document possible dependencies verbally in the response description. However, there is no way to link specific schemas to certain parameter combinations.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /ping:3    get:4      responses:5        "200":6          description: OK7          content:8            text/plain:9              schema:10                type: string11                example: pong
```

Example 2 (scss):
```scss
1paths:2  /users:3    get:4      summary: Get all users5      responses:6        "200":7          description: A list of users8          content:9            application/json:10              schema:11                $ref: "#/components/schemas/ArrayOfUsers"12            application/xml:13              schema:14                $ref: "#/components/schemas/ArrayOfUsers"15            text/plain:16              schema:17                type: string18
19  # This operation returns image20  /logo:21    get:22      summary: Get the logo image23      responses:24        "200":25          description: Logo image in PNG format26          content:27            image/png:28              schema:29                type: string30                format: binary
```

Example 3 (json):
```json
1responses:2  "200":3    description: OK4  "400":5    description: Bad request. User ID must be an integer and larger than 0.6  "401":7    description: Authorization information is missing or invalid.8  "404":9    description: A user with the specified ID was not found.10  "5XX":11    description: Unexpected error.
```

Example 4 (json):
```json
1responses:2  "200":3    description: A User object4    content:5      application/json:6        schema:7          type: object8          properties:9            id:10              type: integer11              description: The user ID.12            username:13              type: string14              description: The user name.
```

---

## File Upload | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/describing-request-body/file-upload/

**Contents:**
- File Upload
  - Upload via Multipart Requests
  - Multiple File Upload
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

In OpenAPI 3.0, you can describe files uploaded directly with the request content and files uploaded with multipart requests. Use the requestBody keyword to describe the request payload containing a file. Under content, specify the request media type (such as image/png or application/octet-stream). Files use a type: string schema with format: binary or format: base64, depending on how the file contents will be encoded. For example:

This definition corresponds to an HTTP request that looks as follows:

To describe a file sent with other data, use the multipart media type. For example:

The corresponding HTTP request payload will include multiple parts:

Use the multipart media type to define uploading an arbitrary number of files (an array of files):

The corresponding HTTP request will look as follows:

For more information about file upload in OpenAPI, see the following sections of the OpenAPI 3.0 Specification:

Considerations for File Uploads

Special Considerations for multipart Content

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1requestBody:2  content:3    image/png:4      schema:5        type: string6        format: binary
```

Example 2 (json):
```json
1POST /upload2Host: example.com3Content-Length: 8084Content-Type: image/png5
6[file content goes there]
```

Example 3 (yaml):
```yaml
1requestBody:2  content:3    multipart/form-data:4      schema:5        type: object6        properties:7          orderId:8            type: integer9          userId:10            type: integer11          fileName:12            type: string13            format: binary
```

Example 4 (sass):
```sass
1POST /upload2Host: example.com3Content-Length: 27404Content-Type: multipart/form-data; boundary=abcde123455
6--abcde123457Content-Disposition: form-data; name="orderId"8
9119510--abcde1234511Content-Disposition: form-data; name="userId"12
1354514--abcde1234515Content-Disposition: form-data; name="fileName"; filename="attachment.txt"16Content-Type: text/plain17
18[file content goes there]19--abcde12345--
```

---

## Dictionaries, HashMaps and Associative Arrays | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/dictionaries/

**Contents:**
- Dictionaries, HashMaps and Associative Arrays
  - Value Type
  - Free-Form Objects
  - Fixed Keys
  - Examples of Dictionary Contents

OAS 3 This guide is for OpenAPI 3.0.

A dictionary (also known as a map, hashmap or associative array) is a set of key/value pairs. OpenAPI lets you define dictionaries where the keys are strings. To define a dictionary, use type: object and use the additionalProperties keyword to specify the type of values in key/value pairs. For example, a string-to-string dictionary like this:

is defined using the following schema:

The additionalProperties keyword specifies the type of values in the dictionary. Values can be primitives (strings, numbers or boolean values), arrays or objects. For example, a string-to-object dictionary can be defined as follows:

Instead of using an inline schema, additionalProperties can $ref another schema:

If the dictionary values can be of any type (aka free-form object), use additionalProperties: true:

This is equivalent to:

If a dictionary has some fixed keys, you can define them explicitly as object properties and mark them as required:

You can use the example keyword to specify sample dictionary contents:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1{ "en": "English", "fr": "French" }
```

Example 2 (yaml):
```yaml
1type: object2additionalProperties:3  type: string
```

Example 3 (yaml):
```yaml
1type: object2additionalProperties:3  type: object4  properties:5    code:6      type: integer7    text:8      type: string
```

Example 4 (scss):
```scss
1components:2  schemas:3    Messages: # <---- dictionary4      type: object5      additionalProperties:6        $ref: "#/components/schemas/Message"7
8    Message:9      type: object10      properties:11        code:12          type: integer13        text:14          type: string
```

---

## Describing Responses | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/describing-responses/

**Contents:**
- Describing Responses
  - Response Media Types
  - HTTP Status Codes
  - Response Body
  - Response That Returns a File
  - Empty Response Body
  - Response Headers
  - Default Response
  - Reusing Responses
  - FAQ

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

An API specification needs to specify the responses for all API operations. Each operation must have at least one response defined, usually a successful response. A response is defined by its HTTP status code and the data returned in the response body and/or headers. Here is a minimal example:

An API can respond with various media types. JSON is the most common format for data exchange, but not the only one possible. To specify the response media types, use the produces keyword on the root level or operation level. The global list can be overridden on the operation level.

More info: MIME Types.

Under responses, each response definition starts with a status code, such as 200 or 404. An operation typically returns one successful status code and one or more error statuses. Each response status requires a description. For example, you can describe the conditions for error responses. GitHub Flavored Markdown can be used for rich text representation.

Note that an API specification does not necessarily need to cover all possible HTTP response codes, since they may not be known in advance. However, it is expected to cover successful responses and any known errors. By “known errors” we mean, for example, a 404 Not Found response for an operation that returns a resource by ID, or a 400 Bad Request response in case of invalid operation parameters.

The schema keyword is used to describe the response body. A schema can define:

Schema can be defined inline in the operation:

or defined at the root level and referenced via $ref. This is useful if multiple responses use the same schema.

An API operation can return a file, such as an image or PDF. In this case, define the response schema with type: file and specify the appropriate MIME types in the produces section.

Some responses, such as 204 No Content, have no body. To indicate the response body is empty, do not specify a schema for the response. Swagger treats no schema as a response without a body.

Responses from an API can include custom headers to provide additional information on the result of an API call. For example, a rate-limited API may provide the rate limit status via response headers as follows:

You can define custom headers for each response as follows:

Note that, currently, there is no way in Swagger to define common response headers for different response codes or different API operations. You need to define the headers for each response individually.

Sometimes, an operation can return multiple errors with different HTTP status codes, but all of them have the same response structure:

You can use the default response to describe these errors collectively, not individually. “Default” means this response is used for all HTTP codes that are not covered individually for this operation.

If multiple operations return the same response (status code and data), you can define it in the global responses section and reference that definition via $ref at the operation level. This is useful for error responses with the same status codes and response body.

Note that responses defined at the root level are not automatically applied to all operations. These are just definitions that can be referenced and reused by multiple operations.

Can I have different responses based on a request parameter? Such as:

No, this is not supported.

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#responsesDefinitionsObject

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#responsesObject

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#responseObject

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /ping:3    get:4      produces:5        - application/json6      responses:7        200:8          description: OK
```

Example 2 (yaml):
```yaml
1produces:2  - application/json3
4paths:5  # This operation returns JSON - as defined globally above6  /users:7    get:8      summary: Gets a list of users.9      responses:10        200:11          description: OK12  # Here, we override the "produces" array to specify other media types13  /logo:14    get:15      summary: Gets the logo image.16      produces:17        - image/png18        - image/gif19        - image/jpeg20      responses:21        200:22          description: OK
```

Example 3 (yaml):
```yaml
1responses:2  200:3    description: OK4  400:5    description: Bad request. User ID must be an integer and bigger than 0.6  401:7    description: Authorization information is missing or invalid.8  404:9    description: A user with the specified ID was not found.
```

Example 4 (yaml):
```yaml
1responses:2  200:3    description: A User object4    schema:5      type: object6      properties:7        id:8          type: integer9          description: The user ID.10        username:11          type: string12          description: The user name.
```

---

## Media Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/media-types/

**Contents:**
- Media Types
  - Media Type Names
  - Multiple Media Types

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

Media type is a format of a request or response body data. Web service operations can accept and return data in different formats, the most common being JSON, XML and images. You specify the media type in request and response definitions. Here is an example of a response definition:

Under responses we have definitions of individual responses. As you can see, each response is defined by its code ('200' in our example.). The keyword content below the code corresponds to the response body. One or multiple media types go as child keywords of this content keyword. Each media type includes a schema, defining the data type of the message body, and, optionally, one or several examples. For more information on defining body data, see Defining Request Body and Defining Responses.

The media types listed below the content field should be compliant with RFC 6838. For example, you can use standard types or vendor-specific types (indicated by .vnd) –

You may want to specify multiple media types:

To use the same data format for several media types, define a custom object in the components section of your spec and then refer to this object in each media type:

To define the same format for multiple media types, you can also use placeholders like */*, application/*, image/* or others:

The value you use as media type – image/* in our example – is very similar to what you can see in the Accept or Content-Type headers of HTTP requests and responses. Do not confuse the placeholder and the actual value of the Accept or Content-Type headers. For example, the image/* placeholder for a response body means that the server will use the same data structure for all the responses that match the placeholder. It does not mean that the string image/* will be specified in the Content-Type header. The Content-Type header most likely will have image/png, image/jpeg, or some other similar value.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # Media type10              schema: # Must-have11                type: object # Data type12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19                example: # Sample data20                  id: 121                  name: Jessica Right22                  fullTime: true
```

Example 2 (sass):
```sass
1application/json2application/xml3application/x-www-form-urlencoded4multipart/form-data5text/plain; charset=utf-86text/html7application/pdf8image/png
```

Example 3 (sass):
```sass
1application/vnd.mycompany.myapp.v2+json2application/vnd.ms-excel3application/vnd.openstreetmap.data+xml4application/vnd.github-issue.text+json5application/vnd.github.v3.diff6image/vnd.djvu
```

Example 4 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # One of media types10              schema:11                type: object12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19            application/xml: # Another media types20              schema:21                type: object22                properties:23                  id:24                    type: integer25                  name:26                    type: string27                  fullTime:28                    type: boolean
```

---

## Data Models (Schemas) | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/data-models/

**Contents:**
- Data Models (Schemas)

OAS 3 This guide is for OpenAPI 3.0.

OpenAPI 3.0 data types are based on an extended subset JSON Schema Specification Wright Draft 00 (aka Draft 5). The data types are described using a Schema object. To learn how to model various data types, see the following topics:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

---

## OpenAPI Extensions | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/openapi-extensions/

**Contents:**
- OpenAPI Extensions
- Adding Extensions
  - Example

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Extensions (also referred to as specification extensions or vendor extensions) are custom properties that start with x-, such as x-logo. These are used to add extra information or functionality that the OpenAPI standard doesn’t include by default. For example, many tools including Amazon API Gateway, ReDoc, APIMatic, and Fern use extensions to include details specific to their products.

Extensions are supported on the root level of the API spec and in the following places:

The extension value can be a primitive, an array, an object or null. If the value is an object or array of objects, the object’s property names do not need to start with x-.

An API that uses Amazon API Gateway custom authorizer might include extensions similar to this:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  securitySchemes:3    APIGatewayAuthorizer:4      type: apiKey5      name: Authorization6      in: header7      x-amazon-apigateway-authtype: oauth28      x-amazon-apigateway-authorizer:9        type: token10        authorizerUri: arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:account-id:function:function-name/invocations11        authorizerCredentials: arn:aws:iam::account-id:role12        identityValidationExpression: "^x-[a-z]+"13        authorizerResultTtlInSeconds: 60
```

---

## Representing XML | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/representing-xml/

**Contents:**
- Representing XML
  - Change Element Names
  - Convert Property to an Attribute
  - Prefixes and Namespaces
  - Wrapping Arrays
  - Reference

OAS 3 This guide is for OpenAPI 3.0.

In your API specification, you can describe data in both XML and JSON formats as they are easily interchangeable. For example, the following declaration —

— is represented in the following way in JSON and XML:

As you can see, in XML representation, the object name serves as a parent element and properties are translated to child elements. The OpenAPI 3 format offers a special xml object to help you fine-tune representation of XML data. You can use this object to transform some properties to attributes rather than elements, to change element names, to add namespaces and to control transformations of array items.

By default, XML elements get the same names that fields in the API declaration have. To change the default behavior, add the xml/name field to your spec:

For arrays, the xml/name property works only if another property – xml/wrapped – is set to true. See below.

As we said above, by default, properties are transformed to child elements of the parent “object” element. To make some property an attribute in the resulting XML data, use the xml/attribute:

This works only for properties. Using xml/attribute for objects is meaningless.

To avoid element name conflicts, you can specify namespace and prefix for elements. The namespace value must be an absolute URI:

Namespace prefixes will be ignored for JSON:

The example below shows how you can add namespaces and prefixes:

If needed, you can specify only prefix (This works in case the namespace is defined in some parent element). You can also specify prefixes for attributes.

Arrays are translated as a sequence of elements of the same name:

If needed, you can add a wrapping element by using the xml/wrapped property:

As you can see, by default, the wrapping element has the same name as item elements. Use xml/name to give different names to the wrapping element and array items (this will help you resolve possible naming issues):

Note that the xml.name property of the wrapping element (books in our example) has effect only if wrapped is true. If wrapped is false, xml.name of the wrapping element is ignored.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  schemas:3    book:4      type: object5      properties:6        id:7          type: integer8        title:9          type: string10        author:11          type: string
```

Example 2 (json):
```json
1{ "id": 0, "title": "string", "author": "string" }
```

Example 3 (typescript):
```typescript
1<book>2  <id>0</id>3  <title>string</title>4  <author>string</author>5</book>
```

Example 4 (yaml):
```yaml
1components:2  schemas:3    book:4      type: object5      properties:6        id:7          type: integer8        title:9          type: string10        author:11          type: string12      xml:13        name: "xml-book"
```

---

## Inheritance and Polymorphism | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/inheritance-and-polymorphism/

**Contents:**
- Inheritance and Polymorphism
  - Model Composition
  - Polymorphism
  - Discriminator
  - Mapping Type Names

OAS 3 This guide is for OpenAPI 3.0.

In your API, you may have model schemas that share common properties. Instead of describing these properties for each schema repeatedly, you can describe the schemas as a composition of the common property set and schema-specific properties. In OpenAPI version 3, you do this with the allOf keyword:

In the example above, the ExtendedErrorModel schema includes its own properties and properties inherited from BasicErrorModel. Note: When validating the data, servers and clients will validate the combined model against each model it consists of. It is recommended to avoid using conflicting properties (like properties that have the same names, but different data types).

In your API, you can have request and responses that can be described by several alternative schemas. In OpenAPI 3.0, to describe such a model, you can use the oneOf or anyOf keywords:

In this example, the response payload can contain either simpleObject, or complexObject.

To help API consumers detect the object type, you can add the discriminator/propertyName keyword to model definitions. This keyword points to the property that specifies the data type name:

In our example, the discriminator points to the objectType property that contains the data type name. The discriminator is used with anyOf or oneOf keywords only. It is important that all the models mentioned below anyOf or oneOf contain the property that the discriminator specifies. This means, for example, that in our code above, both simpleObject and complexObject must have the objectType property. This property is required in these schemas:

The discriminator keyword can be used by various API consumers. One possible example are code generation tools: they can use discriminator to generate program statements that typecast request data to appropriate object type based on the discriminator property value.

It is implied, that the property to which discriminator refers, contains the name of the target schema. In the example above, the objectType property should contain either simpleObject, or complexObject string. If the property values do not match the schema names, you can map the values to the names. To do this, use the discriminator/mapping keyword:

In this example, the obj1 value is mapped to the Object1 model that is defined in the same spec, obj2 – to Object2, and the value system matches the sysObject model that is located in an external file. All these objects must have the objectType property with the value "obj1", "obj2" or "system", respectively.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1components:2  schemas:3    BasicErrorModel:4      type: object5      required:6        - message7        - code8      properties:9        message:10          type: string11        code:12          type: integer13          minimum: 10014          maximum: 60015    ExtendedErrorModel:16      allOf: # Combines the BasicErrorModel and the inline model17        - $ref: "#/components/schemas/BasicErrorModel"18        - type: object19          required:20            - rootCause21          properties:22            rootCause:23              type: string
```

Example 2 (scss):
```scss
1components:2  responses:3    sampleObjectResponse:4      content:5        application/json:6          schema:7            oneOf:8              - $ref: '#/components/schemas/simpleObject'9              - $ref: '#/components/schemas/complexObject'10  …11components:12  schemas:13    simpleObject:14      …15    complexObject:16      …
```

Example 3 (scss):
```scss
1components:2  responses:3    sampleObjectResponse:4      content:5        application/json:6          schema:7            oneOf:8              - $ref: '#/components/schemas/simpleObject'9              - $ref: '#/components/schemas/complexObject'10            discriminator:11              propertyName: objectType12  …13  schemas:14    simpleObject:15      type: object16      required:17        - objectType18      properties:19        objectType:20          type: string21      …22    complexObject:23      type: object24      required:25        - objectType26      properties:27        objectType:28          type: string29      …
```

Example 4 (yaml):
```yaml
1schemas:2    simpleObject:3      type: object4      required:5        - objectType6      properties:7        objectType:8          type: string9      …10    complexObject:11      type: object12      required:13        - objectType14      properties:15        objectType:16          type: string17      …
```

---

## API General Info | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/api-general-info/

**Contents:**
- API General Info
  - Reference

OAS 3 This guide is OpenAPI 3.0.

It is considered to be a good practice to include general information about your API into the specification: version number, license notes, contact data, links to documentation, and more. We particularly recommend doing this for publicly available APIs; as this will can increase user confidence in the services, your company provides. To specify the API metadata, you use properties of the top-level info object:

The title and version properties are required, others are optional.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (elixir):
```elixir
1openapi: 3.0.42info:3  # You application title. Required.4  title: Sample Pet Store App5
6  # API version. You can use semantic versioning like 1.0.0,7  # or an arbitrary string like 0.99-beta. Required.8  version: 1.0.09
10  # API description. Arbitrary text in CommonMark or HTML.11  description: This is a sample server for a pet store.12
13  # Link to the page that describes the terms of service.14  # Must be in the URL format.15  termsOfService: http://example.com/terms/16
17  # Contact information: name, email, URL.18  contact:19    name: API Support20    email: support@example.com21    url: http://example.com/support22
23  # Name of the license and a URL to the license description.24  license:25    name: Apache 2.026    url: http://www.apache.org/licenses/LICENSE-2.0.html27
28# Link to the external documentation (if any).29# Code or documentation generation tools can use description as the text of the link.30externalDocs:31  description: Find out more32  url: http://example.com
```

---

## Paths and Operations | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/paths-and-operations/

**Contents:**
- Paths and Operations
  - Paths
  - Path Templating
  - Operations
  - Operation Parameters
  - operationId
  - Query String in Paths
  - Marking as Deprecated

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

In Swagger terms, paths are endpoints (resources) that your API exposes, such as /users or /reports/summary, and operations are the HTTP methods used to manipulate these paths, such as GET, POST or DELETE.

API paths and operations are defined in the global paths section of the API specification.

All paths are relative to basePath (see API Host and Base URL). The full request URL is constructed as scheme://host/basePath/path.

Swagger supports path templating, meaning you can use curly braces {} to mark parts of a URL as path parameters:

The API client needs to provide appropriate parameter values when making an API call, such as /users/5 or /users/12.

For each path, you define operations (HTTP methods) that can be used to access that path. Swagger 2.0 supports get, post, put, patch, delete, head, and options. A single path can support multiple operations, for example, GET /users to get a list of users and POST /users to add a new user. Swagger defines a unique operation as a combination of a path and an HTTP method. This means that two GET or two POST methods for the same path are not allowed – even if they have different parameters (parameters have no effect on uniqueness). Minimal example of an operation:

More detailed example with parameters and response schema:

Operations support some optional elements for documentation purposes:

Swagger supports operation parameters passed via path, query string, headers and request body. For details, see Describing Parameters.

Each operation may specify a unique operationId. Some code generators use this value to name the corresponding methods in code.

Query string parameters must not be included in paths. They should be defined as query parameters instead. Incorrect:

This also means that it is impossible to have multiple paths that differ only in query string, such as:

This is because Swagger considers a unique operation as a combination of a path and the HTTP method, and additional parameters do not make the operation unique. Instead, you should use unique paths such as:

You can mark specific operations as deprecated to indicate that they should be transitioned out of usage:

Tools may handle deprecated operations in a specific way. For example, Swagger UI displays them with a different style:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /ping: ...3  /users: ...4  /users/{id}: ...
```

Example 2 (unknown):
```unknown
1/users/{id}2/organizations/{orgId}/members/{memberId}3/report.{format}
```

Example 3 (yaml):
```yaml
1paths:2  /ping:3    get:4      responses:5        200:6          description: OK
```

Example 4 (scss):
```scss
1paths:2  /users/{id}:3    get:4      summary: Gets a user by ID.5      description: >6        A detailed description of the operation.7        GitHub Flavored Markdown can be used for rich text representation,8        such as **bold**, *italic* and [links](https://swagger.io).9      operationId: getUsers10      tags:11        - users12      produces:13        - application/json14        - application/xml15      parameters:16        - name: id17          in: path18          description: User ID19          type: integer20          required: true21      responses:22        200:23          description: OK24          schema:25            $ref: "#/definitions/User"26      externalDocs:27        url: http://api.example.com/docs/user-operations/28        description: Learn more about User operations provided by this API.29definitions:30  User:31    type: object32    properties:33      id:34        type: integer35      name:36        type: string37    required:38      - id39      - name
```

---

## Basic Structure | Swagger Docs

**URL:** https://swagger.io/docs/specification/basic-structure/

**Contents:**
- Basic Structure
  - Metadata
  - Servers
  - Paths

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, visit OpenAPI 2.0 pages.

You can write OpenAPI definitions in YAML or JSON. In this guide, we use only YAML examples but JSON works equally well. A sample OpenAPI 3.0 definition written in YAML looks like:

All keyword names are case-sensitive.

Every API definition must include the version of the OpenAPI Specification that this definition is based on:

The OpenAPI version defines the overall structure of an API definition – what you can document and how you document it. OpenAPI 3.0 uses semantic versioning with a three-part version number. The available versions are 3.0.0, 3.0.1, 3.0.2, 3.0.3, and 3.0.4; they are functionally the same.

The info section contains API information: title, description (optional), version:

title is your API name. description is extended information about your API. It can be multiline and supports the CommonMark dialect of Markdown for rich text representation. HTML is supported to the extent provided by CommonMark (see HTML Blocks in CommonMark 0.27 Specification). version is an arbitrary string that specifies the version of your API (do not confuse it with file revision or the openapi version). You can use semantic versioning like major.minor.patch, or an arbitrary string like 1.0-beta or 2017-07-25. info also supports other keywords for contact information, license, terms of service, and other details.

Reference: Info Object.

The servers section specifies the API server and base URL. You can define one or several servers, such as production and sandbox.

All API paths are relative to the server URL. In the example above, /users means http://api.example.com/v1/users or http://staging-api.example.com/users, depending on the server used. For more information, see API Server and Base Path.

The paths section defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints. For example, GET /users can be described as:

**Examples:**

Example 1 (json):
```json
1openapi: 3.0.42info:3  title: Sample API4  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.5  version: 0.1.96
7servers:8  - url: http://api.example.com/v19    description: Optional server description, e.g. Main (production) server10  - url: http://staging-api.example.com11    description: Optional server description, e.g. Internal staging server for testing12
13paths:14  /users:15    get:16      summary: Returns a list of users.17      description: Optional extended description in CommonMark or HTML.18      responses:19        "200": # status code20          description: A JSON array of user names21          content:22            application/json:23              schema:24                type: array25                items:26                  type: string
```

Example 2 (yaml):
```yaml
1openapi: 3.0.4
```

Example 3 (yaml):
```yaml
1info:2  title: Sample API3  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.4  version: 0.1.9
```

Example 4 (yaml):
```yaml
1servers:2  - url: http://api.example.com/v13    description: Optional server description, e.g. Main (production) server4  - url: http://staging-api.example.com5    description: Optional server description, e.g. Internal staging server for testing
```

---

## Adding Examples | Swagger Docs

**URL:** https://swagger.io/docs/specification/adding-examples/

**Contents:**
- Adding Examples
  - Parameter Examples
  - Request and Response Body Examples
  - Object and Property Examples
  - Array Example
  - Examples for XML and HTML Data
  - External Examples
  - Reusing Examples

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can add examples to parameters, properties and objects to make OpenAPI specification of your web service clearer. Examples can be read by tools and libraries that process your API in some way. For example, an API mocking tool can use sample values to generate mock requests. You can specify examples for objects, individual properties and operation parameters. To specify an example, you use the example or examples keys. See below for details.

Note for Swagger UI users: Support for multiple examples is available since Swagger UI 3.23.0 and Swagger Editor 3.6.31.

Note: Do not confuse example values with default values. An example illustrates what the value is supposed to be. A default value is what the server uses if the client does not provide the value.

Here is an example of a parameter value:

Multiple examples for a parameter:

As you can see, each example has a distinct key name. Also, in the code above, we used an optional summary keys with description. Note: the sample values you specify should match the parameter data type.

Here is an example of the example keyword in a request body:

Note that in the code above, example is a child of schema. If schema refers to some object defined in the components section, then you should make example a child of the media type keyword:

This is needed because $ref overwrites all the siblings alongside it. If needed, you can use multiple examples:

Here is an example of the example in response bodies:

Multiple examples in response bodies:

Note: The examples in response and request bodies are free-form, but are expected to be compatible with the body schema.

You can also specify examples for objects and individual properties in the components section.

Note that schemas and properties support single example but not multiple examples.

You can add an example of an individual array item:

or an array-level example containing multiple items:

If the array contains objects, you can specify a multi-item example as follows:

Note that arrays and array items support single example but not multiple examples.

To describe an example value that cannot be presented in JSON or YAML format, specify it as a string:

You can find information on writing multiline string in YAML in this Stack Overflow post: https://stackoverflow.com/questions/3790454/in-yaml-how-do-i-break-a-string-over-multiple-lines.

If a sample value cannot be inserted into your specification for some reason, for instance, it is neither YAML-, nor JSON-conformant, you can use the externalValue keyword to specify the URL of the example value. The URL should point to the resource that contains the literal example contents (an object, file or image, for example):

You can define common examples in the components/examples section of your specification and then re-use them in various parameter descriptions, request and response body descriptions, objects and properties:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1parameters:2  - in: query3    name: status4    schema:5      type: string6      enum: [approved, pending, closed, new]7      example: approved # Example of a parameter value
```

Example 2 (yaml):
```yaml
1parameters:2  - in: query3    name: limit4    schema:5      type: integer6      maximum: 507    examples: # Multiple examples8      zero: # Distinct name9        value: 0 # Example value10        summary: A sample limit value # Optional description11      max: # Distinct name12        value: 50 # Example value13        summary: A sample limit value # Optional description
```

Example 3 (json):
```json
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json:8            schema: # Request body contents9              type: object10              properties:11                id:12                  type: integer13                name:14                  type: string15              example: # Sample object16                id: 1017                name: Jessica Smith18      responses:19        "200":20          description: OK
```

Example 4 (scss):
```scss
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json: # Media type8            schema: # Request body contents9              $ref: "#/components/schemas/User" # Reference to an object10            example: # Child of media type because we use $ref above11              # Properties of a referenced object12              id: 1013              name: Jessica Smith14      responses:15        "200":16          description: OK
```

---

## Describing Responses | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-responses

**Contents:**
- Describing Responses
  - Response Media Types
  - HTTP Status Codes
  - Response Body
  - Response That Returns a File
  - anyOf, oneOf
  - Empty Response Body
  - Response Headers
  - Default Response
  - Reusing Responses

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

An API specification needs to specify the responses for all API operations. Each operation must have at least one response defined, usually a successful response. A response is defined by its HTTP status code and the data returned in the response body and/or headers. Here is a minimal example:

An API can respond with various media types. JSON is the most common format for data exchange, but not the only one possible. To specify the response media types, use the content keyword at the operation level.

More info: Media Types.

Under responses, each response definition starts with a status code, such as 200 or 404. An operation typically returns one successful status code and one or more error statuses. To define a range of response codes, you may use the following range definitions: 1XX, 2XX, 3XX, 4XX, and 5XX. If a response range is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code. Each response status requires a description. For example, you can describe the conditions for error responses. Markdown (CommonMark) can be used for rich text representation.

Note that an API specification does not necessarily need to cover all possible HTTP response codes, since they may not be known in advance. However, it is expected to cover successful responses and any known errors. By “known errors” we mean, for example, a 404 Not Found response for an operation that returns a resource by ID, or a 400 Bad Request response in case of invalid operation parameters.

The schema keyword is used to describe the response body. A schema can define:

Schema can be defined inline in the operation:

or defined in the global components.schemas section and referenced via $ref. This is useful if multiple media types use the same schema.

An API operation can return a file, such as an image or PDF. OpenAPI 3.0 defines file input/output content as type: string with format: binary or format: base64. This is in contrast with OpenAPI 2.0, which uses type: file to describe file input/output content. If the response returns the file alone, you would typically use a binary string schema and specify the appropriate media type for the response content:

Files can also be embedded into, say, JSON or XML as a base64-encoded string. In this case, you would use something like:

OpenAPI 3.0 also supports oneOf and anyOf, so you can specify alternate schemas for the response body.

Some responses, such as 204 No Content, have no body. To indicate the response body is empty, do not specify a content for the response:

Responses from an API can include custom headers to provide additional information on the result of an API call. For example, a rate-limited API may provide the rate limit status via response headers as follows:

You can define custom headers for each response as follows:

Note that, currently, OpenAPI Specification does not permit to define common response headers for different response codes or different API operations. You need to define the headers for each response individually.

Sometimes, an operation can return multiple errors with different HTTP status codes, but all of them have the same response structure:

You can use the default response to describe these errors collectively, not individually. “Default” means this response is used for all HTTP codes that are not covered individually for this operation.

If multiple operations return the same response (status code and data), you can define it in the responses section of the global components object and then reference that definition via $ref at the operation level. This is useful for error responses with the same status codes and response body.

Note that responses defined in components.responses are not automatically applied to all operations. These are just definitions that can be referenced and reused by multiple operations.

Certain values in the response could be used as parameters to other operations. A typical example is the “create resource” operation that returns the ID of the created resource, and this ID can be used to get that resource, update or delete it. OpenAPI 3.0 provides the links keyword to describe such relationships between a response and other API calls. For more information, see Links.

Can I have different responses based on a request parameter? Such as:

In OpenAPI 3.0, you can use oneOf to specify alternate schemas for the response and document possible dependencies verbally in the response description. However, there is no way to link specific schemas to certain parameter combinations.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /ping:3    get:4      responses:5        "200":6          description: OK7          content:8            text/plain:9              schema:10                type: string11                example: pong
```

Example 2 (scss):
```scss
1paths:2  /users:3    get:4      summary: Get all users5      responses:6        "200":7          description: A list of users8          content:9            application/json:10              schema:11                $ref: "#/components/schemas/ArrayOfUsers"12            application/xml:13              schema:14                $ref: "#/components/schemas/ArrayOfUsers"15            text/plain:16              schema:17                type: string18
19  # This operation returns image20  /logo:21    get:22      summary: Get the logo image23      responses:24        "200":25          description: Logo image in PNG format26          content:27            image/png:28              schema:29                type: string30                format: binary
```

Example 3 (json):
```json
1responses:2  "200":3    description: OK4  "400":5    description: Bad request. User ID must be an integer and larger than 0.6  "401":7    description: Authorization information is missing or invalid.8  "404":9    description: A user with the specified ID was not found.10  "5XX":11    description: Unexpected error.
```

Example 4 (json):
```json
1responses:2  "200":3    description: A User object4    content:5      application/json:6        schema:7          type: object8          properties:9            id:10              type: integer11              description: The user ID.12            username:13              type: string14              description: The user name.
```

---

## Describing Request Body | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-request-body/

**Contents:**
- Describing Request Body
  - Differences From OpenAPI 2.0
  - requestBody, content and Media Types
  - anyOf, oneOf
  - File Upload
  - Request Body Examples
  - Reusable Bodies
  - Form Data
    - Complex Serialization in Form Data
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Request bodies are typically used with “create” and “update” operations (POST, PUT, PATCH). For example, when creating a resource using POST or PUT, the request body usually contains the representation of the resource to be created. OpenAPI 3.0 provides the requestBody keyword to describe request bodies.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Unlike OpenAPI 2.0, where the request body was defined using body and formData parameters, OpenAPI 3.0 uses the requestBody keyword to distinguish the payload from parameters (such as query string). The requestBody is more flexible in that it lets you consume different media types, such as JSON, XML, form data, plain text, and others, and use different schemas for different media types. requestBody consists of the content object, an optional Markdown-formatted description, and an optional required flag (false by default). content lists the media types consumed by the operation (such as application/json) and specifies the schema for each media type. Request bodies are optional by default. To mark the body as required, use required: true.

content allows wildcard media types. For example, image/* represents all image types; */* represents all types and is functionally equivalent to application/octet-stream. Specific media types have preference over wildcard media types when interpreting the spec, for example, image/png > image/* > */*.

OpenAPI 3.0 supports anyOf and oneOf, so you can specify alternate schemas for the request body:

To learn how to describe file upload, see File Upload and Multipart Requests.

The request body can have an example or multiple examples. example and examples are properties of the requestBody.content.<media-type> object. If provided, these examples override the examples provided by the schema. This is handy, for example, if the request and response use the same schema but you want to have different examples. example allows a single inline example:

The examples (plural) are more flexible – you can have an inline example, a $ref reference, or point to an external URL containing the payload example. Each example can also have optional summary and description for documentation purposes.

See Adding Examples for more information.

You can put the request body definitions in the global components.requestBodies section and $ref them elsewhere. This is handy if multiple operations have the same request body – this way you can reuse the same definition easily.

The term “form data” is used for the media types application/x-www-form-urlencoded and multipart/form-data, which are commonly used to submit HTML forms.

To illustrate form data, consider an HTML POST form:

This form POSTs data to the form’s endpoint:

In OpenAPI 3.0, form data is modelled using a type: object schema where the object properties represent the form fields:

Form fields can contain primitives values, arrays and objects. By default, arrays are serialized as array_name=value1&array_name=value2 and objects as prop1=value1&prop=value2, but you can use other serialization strategies as defined by the OpenAPI 3.0 Specification. The serialization strategy is specified in the encoding section like so:

By default, reserved characters :/?#[]@!$&'()*+,;= in form field values within application/x-www-form-urlencoded bodies are percent-encoded when sent. To allow these characters to be sent as is, use the allowReserved keyword like so:

Arbitrary key=value pairs can be modelled using a free-form schema:

The serialization rules provided by the style and explode keywords only have defined behavior for arrays of primitives and objects with primitive properties. For more complex scenarios, such as nested arrays or JSON in form data, you need to use the contentType keyword to specify the media type for encoding the value of a complex field. Consider Slack incoming webhooks for an example. A message can be sent directly as JSON, or the JSON data can be sent inside a form field named payload like so (before URL-encoding is applied):

This can be described as:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    post:4      summary: Add a new pet5
6      requestBody:7        description: Optional description in *Markdown*8        required: true9        content:10          application/json:11            schema:12              $ref: "#/components/schemas/Pet"13          application/xml:14            schema:15              $ref: "#/components/schemas/Pet"16          application/x-www-form-urlencoded:17            schema:18              $ref: "#/components/schemas/PetForm"19          text/plain:20            schema:21              type: string22
23      responses:24        "201":25          description: Created
```

Example 2 (yaml):
```yaml
1paths:2  /avatar:3    put:4      summary: Upload an avatar5      requestBody:6        content:7          image/*: # Can be image/png, image/svg, image/gif, etc.8            schema:9              type: string10              format: binary
```

Example 3 (scala):
```scala
1requestBody:2  description: A JSON object containing pet information3  content:4    application/json:5      schema:6        oneOf:7          - $ref: "#/components/schemas/Cat"8          - $ref: "#/components/schemas/Dog"9          - $ref: "#/components/schemas/Hamster"
```

Example 4 (scss):
```scss
1requestBody:2  content:3    application/json:4      schema:5        $ref: "#/components/schemas/Pet"6      example:7        name: Fluffy8        petType: dog
```

---

## Describing Request Body | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/describing-request-body/

**Contents:**
- Describing Request Body
  - Object Payload (JSON, etc.)
  - Primitive Body

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

The POST, PUT and PATCH requests can have the request body (payload), such as JSON or XML data. In Swagger terms, the request body is called a body parameter. There can be only one body parameter, although the operation may have other parameters (path, query, header).

Note: The payload of the application/x-www-form-urlencoded and multipart/form-data requests is described by using form parameters, not body parameters.

The body parameter is defined in the operation’s parameters section and includes the following:

Many APIs transmit data as an object, such as JSON. schema for an object should specify type: object and properties for that object. For example, the POST /users operation with this JSON body:

Note: The name of the body parameter is ignored. It is used for documentation purposes only. For a more modular style, you can move the schema definitions to the global definitions section and refer to them by using $ref:

Want to POST/PUT just a single value? No problem, you can define the body schema type as a primitive, such as a string or number. Raw request:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1{2  "userName": "Trillian",3  "firstName": "Tricia",4  "lastName": "McMillan"5}
```

Example 2 (yaml):
```yaml
1paths:2  /users:3    post:4      summary: Creates a new user.5      consumes:6        - application/json7      parameters:8        - in: body9          name: user10          description: The user to create.11          schema:12            type: object13            required:14              - userName15            properties:16              userName:17                type: string18              firstName:19                type: string20              lastName:21                type: string22      responses:23        201:24          description: Created
```

Example 3 (scss):
```scss
1paths:2  /users:3    post:4      summary: Creates a new user.5      consumes:6        - application/json7      parameters:8        - in: body9          name: user10          description: The user to create.11          schema:12            $ref: "#/definitions/User" # <----------13      responses:14        200:15          description: OK16definitions:17  User: # <----------18    type: object19    required:20      - userName21    properties:22      userName:23        type: string24      firstName:25        type: string26      lastName:27        type: string
```

Example 4 (json):
```json
1POST /status HTTP/1.12Host: api.example.com3Content-Type: text/plain4Content-Length: 425
6Time is an illusion. Lunchtime doubly so.
```

---

## Adding Examples | Swagger Docs

**URL:** https://swagger.io/docs/specification/adding-examples

**Contents:**
- Adding Examples
  - Parameter Examples
  - Request and Response Body Examples
  - Object and Property Examples
  - Array Example
  - Examples for XML and HTML Data
  - External Examples
  - Reusing Examples

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

You can add examples to parameters, properties and objects to make OpenAPI specification of your web service clearer. Examples can be read by tools and libraries that process your API in some way. For example, an API mocking tool can use sample values to generate mock requests. You can specify examples for objects, individual properties and operation parameters. To specify an example, you use the example or examples keys. See below for details.

Note for Swagger UI users: Support for multiple examples is available since Swagger UI 3.23.0 and Swagger Editor 3.6.31.

Note: Do not confuse example values with default values. An example illustrates what the value is supposed to be. A default value is what the server uses if the client does not provide the value.

Here is an example of a parameter value:

Multiple examples for a parameter:

As you can see, each example has a distinct key name. Also, in the code above, we used an optional summary keys with description. Note: the sample values you specify should match the parameter data type.

Here is an example of the example keyword in a request body:

Note that in the code above, example is a child of schema. If schema refers to some object defined in the components section, then you should make example a child of the media type keyword:

This is needed because $ref overwrites all the siblings alongside it. If needed, you can use multiple examples:

Here is an example of the example in response bodies:

Multiple examples in response bodies:

Note: The examples in response and request bodies are free-form, but are expected to be compatible with the body schema.

You can also specify examples for objects and individual properties in the components section.

Note that schemas and properties support single example but not multiple examples.

You can add an example of an individual array item:

or an array-level example containing multiple items:

If the array contains objects, you can specify a multi-item example as follows:

Note that arrays and array items support single example but not multiple examples.

To describe an example value that cannot be presented in JSON or YAML format, specify it as a string:

You can find information on writing multiline string in YAML in this Stack Overflow post: https://stackoverflow.com/questions/3790454/in-yaml-how-do-i-break-a-string-over-multiple-lines.

If a sample value cannot be inserted into your specification for some reason, for instance, it is neither YAML-, nor JSON-conformant, you can use the externalValue keyword to specify the URL of the example value. The URL should point to the resource that contains the literal example contents (an object, file or image, for example):

You can define common examples in the components/examples section of your specification and then re-use them in various parameter descriptions, request and response body descriptions, objects and properties:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1parameters:2  - in: query3    name: status4    schema:5      type: string6      enum: [approved, pending, closed, new]7      example: approved # Example of a parameter value
```

Example 2 (yaml):
```yaml
1parameters:2  - in: query3    name: limit4    schema:5      type: integer6      maximum: 507    examples: # Multiple examples8      zero: # Distinct name9        value: 0 # Example value10        summary: A sample limit value # Optional description11      max: # Distinct name12        value: 50 # Example value13        summary: A sample limit value # Optional description
```

Example 3 (json):
```json
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json:8            schema: # Request body contents9              type: object10              properties:11                id:12                  type: integer13                name:14                  type: string15              example: # Sample object16                id: 1017                name: Jessica Smith18      responses:19        "200":20          description: OK
```

Example 4 (scss):
```scss
1paths:2  /users:3    post:4      summary: Adds a new user5      requestBody:6        content:7          application/json: # Media type8            schema: # Request body contents9              $ref: "#/components/schemas/User" # Reference to an object10            example: # Child of media type because we use $ref above11              # Properties of a referenced object12              id: 1013              name: Jessica Smith14      responses:15        "200":16          description: OK
```

---

## OpenAPI Extensions | Swagger Docs

**URL:** https://swagger.io/docs/specification/openapi-extensions/

**Contents:**
- OpenAPI Extensions
- Adding Extensions
  - Example

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Extensions (also referred to as specification extensions or vendor extensions) are custom properties that start with x-, such as x-logo. These are used to add extra information or functionality that the OpenAPI standard doesn’t include by default. For example, many tools including Amazon API Gateway, ReDoc, APIMatic, and Fern use extensions to include details specific to their products.

Extensions are supported on the root level of the API spec and in the following places:

The extension value can be a primitive, an array, an object or null. If the value is an object or array of objects, the object’s property names do not need to start with x-.

An API that uses Amazon API Gateway custom authorizer might include extensions similar to this:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  securitySchemes:3    APIGatewayAuthorizer:4      type: apiKey5      name: Authorization6      in: header7      x-amazon-apigateway-authtype: oauth28      x-amazon-apigateway-authorizer:9        type: token10        authorizerUri: arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:account-id:function:function-name/invocations11        authorizerCredentials: arn:aws:iam::account-id:role12        identityValidationExpression: "^x-[a-z]+"13        authorizerResultTtlInSeconds: 60
```

---

## Describing Parameters | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-parameters

**Contents:**
- Describing Parameters
  - Parameter Types
  - Path Parameters
  - Query Parameters
    - Reserved Characters in Query Parameters
  - Header Parameters
  - Cookie Parameters
  - Required and Optional Parameters
  - schema vs content
  - Default Parameter Values

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

In OpenAPI 3.0, parameters are defined in the parameters section of an operation or path. To describe a parameter, you specify its name, location (in), data type (defined by either schema or content) and other attributes, such as description or required. Here is an example:

Note that parameters is an array, so, in YAML, each parameter definition must be listed with a dash (-) in front of it.

OpenAPI 3.0 distinguishes between the following parameter types based on the parameter location. The location is determined by the parameter’s in key, for example, in: query or in: path.

Path parameters are variable parts of a URL path. They are typically used to point to a specific resource within a collection, such as a user identified by ID. A URL can have several path parameters, each denoted with curly braces { }.

Each path parameter must be substituted with an actual value when the client makes an API call. In OpenAPI, a path parameter is defined using in: path. The parameter name must be the same as specified in the path. Also remember to add required: true, because path parameters are always required. For example, the /users/{id} endpoint would be described as:

Path parameters containing arrays and objects can be serialized in different ways:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

Query parameters are the most common type of parameters. They appear at the end of the request URL after a question mark (?), with different name=value pairs separated by ampersands (&). Query parameters can be required and optional.

Use in: query to denote query parameters:

Note: To describe API keys passed as query parameters, use securitySchemes and security instead. See API Keys.

Query parameters can be primitive values, arrays and objects. OpenAPI 3.0 provides several ways to serialize objects and arrays in the query string.

Arrays can be serialized as:

Objects can be serialized as:

The serialization method is specified by the style and explode keywords. To learn more, see Parameter Serialization.

RFC 3986 defines a set of reserved characters :/?#[]@!$&'()*+,;= that are used as URI component delimiters. When these characters need to be used literally in a query parameter value, they are usually percent-encoded. For example, / is encoded as %2F (or %2f), so that the parameter value quotes/h2g2.txt would be sent as

If you want a query parameter that is not percent-encoded, add allowReserved: true to the parameter definition:

In this case, the parameter value would be sent like so:

An API call may require that custom headers be sent with an HTTP request. OpenAPI lets you define custom request headers as in: header parameters. For example, suppose, a call to GET /ping requires the X-Request-ID header:

Using OpenAPI 3.0, you would define this operation as follows:

In a similar way, you can define custom response headers. Header parameter can be primitives, arrays and objects. Arrays and objects are serialized using the simple style. For more information, see Parameter Serialization.

Note: Header parameters named Accept, Content-Type and Authorization are not allowed. To describe these headers, use the corresponding OpenAPI keywords:

Operations can also pass parameters in the Cookie header, as Cookie: name=value. Multiple cookie parameters are sent in the same header, separated by a semicolon and space.

Use in: cookie to define cookie parameters:

Cookie parameters can be primitive values, arrays and objects. Arrays and objects are serialized using the form style. For more information, see Parameter Serialization.

Note: To define cookie authentication, use API keys instead.

By default, OpenAPI treats all request parameters as optional. You can add required: true to mark a parameter as required. Note that path parameters must have required: true, because they are always required.

To describe the parameter contents, you can use either the schema or content keyword. They are mutually exclusive and used in different scenarios. In most cases, you would use schema. It lets you describe primitive values, as well as simple arrays and objects serialized into a string. The serialization method for array and object parameters is defined by the style and explode keywords used in that parameter.

content is used in complex serialization scenarios that are not covered by style and explode. For example, if you need to send a JSON string in the query string like so:

In this case, you need to wrap the parameter schema into content/<media-type> as shown below. The schema defines the parameter data structure, and the media type (in this example – application/json) serves as a reference to an external specification that describes the serialization format.

Note for Swagger UI and Swagger Editor users: Parameters with content are supported in Swagger UI 3.23.7+ and Swagger Editor 3.6.34+.

Use the default keyword in the parameter schema to specify the default value for an optional parameter. The default value is the one that the server uses if the client does not supply the parameter value in the request. The value type must be the same as the parameter’s data type. A typical example is paging parameters such as offset and limit:

Assuming offset defaults to 0 and limit defaults to 20 and ranges from 0 to 100, you would define these parameters as:

There are two common mistakes when using the default keyword:

You can restrict a parameter to a fixed set of values by adding the enum to the parameter’s schema. The enum values must be of the same type as the parameter data type.

More info: Defining an Enum.

You can define a constant parameter as a required parameter with only one possible value:

The enum property specifies possible values. In this example, only one value can be used, and this will be the only value available in the Swagger UI for the user to choose from.

Note: A constant parameter is not the same as the default parameter value. A constant parameter is always sent by the client, whereas the default value is something that the server uses if the parameter is not sent by the client.

Query string parameters may only have a name and no value, like so:

Use allowEmptyValue to describe such parameters:

OpenAPI 3.0 also supports nullable in schemas, allowing operation parameters to have the null value. For example, the following schema corresponds to int? in C# and java.lang.Integer in Java:

Note: nullable is not the same as an optional parameter or an empty-valued parameter. nullable means the parameter value can be null. Specific implementations may choose to map an absent or empty-valued parameter to null, but strictly speaking these are not the same thing.

You can specify an example or multiple examples for a parameter. The example value should match the parameter schema. Single example:

Multiple named examples:

For details, see Adding Examples.

Use deprecated: true to mark a parameter as deprecated.

Parameters shared by all operations of a path can be defined on the path level instead of the operation level. Path-level parameters are inherited by all operations of that path. A typical use case are the GET/PUT/PATCH/DELETE operations that manipulate a resource accessed via a path parameter.

Any extra parameters defined at the operation level are used together with path-level parameters:

Specific path-level parameters can be overridden on the operation level, but cannot be removed.

Different API paths may have common parameters, such as pagination parameters. You can define common parameters under parameters in the global components section and reference them elsewhere via $ref.

Note that the parameters defined in components are not parameters applied to all operations — they are simply global definitions that can be easily re-used.

OpenAPI 3.0 does not support parameter dependencies and mutually exclusive parameters. There is an open feature request at https://github.com/OAI/OpenAPI-Specification/issues/256. What you can do is document the restrictions in the parameter description and define the logic in the 400 Bad Request response. For example, consider the /report endpoint that accepts either a relative date range (rdate) or an exact range (start_date+end_date):

You can describe this endpoint as follows:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1paths:2  /users/{userId}:3    get:4      summary: Get a user by ID5      parameters:6        - in: path7          name: userId8          schema:9            type: integer10          required: true11          description: Numeric ID of the user to get
```

Example 2 (unknown):
```unknown
1GET /users/{id}2GET /cars/{carId}/drivers/{driverId}3GET /report.{format}
```

Example 3 (yaml):
```yaml
1paths:2  /users/{id}:3    get:4      parameters:5        - in: path6          name: id # Note the name is the same as in the path7          required: true8          schema:9            type: integer10            minimum: 111          description: The user ID
```

Example 4 (sass):
```sass
1GET /pets/findByStatus?status=available2GET /notes?offset=100&limit=50
```

---

## Inheritance and Polymorphism | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/inheritance-and-polymorphism/

**Contents:**
- Inheritance and Polymorphism
  - Model Composition
  - Polymorphism
  - Discriminator
  - Mapping Type Names

OAS 3 This guide is for OpenAPI 3.0.

In your API, you may have model schemas that share common properties. Instead of describing these properties for each schema repeatedly, you can describe the schemas as a composition of the common property set and schema-specific properties. In OpenAPI version 3, you do this with the allOf keyword:

In the example above, the ExtendedErrorModel schema includes its own properties and properties inherited from BasicErrorModel. Note: When validating the data, servers and clients will validate the combined model against each model it consists of. It is recommended to avoid using conflicting properties (like properties that have the same names, but different data types).

In your API, you can have request and responses that can be described by several alternative schemas. In OpenAPI 3.0, to describe such a model, you can use the oneOf or anyOf keywords:

In this example, the response payload can contain either simpleObject, or complexObject.

To help API consumers detect the object type, you can add the discriminator/propertyName keyword to model definitions. This keyword points to the property that specifies the data type name:

In our example, the discriminator points to the objectType property that contains the data type name. The discriminator is used with anyOf or oneOf keywords only. It is important that all the models mentioned below anyOf or oneOf contain the property that the discriminator specifies. This means, for example, that in our code above, both simpleObject and complexObject must have the objectType property. This property is required in these schemas:

The discriminator keyword can be used by various API consumers. One possible example are code generation tools: they can use discriminator to generate program statements that typecast request data to appropriate object type based on the discriminator property value.

It is implied, that the property to which discriminator refers, contains the name of the target schema. In the example above, the objectType property should contain either simpleObject, or complexObject string. If the property values do not match the schema names, you can map the values to the names. To do this, use the discriminator/mapping keyword:

In this example, the obj1 value is mapped to the Object1 model that is defined in the same spec, obj2 – to Object2, and the value system matches the sysObject model that is located in an external file. All these objects must have the objectType property with the value "obj1", "obj2" or "system", respectively.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1components:2  schemas:3    BasicErrorModel:4      type: object5      required:6        - message7        - code8      properties:9        message:10          type: string11        code:12          type: integer13          minimum: 10014          maximum: 60015    ExtendedErrorModel:16      allOf: # Combines the BasicErrorModel and the inline model17        - $ref: "#/components/schemas/BasicErrorModel"18        - type: object19          required:20            - rootCause21          properties:22            rootCause:23              type: string
```

Example 2 (scss):
```scss
1components:2  responses:3    sampleObjectResponse:4      content:5        application/json:6          schema:7            oneOf:8              - $ref: '#/components/schemas/simpleObject'9              - $ref: '#/components/schemas/complexObject'10  …11components:12  schemas:13    simpleObject:14      …15    complexObject:16      …
```

Example 3 (scss):
```scss
1components:2  responses:3    sampleObjectResponse:4      content:5        application/json:6          schema:7            oneOf:8              - $ref: '#/components/schemas/simpleObject'9              - $ref: '#/components/schemas/complexObject'10            discriminator:11              propertyName: objectType12  …13  schemas:14    simpleObject:15      type: object16      required:17        - objectType18      properties:19        objectType:20          type: string21      …22    complexObject:23      type: object24      required:25        - objectType26      properties:27        objectType:28          type: string29      …
```

Example 4 (yaml):
```yaml
1schemas:2    simpleObject:3      type: object4      required:5        - objectType6      properties:7        objectType:8          type: string9      …10    complexObject:11      type: object12      required:13        - objectType14      properties:15        objectType:16          type: string17      …
```

---

## Supported JSON Schema Keywords | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/keywords/

**Contents:**
- Supported JSON Schema Keywords
  - Supported Keywords
  - Unsupported Keywords
  - Additional Keywords
  - References

OAS 3 This guide is for OpenAPI 3.0.

OpenAPI 3.0 uses an extended subset of JSON Schema Specification Wright Draft 00 (aka Draft 5) to describe the data formats. “Extended subset” means that some keywords are supported and some are not, some keywords have slightly different usage than in JSON Schema, and additional keywords are introduced.

These keywords have the same meaning as in JSON Schema:

These keywords are supported with minor differences:

OpenAPI schemas can also use the following keywords that are not part of JSON Schema:

OpenAPI 3.0 – Schema Object

JSON Schema Validation – JSON Schema keyword reference

JSON Schema Draft Wright 00 – Core JSON Schema Specification

Did not find what you were looking for? Ask the community Found a mistake? Let us know

---

## Describing Request Body | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-request-body/describing-request-body

**Contents:**
- Describing Request Body
  - Differences From OpenAPI 2.0
  - requestBody, content and Media Types
  - anyOf, oneOf
  - File Upload
  - Request Body Examples
  - Reusable Bodies
  - Form Data
    - Complex Serialization in Form Data
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Request bodies are typically used with “create” and “update” operations (POST, PUT, PATCH). For example, when creating a resource using POST or PUT, the request body usually contains the representation of the resource to be created. OpenAPI 3.0 provides the requestBody keyword to describe request bodies.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Unlike OpenAPI 2.0, where the request body was defined using body and formData parameters, OpenAPI 3.0 uses the requestBody keyword to distinguish the payload from parameters (such as query string). The requestBody is more flexible in that it lets you consume different media types, such as JSON, XML, form data, plain text, and others, and use different schemas for different media types. requestBody consists of the content object, an optional Markdown-formatted description, and an optional required flag (false by default). content lists the media types consumed by the operation (such as application/json) and specifies the schema for each media type. Request bodies are optional by default. To mark the body as required, use required: true.

content allows wildcard media types. For example, image/* represents all image types; */* represents all types and is functionally equivalent to application/octet-stream. Specific media types have preference over wildcard media types when interpreting the spec, for example, image/png > image/* > */*.

OpenAPI 3.0 supports anyOf and oneOf, so you can specify alternate schemas for the request body:

To learn how to describe file upload, see File Upload and Multipart Requests.

The request body can have an example or multiple examples. example and examples are properties of the requestBody.content.<media-type> object. If provided, these examples override the examples provided by the schema. This is handy, for example, if the request and response use the same schema but you want to have different examples. example allows a single inline example:

The examples (plural) are more flexible – you can have an inline example, a $ref reference, or point to an external URL containing the payload example. Each example can also have optional summary and description for documentation purposes.

See Adding Examples for more information.

You can put the request body definitions in the global components.requestBodies section and $ref them elsewhere. This is handy if multiple operations have the same request body – this way you can reuse the same definition easily.

The term “form data” is used for the media types application/x-www-form-urlencoded and multipart/form-data, which are commonly used to submit HTML forms.

To illustrate form data, consider an HTML POST form:

This form POSTs data to the form’s endpoint:

In OpenAPI 3.0, form data is modelled using a type: object schema where the object properties represent the form fields:

Form fields can contain primitives values, arrays and objects. By default, arrays are serialized as array_name=value1&array_name=value2 and objects as prop1=value1&prop=value2, but you can use other serialization strategies as defined by the OpenAPI 3.0 Specification. The serialization strategy is specified in the encoding section like so:

By default, reserved characters :/?#[]@!$&'()*+,;= in form field values within application/x-www-form-urlencoded bodies are percent-encoded when sent. To allow these characters to be sent as is, use the allowReserved keyword like so:

Arbitrary key=value pairs can be modelled using a free-form schema:

The serialization rules provided by the style and explode keywords only have defined behavior for arrays of primitives and objects with primitive properties. For more complex scenarios, such as nested arrays or JSON in form data, you need to use the contentType keyword to specify the media type for encoding the value of a complex field. Consider Slack incoming webhooks for an example. A message can be sent directly as JSON, or the JSON data can be sent inside a form field named payload like so (before URL-encoding is applied):

This can be described as:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    post:4      summary: Add a new pet5
6      requestBody:7        description: Optional description in *Markdown*8        required: true9        content:10          application/json:11            schema:12              $ref: "#/components/schemas/Pet"13          application/xml:14            schema:15              $ref: "#/components/schemas/Pet"16          application/x-www-form-urlencoded:17            schema:18              $ref: "#/components/schemas/PetForm"19          text/plain:20            schema:21              type: string22
23      responses:24        "201":25          description: Created
```

Example 2 (yaml):
```yaml
1paths:2  /avatar:3    put:4      summary: Upload an avatar5      requestBody:6        content:7          image/*: # Can be image/png, image/svg, image/gif, etc.8            schema:9              type: string10              format: binary
```

Example 3 (scala):
```scala
1requestBody:2  description: A JSON object containing pet information3  content:4    application/json:5      schema:6        oneOf:7          - $ref: "#/components/schemas/Cat"8          - $ref: "#/components/schemas/Dog"9          - $ref: "#/components/schemas/Hamster"
```

Example 4 (scss):
```scss
1requestBody:2  content:3    application/json:4      schema:5        $ref: "#/components/schemas/Pet"6      example:7        name: Fluffy8        petType: dog
```

---

## API Keys | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/api-keys/

**Contents:**
- API Keys
  - Describing API Keys
  - Multiple API Keys
  - 401 Response

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Some APIs use API keys for authorization. An API key is a token that a client provides when making API calls. The key can be sent in the query string:

or as a request header:

API keys are supposed to be a secret that only the client and server know. Like Basic authentication, API key-based authentication is only considered secure if used together with other security mechanisms such as HTTPS/SSL.

In OpenAPI 3.0, API keys are described as follows:

This example defines an API key named X-API-Key sent as a request header X-API-Key: <key>. The key name ApiKeyAuth is an arbitrary name for the security scheme (not to be confused with the API key name, which is specified by the name key). The name ApiKeyAuth is used again in the security section to apply this security scheme to the API. Note: The securitySchemes section alone is not enough; you must also use security for the API key to have effect. security can also be set on the operation level instead of globally. This is useful if just a subset of the operations need the API key:

Note that it is possible to support multiple authorization types in an API. See Using Multiple Authentication Types.

Some APIs use a pair of security keys, say, API Key and App ID. To specify that the keys are used together (as in logical AND), list them in the same array item in the security array:

Note the difference from:

which means either key can be used (as in logical OR). For more examples, see Using Multiple Authentication Types.

You can define the 401 “Unauthorized” response returned for requests with missing or invalid API key. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global components/responses section and referenced elsewhere via $ref.

To learn more about describing responses, see Describing Responses.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1GET /something?api_key=abcdef12345
```

Example 2 (unknown):
```unknown
1GET /something HTTP/1.12X-API-Key: abcdef12345
```

Example 3 (sass):
```sass
1GET /something HTTP/1.12Cookie: X-API-KEY=abcdef12345
```

Example 4 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the key name and location4components:5  securitySchemes:6    ApiKeyAuth: # arbitrary name for the security scheme7      type: apiKey8      in: header # can be "header", "query" or "cookie"9      name: X-API-KEY # name of the header, query parameter or cookie10
11# 2) Apply the API key globally to all operations12security:13  - ApiKeyAuth: [] # use the same name as under securitySchemes
```

---

## Dictionaries, HashMaps and Associative Arrays | Swagger Docs

**URL:** https://swagger.io/docs/specification/data-models/dictionaries/

**Contents:**
- Dictionaries, HashMaps and Associative Arrays
  - Value Type
  - Free-Form Objects
  - Fixed Keys
  - Examples of Dictionary Contents

OAS 3 This guide is for OpenAPI 3.0.

A dictionary (also known as a map, hashmap or associative array) is a set of key/value pairs. OpenAPI lets you define dictionaries where the keys are strings. To define a dictionary, use type: object and use the additionalProperties keyword to specify the type of values in key/value pairs. For example, a string-to-string dictionary like this:

is defined using the following schema:

The additionalProperties keyword specifies the type of values in the dictionary. Values can be primitives (strings, numbers or boolean values), arrays or objects. For example, a string-to-object dictionary can be defined as follows:

Instead of using an inline schema, additionalProperties can $ref another schema:

If the dictionary values can be of any type (aka free-form object), use additionalProperties: true:

This is equivalent to:

If a dictionary has some fixed keys, you can define them explicitly as object properties and mark them as required:

You can use the example keyword to specify sample dictionary contents:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1{ "en": "English", "fr": "French" }
```

Example 2 (yaml):
```yaml
1type: object2additionalProperties:3  type: string
```

Example 3 (yaml):
```yaml
1type: object2additionalProperties:3  type: object4  properties:5    code:6      type: integer7    text:8      type: string
```

Example 4 (scss):
```scss
1components:2  schemas:3    Messages: # <---- dictionary4      type: object5      additionalProperties:6        $ref: "#/components/schemas/Message"7
8    Message:9      type: object10      properties:11        code:12          type: integer13        text:14          type: string
```

---

## Describing Request Body | Swagger Docs

**URL:** https://swagger.io/docs/specification/describing-request-body/describing-request-body/

**Contents:**
- Describing Request Body
  - Differences From OpenAPI 2.0
  - requestBody, content and Media Types
  - anyOf, oneOf
  - File Upload
  - Request Body Examples
  - Reusable Bodies
  - Form Data
    - Complex Serialization in Form Data
  - References

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

Request bodies are typically used with “create” and “update” operations (POST, PUT, PATCH). For example, when creating a resource using POST or PUT, the request body usually contains the representation of the resource to be created. OpenAPI 3.0 provides the requestBody keyword to describe request bodies.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Unlike OpenAPI 2.0, where the request body was defined using body and formData parameters, OpenAPI 3.0 uses the requestBody keyword to distinguish the payload from parameters (such as query string). The requestBody is more flexible in that it lets you consume different media types, such as JSON, XML, form data, plain text, and others, and use different schemas for different media types. requestBody consists of the content object, an optional Markdown-formatted description, and an optional required flag (false by default). content lists the media types consumed by the operation (such as application/json) and specifies the schema for each media type. Request bodies are optional by default. To mark the body as required, use required: true.

content allows wildcard media types. For example, image/* represents all image types; */* represents all types and is functionally equivalent to application/octet-stream. Specific media types have preference over wildcard media types when interpreting the spec, for example, image/png > image/* > */*.

OpenAPI 3.0 supports anyOf and oneOf, so you can specify alternate schemas for the request body:

To learn how to describe file upload, see File Upload and Multipart Requests.

The request body can have an example or multiple examples. example and examples are properties of the requestBody.content.<media-type> object. If provided, these examples override the examples provided by the schema. This is handy, for example, if the request and response use the same schema but you want to have different examples. example allows a single inline example:

The examples (plural) are more flexible – you can have an inline example, a $ref reference, or point to an external URL containing the payload example. Each example can also have optional summary and description for documentation purposes.

See Adding Examples for more information.

You can put the request body definitions in the global components.requestBodies section and $ref them elsewhere. This is handy if multiple operations have the same request body – this way you can reuse the same definition easily.

The term “form data” is used for the media types application/x-www-form-urlencoded and multipart/form-data, which are commonly used to submit HTML forms.

To illustrate form data, consider an HTML POST form:

This form POSTs data to the form’s endpoint:

In OpenAPI 3.0, form data is modelled using a type: object schema where the object properties represent the form fields:

Form fields can contain primitives values, arrays and objects. By default, arrays are serialized as array_name=value1&array_name=value2 and objects as prop1=value1&prop=value2, but you can use other serialization strategies as defined by the OpenAPI 3.0 Specification. The serialization strategy is specified in the encoding section like so:

By default, reserved characters :/?#[]@!$&'()*+,;= in form field values within application/x-www-form-urlencoded bodies are percent-encoded when sent. To allow these characters to be sent as is, use the allowReserved keyword like so:

Arbitrary key=value pairs can be modelled using a free-form schema:

The serialization rules provided by the style and explode keywords only have defined behavior for arrays of primitives and objects with primitive properties. For more complex scenarios, such as nested arrays or JSON in form data, you need to use the contentType keyword to specify the media type for encoding the value of a complex field. Consider Slack incoming webhooks for an example. A message can be sent directly as JSON, or the JSON data can be sent inside a form field named payload like so (before URL-encoding is applied):

This can be described as:

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (scss):
```scss
1paths:2  /pets:3    post:4      summary: Add a new pet5
6      requestBody:7        description: Optional description in *Markdown*8        required: true9        content:10          application/json:11            schema:12              $ref: "#/components/schemas/Pet"13          application/xml:14            schema:15              $ref: "#/components/schemas/Pet"16          application/x-www-form-urlencoded:17            schema:18              $ref: "#/components/schemas/PetForm"19          text/plain:20            schema:21              type: string22
23      responses:24        "201":25          description: Created
```

Example 2 (yaml):
```yaml
1paths:2  /avatar:3    put:4      summary: Upload an avatar5      requestBody:6        content:7          image/*: # Can be image/png, image/svg, image/gif, etc.8            schema:9              type: string10              format: binary
```

Example 3 (scala):
```scala
1requestBody:2  description: A JSON object containing pet information3  content:4    application/json:5      schema:6        oneOf:7          - $ref: "#/components/schemas/Cat"8          - $ref: "#/components/schemas/Dog"9          - $ref: "#/components/schemas/Hamster"
```

Example 4 (scss):
```scss
1requestBody:2  content:3    application/json:4      schema:5        $ref: "#/components/schemas/Pet"6      example:7        name: Fluffy8        petType: dog
```

---

## Basic Structure | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/basic-structure/

**Contents:**
- Basic Structure
  - Metadata
  - Base URL
  - Consumes, Produces
  - Paths
  - Parameters
  - Responses
  - Input and Output Models
  - Authentication

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Swagger definitions can be written in JSON or YAML. In this guide, we only use YAML examples, but JSON works equally well. A sample Swagger specification written in YAML looks like:

Every Swagger specification starts with the Swagger version, 2.0 being the latest version. A Swagger version defines the overall structure of an API specification – what you can document and how you document it.

Then, you need to specify the API info – title, description (optional), version (API version, not file revision or Swagger version).

version can be a random string. You can use major.minor.patch (as in semantic versioning), or an arbitrary format like 1.0-beta or 2016.11.15. description can be multiline and supports GitHub Flavored Markdown for rich text representation. info also supports other fields for contact information, license and other details. Reference: Info Object.

The base URL for all API calls is defined using schemes, host and basePath:

All API paths are relative to the base URL. For example, /users actually means https://api.example.com/v1/users. More info: API Host and Base URL.

The consumes and produces sections define the MIME types supported by the API. The root-level definition can be overridden in individual operations.

More info: MIME Types.

The paths section defines individual endpoints (paths) in your API, and the HTTP methods (operations) supported by these endpoints. For example, GET /users can be described as:

More info: Paths and Operations.

Operations can have parameters that can be passed via URL path (/users/{userId}), query string (/users?role=admin), headers (X-CustomHeader: Value) and request body. You can define the parameter types, format, whether they are required or optional, and other details:

More info: Describing Parameters.

For each operation, you can define possible status codes, such as 200 OK or 404 Not Found, and schema of the response body. Schemas can be defined inline or referenced from an external definition via $ref. You can also provide example responses for different content types.

More info: Describing Responses.

The global definitions section lets you define common data structures used in your API. They can be referenced via $refwhenever a schema is required – both for request body and response body. For example, this JSON object:

can be represented as:

and then referenced in the request body schema and response body schema as follows:

The securityDefinitions and security keywords are used to describe the authentication methods used in your API.

Supported authentication methods are:

More info: Authentication.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1swagger: "2.0"2info:3  title: Sample API4  description: API description in Markdown.5  version: 1.0.06
7host: api.example.com8basePath: /v19schemes:10  - https11
12paths:13  /users:14    get:15      summary: Returns a list of users.16      description: Optional extended description in Markdown.17      produces:18        - application/json19      responses:20        200:21          description: OK
```

Example 2 (yaml):
```yaml
1swagger: "2.0"
```

Example 3 (yaml):
```yaml
1info:2  title: Sample API3  description: API description in Markdown.4  version: 1.0.0
```

Example 4 (yaml):
```yaml
1host: api.example.com2basePath: /v13schemes:4  - https
```

---

## Grouping Operations With Tags | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/grouping-operations-with-tags/

**Contents:**
- Grouping Operations With Tags

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

You can assign a list of tags to each API operation. Tagged operations may be handled differently by tools and libraries. For example, Swagger UI uses tags to group the displayed operations.

Optionally, you can specify description and externalDocs for each tag by using the global tags section on the root level. The tag names here should match those used in operations.

The tag order in the global tags section also controls the default sorting in Swagger UI. Note that it is possible to use a tag in an operation even if it is not defined on the root level.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1paths:2  /pet/findByStatus:3    get:4      summary: Finds pets by Status5      tags:6        - pets7      ...8  /pet:9    post:10      summary: Adds a new pet to the store11      tags:12        - pets13      ...14  /store/inventory:15    get:16      summary: Returns pet inventories17      tags:18        - store19      ...
```

Example 2 (yaml):
```yaml
1tags:2  - name: pets3    description: Everything about your Pets4    externalDocs:5      url: http://docs.my-api.com/pet-operations.htm6  - name: store7    description: Access to Petstore orders8    externalDocs:9      url: http://docs.my-api.com/store-orders.htm
```

---

## Cookie Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/cookie-authentication/

**Contents:**
- Cookie Authentication
  - Describing Cookie Authentication
  - Describing the Set-Cookie Header

OAS 3 This guide is for OpenAPI 3.0.

Cookie authentication uses HTTP cookies to authenticate client requests and maintain session information. It works as follows:

Note: Cookie authentication is vulnerable to Cross-Site Request Forgeries (CSRF) attacks, so it should be used together with other security measures, such as CSRF tokens.

Note for Swagger UI and Swagger Editor users: Cookie authentication is currently not supported for “try it out” requests due to browser security restrictions. See this issue for more information. SwaggerHub does not have this limitation.

In OpenAPI 3.0 terms, cookie authentication is an API key that is sent in: cookie. For example, authentication via a cookie named JSESSIONID is defined as follows:

In this example, cookie authentication is applied globally to the whole API using the security key at the root level of the specification. If cookies are required for just a subset of operations, apply security on the operation level instead of doing it globally:

Cookie authentication can be combined with other authentication methods as explained in Using Multiple Authentication Types.

You may also want to document that your login operation returns the cookie in the Set-Cookie header. You can include this information in the description, and also define the Set-Cookie header in the response headers, like so:

Note that the Set-Cookie header and securitySchemes are not connected in any way, and the Set-Header definition is for documentation purposes only.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (sass):
```sass
1Set-Cookie: JSESSIONID=abcde12345; Path=/; HttpOnly
```

Example 2 (sass):
```sass
1Cookie: JSESSIONID=abcde12345
```

Example 3 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the cookie name4components:5  securitySchemes:6    cookieAuth: # arbitrary name for the security scheme; will be used in the "security" key later7      type: apiKey8      in: cookie9      name: JSESSIONID # cookie name10
11# 2) Apply cookie auth globally to all operations12security:13  - cookieAuth: []
```

Example 4 (json):
```json
1paths:2  /users:3    get:4      security:5        - cookieAuth: []6      description: Returns a list of users.7      responses:8        "200":9          description: OK
```

---

## OpenID Connect Discovery | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/openid-connect-discovery/

**Contents:**
- OpenID Connect Discovery
  - Describing OpenID Connect Discovery
  - Relative Discovery URL
  - Swagger UI support

OAS 3 This guide is for OpenAPI 3.0.

OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 protocol and supported by some OAuth 2.0 providers, such as Google and Azure Active Directory. It defines a sign-in flow that enables a client application to authenticate a user, and to obtain information (or “claims”) about that user, such as the user name, email, and so on. User identity information is encoded in a secure JSON Web Token (JWT), called ID token. OpenID Connect defines a discovery mechanism, called OpenID Connect Discovery, where an OpenID server publishes its metadata at a well-known URL, typically

https://server.com/.well-known/openid-configuration

This URL returns a JSON listing of the OpenID/OAuth endpoints, supported scopes and claims, public keys used to sign the tokens, and other details. The clients can use this information to construct a request to the OpenID server. The field names and values are defined in the OpenID Connect Discovery Specification. Here is an example of data returned:

OpenAPI 3.0 lets you describe OpenID Connect Discovery as follows:

The first section, components/securitySchemes, defines the security scheme type (openIdConnect) and the URL of the discovery endpoint (openIdConnectUrl). Unlike OAuth 2.0, you do not need to list the available scopes in securitySchemes – the clients are supposed to read them from the discovery endpoint instead. The security section then applies the chosen security scheme to your API. The actual scopes required for API calls need to be listed here. These may be a subset of the scopes returned by the discovery endpoint. If different API operations require different scopes, you can apply security on the operation level instead of globally. This way you can list the relevant scopes for each operation:

openIdConnectUrl can be specified relative to the server URL, like so:

Relative URLs are resolved according to RFC 3986. In the example above, it will be resolved to https://api.example.com/.well-known/openid-configuration.

Support for OpenID Connect Discovery was added in Swagger UI v. 3.38.0 and Swagger Editor 3.14.8.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1{2  "issuer": "https://example.com/",3  "authorization_endpoint": "https://example.com/authorize",4  "token_endpoint": "https://example.com/token",5  "userinfo_endpoint": "https://example.com/userinfo",6  "jwks_uri": "https://example.com/.well-known/jwks.json",7  "scopes_supported": ["pets_read", "pets_write", "admin"],8  "response_types_supported": ["code", "id_token", "token id_token"],9  "token_endpoint_auth_methods_supported": ["client_secret_basic"],10  ...,11}
```

Example 2 (yaml):
```yaml
1openapi: 3.0.42---3# 1) Define the security scheme type and attributes4components:5  securitySchemes:6    openId: # <--- Arbitrary name for the security scheme. Used to refer to it from elsewhere.7      type: openIdConnect8      openIdConnectUrl: https://example.com/.well-known/openid-configuration9
10# 2) Apply security globally to all operations11security:12  - openId: # <--- Use the same name as specified in securitySchemes13      - pets_read14      - pets_write15      - admin
```

Example 3 (lua):
```lua
1paths:2  /pets/{petId}:3    get:4      summary: Get a pet by ID5      security:6        - openId:7          - pets_read8      ...9
10    delete:11      summary: Delete a pet by ID12      security:13        - openId:14          - pets_write15      ...
```

Example 4 (yaml):
```yaml
1servers:2  - url: https://api.example.com/v2
```

---

## Basic Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/authentication/basic-authentication/

**Contents:**
- Basic Authentication
    - 401 Response

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

Basic authentication is a very simple authentication scheme that is built into the HTTP protocol. The client sends HTTP requests with the Authorization header that contains the Basic word followed by a space and a base64-encoded username:password string. For example, a header containing the demo / p@55w0rd credentials would be encoded as:

Note: Because base64 is easily decoded, Basic authentication should only be used together with other security mechanisms such as HTTPS/SSL.

Basic authentication is easy to define. In the global securityDefinitions section, add an entry with type: basic and an arbitrary name (in this example - basicAuth). Then, apply security to the whole API or specific operations by using the security section.

You can also define the 401 “Unauthorized” response returned for requests with missing or incorrect credentials. This response includes the WWW-Authenticate header, which you may want to mention. As with other common responses, the 401 response can be defined in the global responses section and referenced from multiple operations.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1Authorization: Basic ZGVtbzpwQDU1dzByZA==
```

Example 2 (yaml):
```yaml
1securityDefinitions:2  basicAuth:3    type: basic4
5# To apply Basic auth to the whole API:6security:7  - basicAuth: []8
9paths:10  /something:11    get:12      # To apply Basic auth to an individual operation:13      security:14        - basicAuth: []15      responses:16        200:17          description: OK (successfully authenticated)
```

Example 3 (lua):
```lua
1paths:2  /something:3    get:4      ...5      responses:6        ...7        401:8            $ref: '#/responses/UnauthorizedError'9    post:10      ...11      responses:12        ...13        401:14          $ref: '#/responses/UnauthorizedError'15responses:16  UnauthorizedError:17    description: Authentication information is missing or invalid18    headers:19      WWW_Authenticate:20        type: string
```

---

## Supported JSON Schema Keywords | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/keywords/

**Contents:**
- Supported JSON Schema Keywords
  - Supported Keywords
  - Unsupported Keywords
  - Additional Keywords
  - References

OAS 3 This guide is for OpenAPI 3.0.

OpenAPI 3.0 uses an extended subset of JSON Schema Specification Wright Draft 00 (aka Draft 5) to describe the data formats. “Extended subset” means that some keywords are supported and some are not, some keywords have slightly different usage than in JSON Schema, and additional keywords are introduced.

These keywords have the same meaning as in JSON Schema:

These keywords are supported with minor differences:

OpenAPI schemas can also use the following keywords that are not part of JSON Schema:

OpenAPI 3.0 – Schema Object

JSON Schema Validation – JSON Schema keyword reference

JSON Schema Draft Wright 00 – Core JSON Schema Specification

Did not find what you were looking for? Ask the community Found a mistake? Let us know

---

## OAuth 2.0 | Swagger Docs

**URL:** https://swagger.io/docs/specification/authentication/oauth2/

**Contents:**
- OAuth 2.0
  - Flows
  - Describing OAuth 2.0 Using OpenAPI
  - About Scopes
    - No Scopes
  - Relative Endpoint URLs
  - Security Scheme Examples
    - Authorization Code Flow
    - Implicit Flow
    - Resource Owner Password Flow

OAS 3 This guide is for OpenAPI 3.0.

OAuth 2.0 is an authorization protocol that gives an API client limited access to user data on a web server. GitHub, Google, and Facebook APIs notably use it. OAuth relies on authentication scenarios called flows, which allow the resource owner (user) to share the protected content from the resource server without sharing their credentials. For that purpose, an OAuth 2.0 server issues access tokens that the client applications can use to access protected resources on behalf of the resource owner. For more information about OAuth 2.0, see oauth.net and RFC 6749.

The flows (also called grant types) are scenarios an API client performs to get an access token from the authorization server. OAuth 2.0 provides several flows suitable for different types of API clients:

To describe an API protected using OAuth 2.0, first, add a security scheme with type: oauth2 to the global components/securitySchemes section. Then add the security key to apply security globally or to individual operations:

The flows keyword specifies one or more named flows supported by this OAuth 2.0 scheme. The flow names are:

The flows object can specify multiple flows, but only one of each type. Each flow contains the following information:

With OpenAPI 3.0, a user can grant scoped access to their account, which can vary depending on the operation the client application wants to perform. Each OAuth access token can be tagged with multiple scopes. Scopes are access rights that control whether the credentials a user provides allow to perform the needed call to the resource server. They do not grant any additional permissions to the client except for those it already has. Note: In the authorization code and implicit flows, the requested scopes are listed on the authorization form displayed to the user. To apply the scopes, you need to perform two steps:

If all API operations require the same scopes, you can add security on the root level of the API definition instead:

Scopes are optional, and your API may not use any. In this case, specify an empty object {} in the scopes definition, and an empty list of scopes [] in the security section:

In OpenAPI 3.0, authorizationUrl, tokenUrl and refreshUrl can be specified relative to the API server URL. This is handy if these endpoints are on same server as the rest of the API operations.

Relative URLs are resolved according to RFC 3986. In the example above, the endpoints will be resolved to:

authorizationUrl: https://api.example.com/oauth/authorize

tokenUrl: https://api.example.com/oauth/token

The authorization flow uses authorizationUrl, tokenUrl and optional refreshUrl. Here is an example for Slack API:

implicit flow defines authorizationUrl that is used to obtain the access token from the authorization server. Here is an example:

The password flow uses tokenUrl and optional refreshUrl. Here is an example:

The clientCredentials flow uses tokenUrl and optional refreshUrl. Here is an example for Getty Images API:

Below is an example of the OAuth 2.0 security definition that supports multiple flows. The clients can use any of these flows.

Should I additionally define authorizationUrl and tokenUrl as API operations?

authorizationUrl is not an API endpoint but a special web page that requires user input. So, it cannot be described using OpenAPI. Still, you can describe tokenUrl if you need it.

Should authorizationUrl and tokenUrl include query string parameters, such as grant_type, client_id and others?

The OpenAPI Specification does not state this, so it is up to you and the tools you use.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (lua):
```lua
1# Step 1 - define the security scheme2components:3  securitySchemes:4    oAuthSample:    # <---- arbitrary name5      type: oauth26      description: This API uses OAuth 2 with the implicit grant flow. [More info](https://api.example.com/docs/auth)7      flows:8        implicit:   # <---- OAuth flow(authorizationCode, implicit, password or clientCredentials)9          authorizationUrl: https://api.example.com/oauth2/authorize10          scopes:11            read_pets: read your pets12            write_pets: modify pets in your account13
14# Step 2 - apply security globally...15security:16  - oAuthSample:17    - write_pets18    - read_pets19
20# ... or to individual operations21paths:22  /pets:23    patch:24      summary: Add a new pet25      security:26        - oAuthSample:27          - write_pets28          - read_pets29      ...
```

Example 2 (yaml):
```yaml
1components:2  securitySchemes:3    oAuthSample:4      type: oauth25      flows:6        implicit:7          authorizationUrl: https://api.example.com/oauth2/authorize8          scopes:9            read_pets: read pets in your account10            write_pets: modify pets in your account
```

Example 3 (lua):
```lua
1paths:2  /pets/{petId}:3    patch:4      summary: Updates a pet in the store5      security:6        - oAuthSample: [write_pets]7      ...
```

Example 4 (swift):
```swift
1security:2  - oAuthSample: [write_pets]
```

---

## Representing XML | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/data-models/representing-xml/

**Contents:**
- Representing XML
  - Change Element Names
  - Convert Property to an Attribute
  - Prefixes and Namespaces
  - Wrapping Arrays
  - Reference

OAS 3 This guide is for OpenAPI 3.0.

In your API specification, you can describe data in both XML and JSON formats as they are easily interchangeable. For example, the following declaration —

— is represented in the following way in JSON and XML:

As you can see, in XML representation, the object name serves as a parent element and properties are translated to child elements. The OpenAPI 3 format offers a special xml object to help you fine-tune representation of XML data. You can use this object to transform some properties to attributes rather than elements, to change element names, to add namespaces and to control transformations of array items.

By default, XML elements get the same names that fields in the API declaration have. To change the default behavior, add the xml/name field to your spec:

For arrays, the xml/name property works only if another property – xml/wrapped – is set to true. See below.

As we said above, by default, properties are transformed to child elements of the parent “object” element. To make some property an attribute in the resulting XML data, use the xml/attribute:

This works only for properties. Using xml/attribute for objects is meaningless.

To avoid element name conflicts, you can specify namespace and prefix for elements. The namespace value must be an absolute URI:

Namespace prefixes will be ignored for JSON:

The example below shows how you can add namespaces and prefixes:

If needed, you can specify only prefix (This works in case the namespace is defined in some parent element). You can also specify prefixes for attributes.

Arrays are translated as a sequence of elements of the same name:

If needed, you can add a wrapping element by using the xml/wrapped property:

As you can see, by default, the wrapping element has the same name as item elements. Use xml/name to give different names to the wrapping element and array items (this will help you resolve possible naming issues):

Note that the xml.name property of the wrapping element (books in our example) has effect only if wrapped is true. If wrapped is false, xml.name of the wrapping element is ignored.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  schemas:3    book:4      type: object5      properties:6        id:7          type: integer8        title:9          type: string10        author:11          type: string
```

Example 2 (json):
```json
1{ "id": 0, "title": "string", "author": "string" }
```

Example 3 (typescript):
```typescript
1<book>2  <id>0</id>3  <title>string</title>4  <author>string</author>5</book>
```

Example 4 (yaml):
```yaml
1components:2  schemas:3    book:4      type: object5      properties:6        id:7          type: integer8        title:9          type: string10        author:11          type: string12      xml:13        name: "xml-book"
```

---

## MIME Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/mime-types/

**Contents:**
- MIME Types

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

An API can accept and return data in different formats, the most common being JSON and XML. You can use the consumes and produces keywords to specify the MIME types understood by your API. The value of consumes and produces is an array of MIME types. Global MIME types can be defined on the root level of an API specification and are inherited by all API operations. Here the API uses JSON and XML:

Note that consumes only affects operations with a request body, such as POST, PUT and PATCH. It is ignored for bodiless operations like GET. When used on the operation level, consumes and produces override (not extend) the global definitions. In the following example, the GET /logo operation redefines the produces array to return an image:

MIME types listed in consumes and produces should be compliant with RFC 6838. For example, you can use standard MIME types such as:

as well as vendor-specific MIME types (indicated by vnd.):

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1consumes:2  - application/json3  - application/xml4produces:5  - application/json6  - application/xml
```

Example 2 (yaml):
```yaml
1paths:2  /logo:3    get:4      summary: Returns the logo image5      produces:6        - image/png7        - image/gif8        - image/jpeg9      responses:10        200:11          description: OK12          schema:13            type: file
```

Example 3 (sass):
```sass
1application/json2application/xml3application/x-www-form-urlencoded4multipart/form-data5text/plain; charset=utf-86text/html7application/pdf8image/png
```

Example 4 (sass):
```sass
1application/vnd.mycompany.myapp.v2+json2application/vnd.ms-excel3application/vnd.openstreetmap.data+xml4application/vnd.github-issue.text+json5application/vnd.github.v3.diff6image/vnd.djvu
```

---

## Media Types | Swagger Docs

**URL:** https://swagger.io/docs/specification/media-types/

**Contents:**
- Media Types
  - Media Type Names
  - Multiple Media Types

OAS 3 This page is about OpenAPI 3.0. If you use OpenAPI 2.0, see the OpenAPI 2.0 guide.

Media type is a format of a request or response body data. Web service operations can accept and return data in different formats, the most common being JSON, XML and images. You specify the media type in request and response definitions. Here is an example of a response definition:

Under responses we have definitions of individual responses. As you can see, each response is defined by its code ('200' in our example.). The keyword content below the code corresponds to the response body. One or multiple media types go as child keywords of this content keyword. Each media type includes a schema, defining the data type of the message body, and, optionally, one or several examples. For more information on defining body data, see Defining Request Body and Defining Responses.

The media types listed below the content field should be compliant with RFC 6838. For example, you can use standard types or vendor-specific types (indicated by .vnd) –

You may want to specify multiple media types:

To use the same data format for several media types, define a custom object in the components section of your spec and then refer to this object in each media type:

To define the same format for multiple media types, you can also use placeholders like */*, application/*, image/* or others:

The value you use as media type – image/* in our example – is very similar to what you can see in the Accept or Content-Type headers of HTTP requests and responses. Do not confuse the placeholder and the actual value of the Accept or Content-Type headers. For example, the image/* placeholder for a response body means that the server will use the same data structure for all the responses that match the placeholder. It does not mean that the string image/* will be specified in the Content-Type header. The Content-Type header most likely will have image/png, image/jpeg, or some other similar value.

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # Media type10              schema: # Must-have11                type: object # Data type12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19                example: # Sample data20                  id: 121                  name: Jessica Right22                  fullTime: true
```

Example 2 (sass):
```sass
1application/json2application/xml3application/x-www-form-urlencoded4multipart/form-data5text/plain; charset=utf-86text/html7application/pdf8image/png
```

Example 3 (sass):
```sass
1application/vnd.mycompany.myapp.v2+json2application/vnd.ms-excel3application/vnd.openstreetmap.data+xml4application/vnd.github-issue.text+json5application/vnd.github.v3.diff6image/vnd.djvu
```

Example 4 (json):
```json
1paths:2  /employees:3    get:4      summary: Returns a list of employees.5      responses:6        "200": # Response7          description: OK8          content: # Response body9            application/json: # One of media types10              schema:11                type: object12                properties:13                  id:14                    type: integer15                  name:16                    type: string17                  fullTime:18                    type: boolean19            application/xml: # Another media types20              schema:21                type: object22                properties:23                  id:24                    type: integer25                  name:26                    type: string27                  fullTime:28                    type: boolean
```

---

## Authentication | Swagger Docs

**URL:** https://swagger.io/docs/specification/v3_0/authentication/

**Contents:**
- Authentication
  - Changes from OpenAPI 2.0
  - Describing Security
    - Step 1. Defining securitySchemes
    - Step 2. Applying security
  - Scopes
  - Using Multiple Authentication Types
  - Reference

OAS 3 This guide is for OpenAPI 3.0. If you use OpenAPI 2.0, see our OpenAPI 2.0 guide.

OpenAPI uses the term security scheme for authentication and authorization schemes. OpenAPI 3.0 lets you describe APIs protected using the following security schemes:

Follow the links above for the guides on specific security types, or continue reading to learn how to describe security in general.

If you used OpenAPI 2.0 before, here is a summary of changes to help you get started with OpenAPI 3.0:

Security is described using the securitySchemes and security keywords. You use securitySchemes to define all security schemes your API supports, then use security to apply specific schemes to the whole API or individual operations.

All security schemes used by the API must be defined in the global components/securitySchemes section. This section contains a list of named security schemes, where each scheme can be of type:

Other required properties for security schemes depend on the type. The following example shows how various security schemes are defined. The BasicAuth, BearerAuth names and others are arbitrary names that will be used to refer to these definitions from other places in the spec.

After you have defined the security schemes in the securitySchemes section, you can apply them to the whole API or individual operations by adding the security section on the root level or operation level, respectively. When used on the root level, security applies the specified security schemes globally to all API operations, unless overridden on the operation level. In the following example, the API calls can be authenticated using either an API key or OAuth 2. The ApiKeyAuth and OAuth2 names refer to the schemes previously defined in securitySchemes.

For each scheme, you specify a list of security scopes required for API calls (see below). Scopes are used only for OAuth 2 and OpenID Connect Discovery; other security schemes use an empty array [] instead. Global security can be overridden in individual operations to use a different authentication type, different OAuth/OpenID scopes, or no authentication at all:

OAuth 2 and OpenID Connect use scopes to control permissions to various user resources. For example, the scopes for a pet store may include read_pets, write_pets, read_orders, write_orders, admin. When applying security, the entries corresponding to OAuth 2 and OpenID Connect need to specify a list of scopes required for a specific operation (if security is used on the operation level) or all API calls (if security is used on the root level).

Different operations typically require different scopes, such as read vs write vs admin. In this case, you should apply scoped security to specific operations instead of doing it globally.

Some REST APIs support several authentication types. The security section lets you combine the security requirements using logical OR and AND to achieve the desired result. security uses the following logic:

That is, security is an array of hashmaps, where each hashmap contains one or more named security schemes. Items in a hashmap are combined using logical AND, and array items are combined using logical OR. Security schemes combined via OR are alternatives – any one can be used in the given context. Security schemes combined via AND must be used simultaneously in the same request. Here, we can use either Basic authentication or an API key:

Here, the API requires a pair of API keys to be included in requests:

Here, we can use either OAuth 2 or a pair of API keys:

Security Scheme Object

Security Requirement Object

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1components:2  securitySchemes:3    BasicAuth:4      type: http5      scheme: basic6
7    BearerAuth:8      type: http9      scheme: bearer10
11    ApiKeyAuth:12      type: apiKey13      in: header14      name: X-API-Key15
16    OpenID:17      type: openIdConnect18      openIdConnectUrl: https://example.com/.well-known/openid-configuration19
20    OAuth2:21      type: oauth222      flows:23        authorizationCode:24          authorizationUrl: https://example.com/oauth/authorize25          tokenUrl: https://example.com/oauth/token26          scopes:27            read: Grants read access28            write: Grants write access29            admin: Grants access to admin operations
```

Example 2 (yaml):
```yaml
1security:2  - ApiKeyAuth: []3  - OAuth2:4      - read5      - write6# The syntax is:7# - scheme name:8#     - scope 19#     - scope 2
```

Example 3 (json):
```json
1paths:2  /billing_info:3    get:4      summary: Gets the account billing info5      security:6        - OAuth2: [admin] # Use OAuth with a different scope7      responses:8        "200":9          description: OK10        "401":11          description: Not authenticated12        "403":13          description: Access token does not have the required scope14
15  /ping:16    get:17      summary: Checks if the server is running18      security: [] # No security19      responses:20        "200":21          description: Server is up and running22        default:23          description: Something is wrong
```

Example 4 (yaml):
```yaml
1security:2  - OAuth2:3      - scope14      - scope25  - OpenId:6      - scopeA7      - scopeB8  - BasicAuth: []
```

---

## API Host and Base Path | Swagger Docs

**URL:** https://swagger.io/docs/specification/v2_0/api-host-and-base-path/

**Contents:**
- API Host and Base Path
  - schemes
  - host
  - basePath
  - Omitting host and scheme
  - FAQ
      - Can I specify multiple hosts, e.g. development, test and production?
      - Do host and basePath support templating? Such as:
      - Can I specify different ports for HTTP and HTTPS? Such as:
  - Reference

OAS 2 This page applies to OpenAPI Specification ver. 2 (fka Swagger). To learn about the latest version, visit OpenAPI 3 pages.

REST APIs have a base URL to which the endpoint paths are appended. The base URL is defined by schemes, host and basePath on the root level of the API specification.

All API paths are relative to this base URL, for example, /users actually means <scheme>://<host>/<basePath>/users.

schemes are the transfer protocols used by the API. Swagger supports the http, https, and WebSocket schemes – ws and wss. As with any lists in YAML, schemes can be specified using the list syntax:

or the array literal syntax:

If schemes are not specified, the scheme used to serve the API specification will be used for API calls.

host is the domain name or IP address (IPv4) of the host that serves the API. It may include the port number if different from the scheme’s default port (80 for HTTP and 443 for HTTPS). Note that this must be the host only, without http(s):// or sub-paths. Valid hosts:

If host is not specified, it is assumed to be the same host where the API documentation is being served.

basePath is the URL prefix for all API paths, relative to the host root. It must start with a leading slash /. If basePath is not specified, it defaults to /, that is, all paths start at the host root. Valid base paths:

host and schemes can be omitted for a more dynamic association. In this case, the host and scheme used to serve the API documentation will be used for API calls. For example, if Swagger UI-based documentation is hosted at https://api.example.com/apidocs/index.html, “try it out” API calls will be directed to https://api.example.com.

Multiple hosts are supported in OpenAPI 3.0. 2.0 supports only one host per API specification (or two if you count HTTP and HTTPS as different hosts). A possible way to target multiple hosts is to omit the host and schemes from your specification and serve it from each host. In this case, each copy of the specification will target the corresponding host.

This is supported in OpenAPI 3.0, but not in 2.0. For a workaround for host templating, see the previous question.

This is supported in OpenAPI 3.0, but not in 2.0. In 2.0, you can omit the host and schemes and serve the specification from both hosts. This way, each copy of the specification will target the host and port used to access that specification.

host, basePath and schemes fields

Did not find what you were looking for? Ask the community Found a mistake? Let us know

**Examples:**

Example 1 (yaml):
```yaml
1host: petstore.swagger.io2basePath: /v23schemes:4    - https
```

Example 2 (yaml):
```yaml
1schemes:2    - http3    - https
```

Example 3 (yaml):
```yaml
1schemes: [http, https]
```

Example 4 (json):
```json
1api.example.com2example.com:8089393.184.216.34493.184.216.34:8089
```

---
