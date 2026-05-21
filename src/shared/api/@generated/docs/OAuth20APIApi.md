# OAuth20APIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authorizeUrl**](#authorizeurl) | **GET** /api/v1/oauth/login-url/{provider} | 로그인 URL 생성|
|[**oauthLogin**](#oauthlogin) | **POST** /api/v1/oauth/{provider} | OAuth 회원가입/로그인 처리|

# **authorizeUrl**
> { [key: string]: string; } authorizeUrl()

OAuth 정보를 바탕으로 로그인 URL을 생성합니다

### Example

```typescript
import {
    OAuth20APIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuth20APIApi(configuration);

let provider: string; //제공자(kakao, naver, google) 이름 (default to undefined)
let dest: string; //Dest(local, dev, prod) (default to undefined)

const { status, data } = await apiInstance.authorizeUrl(
    provider,
    dest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **provider** | [**string**] | 제공자(kakao, naver, google) 이름 | defaults to undefined|
| **dest** | [**string**] | Dest(local, dev, prod) | defaults to undefined|


### Return type

**{ [key: string]: string; }**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 로그인 URL 생성 성공 |  -  |
|**400** | 🚨 유효하지 않은 OAuth 제공자 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **oauthLogin**
> LoginResponse oauthLogin(authCodeRequest)

AuthCode를 기반으로 사용자 정보를 조회하고 회원가입 및 로그인 처리를 합니다

### Example

```typescript
import {
    OAuth20APIApi,
    Configuration,
    AuthCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OAuth20APIApi(configuration);

let provider: string; //제공자(kakao, naver, google) 이름 (default to undefined)
let dest: string; //Dest(local, dev, prod) (default to undefined)
let authCodeRequest: AuthCodeRequest; //

const { status, data } = await apiInstance.oauthLogin(
    provider,
    dest,
    authCodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authCodeRequest** | **AuthCodeRequest**|  | |
| **provider** | [**string**] | 제공자(kakao, naver, google) 이름 | defaults to undefined|
| **dest** | [**string**] | Dest(local, dev, prod) | defaults to undefined|


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
|**400** | 🚨 유효하지 않은 AuthCode |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

