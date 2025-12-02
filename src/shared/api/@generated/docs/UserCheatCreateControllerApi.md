# UserCheatCreateControllerApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUser**](#createuser) | **POST** /api/v1/test/users/create | |
|[**generateCustomToken**](#generatecustomtoken) | **POST** /api/v1/test/tokens/custom | |
|[**login**](#login) | **POST** /api/v1/test/users/login | |

# **createUser**
> LoginResponse createUser()


### Example

```typescript
import {
    UserCheatCreateControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCheatCreateControllerApi(configuration);

let email: string; // (default to undefined)
let nickname: string; // (default to undefined)
let role: string; // (default to undefined)

const { status, data } = await apiInstance.createUser(
    email,
    nickname,
    role
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|
| **nickname** | [**string**] |  | defaults to undefined|
| **role** | [**string**] |  | defaults to undefined|


### Return type

**LoginResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **generateCustomToken**
> LoginResponse generateCustomToken()


### Example

```typescript
import {
    UserCheatCreateControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCheatCreateControllerApi(configuration);

let accessToken: string; // (default to undefined)
let newExpirationMinutes: number; // (default to undefined)

const { status, data } = await apiInstance.generateCustomToken(
    accessToken,
    newExpirationMinutes
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **accessToken** | [**string**] |  | defaults to undefined|
| **newExpirationMinutes** | [**number**] |  | defaults to undefined|


### Return type

**LoginResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
> LoginResponse login()


### Example

```typescript
import {
    UserCheatCreateControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserCheatCreateControllerApi(configuration);

let userId: number; // (default to undefined)

const { status, data } = await apiInstance.login(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**number**] |  | defaults to undefined|


### Return type

**LoginResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

