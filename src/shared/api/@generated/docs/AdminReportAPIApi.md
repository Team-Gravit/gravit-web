# AdminReportAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllReports**](#getallreports) | **GET** /api/v1/admin/reports | 신고 목록 조회|
|[**getReport**](#getreport) | **GET** /api/v1/admin/reports/{reportId} | 신고 상세 조회|
|[**updateReportStatus**](#updatereportstatus) | **PATCH** /api/v1/admin/reports/{reportId}/status | 신고 해결 상태 변경|

# **getAllReports**
> Array<ReportSummaryResponse> getAllReports()

페이징된 신고 목록을 조회합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminReportAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminReportAPIApi(configuration);

let page: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getAllReports(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|


### Return type

**Array<ReportSummaryResponse>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 신고 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getReport**
> ReportDetailResponse getReport()

특정 신고의 상세 정보를 조회합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminReportAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminReportAPIApi(configuration);

let reportId: number; // (default to undefined)

const { status, data } = await apiInstance.getReport(
    reportId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportId** | [**number**] |  | defaults to undefined|


### Return type

**ReportDetailResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 신고 상세 조회 성공 |  -  |
|**404** | 🚨 신고 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateReportStatus**
> updateReportStatus()

신고의 해결 상태를 토글합니다<br>🔐 <strong>관리자 권한 필요</strong><br>

### Example

```typescript
import {
    AdminReportAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminReportAPIApi(configuration);

let reportId: number; // (default to undefined)

const { status, data } = await apiInstance.updateReportStatus(
    reportId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportId** | [**number**] |  | defaults to undefined|


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
|**200** | ✅ 신고 상태 변경 성공 |  -  |
|**404** | 🚨 신고 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

