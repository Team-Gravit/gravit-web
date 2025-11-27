# AdminNoticeCommandAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createNotice**](#createnotice) | **POST** /api/v1/admin/notice | 공지 생성|
|[**deleteNotice**](#deletenotice) | **DELETE** /api/v1/admin/notice/{noticeId} | 공지 삭제|
|[**updateNotice**](#updatenotice) | **PATCH** /api/v1/admin/notice | 공지 수정|

# **createNotice**
> AdminNoticeDetailResponse createNotice(noticeCreateRequest)

관리자 권한으로 공지를 생성합니다.

### Example

```typescript
import {
    AdminNoticeCommandAPIApi,
    Configuration,
    NoticeCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminNoticeCommandAPIApi(configuration);

let noticeCreateRequest: NoticeCreateRequest; //

const { status, data } = await apiInstance.createNotice(
    noticeCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeCreateRequest** | **NoticeCreateRequest**|  | |


### Return type

**AdminNoticeDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | ✅ 공지 생성 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteNotice**
> deleteNotice()

관리자 권한으로 공지를 삭제합니다.

### Example

```typescript
import {
    AdminNoticeCommandAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminNoticeCommandAPIApi(configuration);

let noticeId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteNotice(
    noticeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeId** | [**number**] |  | defaults to undefined|


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
|**200** | ✅ 공지 삭제 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateNotice**
> AdminNoticeDetailResponse updateNotice(noticeUpdateRequest)

관리자 권한으로 공지를 수정합니다.

### Example

```typescript
import {
    AdminNoticeCommandAPIApi,
    Configuration,
    NoticeUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminNoticeCommandAPIApi(configuration);

let noticeUpdateRequest: NoticeUpdateRequest; //

const { status, data } = await apiInstance.updateNotice(
    noticeUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeUpdateRequest** | **NoticeUpdateRequest**|  | |


### Return type

**AdminNoticeDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | ✅ 공지 수정 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

