# AdminOptionAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createOption**](#createoption) | **POST** /api/v1/admin/options | 옵션 생성|
|[**deleteOption**](#deleteoption) | **DELETE** /api/v1/admin/options/{optionId} | 옵션 삭제|
|[**updateOption**](#updateoption) | **PUT** /api/v1/admin/options | 옵션 수정|

# **createOption**
> createOption(optionCreateRequest)

새로운 옵션을 생성합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminOptionAPIApi,
    Configuration,
    OptionCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOptionAPIApi(configuration);

let optionCreateRequest: OptionCreateRequest; //

const { status, data } = await apiInstance.createOption(
    optionCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **optionCreateRequest** | **OptionCreateRequest**|  | |


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | ✅ 옵션 생성 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteOption**
> deleteOption()

기존 옵션을 삭제합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminOptionAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOptionAPIApi(configuration);

let optionId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteOption(
    optionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **optionId** | [**number**] |  | defaults to undefined|


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
|**204** | ✅ 옵션 삭제 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateOption**
> updateOption(optionUpdateRequest)

기존 옵션을 수정합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminOptionAPIApi,
    Configuration,
    OptionUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminOptionAPIApi(configuration);

let optionUpdateRequest: OptionUpdateRequest; //

const { status, data } = await apiInstance.updateOption(
    optionUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **optionUpdateRequest** | **OptionUpdateRequest**|  | |


### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | ✅ 옵션 수정 성공 |  -  |
|**404** | 🚨 옵션 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

