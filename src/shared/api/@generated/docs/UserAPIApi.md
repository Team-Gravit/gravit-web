# UserAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMainPage**](#getmainpage) | **GET** /api/v1/users/main-page | 메인 페이지 조회|
|[**getMyPage**](#getmypage) | **GET** /api/v1/users/my-page | 마이페이지 조회|
|[**getUser**](#getuser) | **GET** /api/v1/users | 유저 정보 조회|
|[**onboardUser**](#onboarduser) | **POST** /api/v1/users/onboarding | 온보딩 정보 등록|
|[**restoreUser**](#restoreuser) | **PATCH** /api/v1/users/restore | 소프트 삭제 계정 복구|
|[**updateProfile**](#updateprofile) | **PATCH** /api/v1/users | 프로필 수정|

# **getMainPage**
> MainPageResponse getMainPage()

사용자의 메인 페이지 정보를 조회합니다<br>닉네임, 리그명, 레벨 정보, 미션 정보, 학습 정보를 포함합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UserAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

const { status, data } = await apiInstance.getMainPage();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MainPageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 메인 페이지 조회 성공 |  -  |
|**404** | 🚨 학습 정보 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyPage**
> MyPageResponse getMyPage()

사용자의 마이페이지 정보를 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UserAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

const { status, data } = await apiInstance.getMyPage();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyPageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 마이페이지 조회 성공 |  -  |
|**404** | 🚨 유저 페이지 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUser**
> UserResponse getUser()

로그인한 사용자의 정보를 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UserAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

const { status, data } = await apiInstance.getUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 유저 정보 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **onboardUser**
> UserResponse onboardUser(onboardingRequest)

최초 로그인 시 사용자 온보딩 정보를 저장합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UserAPIApi,
    Configuration,
    OnboardingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

let onboardingRequest: OnboardingRequest; //

const { status, data } = await apiInstance.onboardUser(
    onboardingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **onboardingRequest** | **OnboardingRequest**|  | |


### Return type

**UserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 온보딩 완료 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**400** | 🚨 유효성 검사 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **restoreUser**
> restoreUser()

소셜 providerId로 소프트 삭제된 계정을 복구합니다.<br> - 이미 활성 상태여도 200(OK)으로 응답합니다(멱등적 동작).<br> - 예시 providerId: <code>google 1234567890</code> 

### Example

```typescript
import {
    UserAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

let providerId: string; // (default to undefined)

const { status, data } = await apiInstance.restoreUser(
    providerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **providerId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 복구 완료(또는 이미 활성 상태) |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProfile**
> UserResponse updateProfile(userProfileUpdateRequest)

닉네임, 프로필 사진 등 사용자의 프로필 정보를 수정합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    UserAPIApi,
    Configuration,
    UserProfileUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserAPIApi(configuration);

let userProfileUpdateRequest: UserProfileUpdateRequest; //

const { status, data } = await apiInstance.updateProfile(
    userProfileUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userProfileUpdateRequest** | **UserProfileUpdateRequest**|  | |


### Return type

**UserResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 프로필 수정 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**400** | 🚨 유효성 검사 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

