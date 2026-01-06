# OAuth20AndroidAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**oauthLogin1**](#oauthlogin1) | **POST** /api/v1/oauth/android | OAuth 회원가입/로그인 처리|
|[**oauthNaverLogin**](#oauthnaverlogin) | **POST** /api/v1/oauth/android/naver | 네이버 OAuth 회원가입/로그인 처리|

# **oauthLogin1**
> LoginResponse oauthLogin1(idTokenRequest)

Android 에서 전달한 OAuth IdToken 및 provider 기반으로 사용자 정보를 조회하고 회원가입/로그인 처리를 합니다. <br>google, kakao 만 해당 api로 로그인 할 수 있습니다(IdToken 방식)IdToken 을 body에 담고, provider는 쿼리 파라미터로 담아서 사용합니다.

### Example

```typescript
import {
    OAuth20AndroidAPIApi,
    Configuration,
    IdTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuth20AndroidAPIApi(configuration);

let provider: string; // (default to undefined)
let idTokenRequest: IdTokenRequest; //

const { status, data } = await apiInstance.oauthLogin1(
    provider,
    idTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **idTokenRequest** | **IdTokenRequest**|  | |
| **provider** | [**string**] |  | defaults to undefined|


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
|**400** | 🚨 Audience 불일치 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **oauthNaverLogin**
> LoginResponse oauthNaverLogin(naverAndroidUserInfoRequest)

Android에서 전달한 네이버 사용자 정보를 기반으로 회원가입/로그인 처리를 합니다. <br>네이버는 IdToken 방식을 지원하지 않기 때문에 Android에서 직접 사용자 정보(providerId, email, nickname)를 전달합니다.

### Example

```typescript
import {
    OAuth20AndroidAPIApi,
    Configuration,
    NaverAndroidUserInfoRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuth20AndroidAPIApi(configuration);

let naverAndroidUserInfoRequest: NaverAndroidUserInfoRequest; //

const { status, data } = await apiInstance.oauthNaverLogin(
    naverAndroidUserInfoRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **naverAndroidUserInfoRequest** | **NaverAndroidUserInfoRequest**|  | |


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
|**200** | ✅ 네이버 OAuth 회원가입/로그인 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

