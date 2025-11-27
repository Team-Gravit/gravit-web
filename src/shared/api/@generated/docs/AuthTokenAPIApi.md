# AuthTokenAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**reissueToken**](#reissuetoken) | **POST** /api/v1/auth/reissue | 리프레시 토큰으로 엑세스 토큰 재발급|

# **reissueToken**
> ReissueResponse reissueToken(refreshTokenRequest)

유효한 리프레시 토큰으로 엑세스 토큰을 재발급합니다. <br> 만약 리프레시 토큰이 유효하지 않다면 재 로그인이 필요합니다.

### Example

```typescript
import {
    AuthTokenAPIApi,
    Configuration,
    RefreshTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthTokenAPIApi(configuration);

let refreshTokenRequest: RefreshTokenRequest; //

const { status, data } = await apiInstance.reissueToken(
    refreshTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequest** | **RefreshTokenRequest**|  | |


### Return type

**ReissueResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 엑세스 토큰 재발급 성공 |  -  |
|**401** | 만료된 리프레시 토큰입니다. |  -  |
|**400** | 존재하지 않는 유저입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

