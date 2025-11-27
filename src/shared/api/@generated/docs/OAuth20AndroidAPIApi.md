# OAuth20AndroidAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**oauthLogin1**](#oauthlogin1) | **POST** /api/v1/oauth/android | OAuth 회원가입/로그인 처리|

# **oauthLogin1**
> LoginResponse oauthLogin1(idTokenRequest)

Android 에서 전달한 OAuth IdToken 을 기반으로 사용자 정보를 조회하고 회원가입/로그인 처리를 합니다

### Example

```typescript
import {
    OAuth20AndroidAPIApi,
    Configuration,
    IdTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuth20AndroidAPIApi(configuration);

let idTokenRequest: IdTokenRequest; //

const { status, data } = await apiInstance.oauthLogin1(
    idTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **idTokenRequest** | **IdTokenRequest**|  | |


### Return type

**LoginResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ OAuth 회원가입/로그인 성공 |  -  |
|**400** | 🚨 유효하지 않은 OAuth IdToken |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

