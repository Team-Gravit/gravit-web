# UserDataCleanControllerApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**clean**](#clean) | **POST** /api/v1/test/users/clean | |

# **clean**
> clean()


### Example

```typescript
import {
    UserDataCleanControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserDataCleanControllerApi(configuration);

let email: string; // (default to undefined)

const { status, data } = await apiInstance.clean(
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

