# UserDeletionAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**confirm**](#confirm) | **POST** /api/v1/users/deletion/confirm | 계정 삭제 확정(메일 인증 코드 확인)|
|[**request**](#request) | **POST** /api/v1/users/deletion/request | 계정 삭제 요청(인증 메일 발송)|

# **confirm**
> confirm()

메일로 발급된 **삭제 인증 코드**를 확인하고 계정 삭제를 확정합니다.<br> 코드가 유효하면 즉시 삭제가 진행됩니다.<br> 🔐 <strong>Jwt 불필요</strong> (메일 링크 진입 가정)<br> 

### Example

```typescript
import {
    UserDeletionAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserDeletionAPIApi(configuration);

let mailAuthCode: string; // (default to undefined)

const { status, data } = await apiInstance.confirm(
    mailAuthCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mailAuthCode** | [**string**] |  | defaults to undefined|


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
|**200** | ✅ 계정 삭제 확정 성공 |  -  |
|**400** | 🚨 인증 코드가 유효하지 않거나 만료됨 |  -  |
|**404** | 🚨 유저 조회 실패(코드에 해당하는 유저가 존재하지 않는 경우) |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **request**
> request()

로그인한 사용자에게 **계정 삭제 확인 메일**을 발송합니다.<br> 메일 내 확인 버튼(또는 링크)을 통해 최종 확정 단계로 이동합니다.<br> 🔐 <strong>Jwt 필요</strong><br> ✅ 응답은 <code>202 Accepted</code>로, 요청이 접수되었음을 의미합니다. 

### Example

```typescript
import {
    UserDeletionAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserDeletionAPIApi(configuration);

let dest: string; // (default to undefined)

const { status, data } = await apiInstance.request(
    dest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **dest** | [**string**] |  | defaults to undefined|


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
|**202** | ✅ 삭제 요청 접수(메일 발송 시도) |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**400** | 🚨 메일 발송 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

