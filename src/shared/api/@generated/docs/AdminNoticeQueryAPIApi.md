# AdminNoticeQueryAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getNoticeByAdmin**](#getnoticebyadmin) | **GET** /api/v1/admin/notice/{noticeId} | 어드민 공지 단건 조회|
|[**getNoticeSummaryByAdmin**](#getnoticesummarybyadmin) | **GET** /api/v1/admin/notice/summaries/{page} | 어드민 공지 목록(요약) 조회|

# **getNoticeByAdmin**
> AdminNoticeDetailResponse getNoticeByAdmin()

공지 단건을 조회합니다. <strong>DRAFT</strong> 상태도 조회 가능하며, ADMIN 권한이 필요합니다.<br> 🔐 <strong>Jwt 필요</strong> 

### Example

```typescript
import {
    AdminNoticeQueryAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminNoticeQueryAPIApi(configuration);

let noticeId: number; //조회할 공지 ID (default to undefined)

const { status, data } = await apiInstance.getNoticeByAdmin(
    noticeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeId** | [**number**] | 조회할 공지 ID | defaults to undefined|


### Return type

**AdminNoticeDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 조회 성공 |  -  |
|**404** | 🚨 공지 없음 |  -  |
|**403** | 🚨 권한 없음(ADMIN 아님) |  -  |
|**500** | 🚨 서버 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNoticeSummaryByAdmin**
> PageResponse getNoticeSummaryByAdmin()

공지 요약 목록을 조회합니다. <strong>DRAFT, PUBLISHED</strong> 모두 포함되며, ADMIN 권한이 필요합니다.<br> 🔐 <strong>Jwt 필요</strong><br> 

### Example

```typescript
import {
    AdminNoticeQueryAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminNoticeQueryAPIApi(configuration);

let page: number; //1부터 시작하는 페이지 번호 (default to undefined)

const { status, data } = await apiInstance.getNoticeSummaryByAdmin(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 1부터 시작하는 페이지 번호 | defaults to undefined|


### Return type

**PageResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 목록 조회 성공 |  -  |
|**403** | 🚨 권한 없음(ADMIN 아님) |  -  |
|**500** | 🚨 서버 오류 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

