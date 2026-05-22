# NoticeQueryAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getNoticeSummaries**](#getnoticesummaries) | **GET** /api/v1/notice/summaries/{page} | 공지 요약 목록 조회|
|[**getNoticeSummary**](#getnoticesummary) | **GET** /api/v1/notice/{noticeId} | 공지 상세 조회|

# **getNoticeSummaries**
> SliceResponse getNoticeSummaries()

최신 공지의 요약 리스트를 페이지 단위(0-based)로 조회합니다.

### Example

```typescript
import {
    NoticeQueryAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeQueryAPIApi(configuration);

let page: number; //1부터 시작하는 페이지 번호 (default to undefined)

const { status, data } = await apiInstance.getNoticeSummaries(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 1부터 시작하는 페이지 번호 | defaults to undefined|


### Return type

**SliceResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNoticeSummary**
> NoticeDetailResponse getNoticeSummary()

공지의 상세 내용을 조회합니다.

### Example

```typescript
import {
    NoticeQueryAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NoticeQueryAPIApi(configuration);

let noticeId: number; // (default to undefined)

const { status, data } = await apiInstance.getNoticeSummary(
    noticeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **noticeId** | [**number**] |  | defaults to undefined|


### Return type

**NoticeDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 조회 성공 |  -  |
|**404** | 🚨 공지 조회 실패(미존재) |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

