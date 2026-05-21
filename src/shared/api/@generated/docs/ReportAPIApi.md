# ReportAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**submitProblemReport**](#submitproblemreport) | **POST** /api/v1/reports | 문제 신고 제출|

# **submitProblemReport**
> submitProblemReport(problemReportSubmitRequest)

특정 문제에 대한 오류를 신고합니다.<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    ReportAPIApi,
    Configuration,
    ProblemReportSubmitRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportAPIApi(configuration);

let problemReportSubmitRequest: ProblemReportSubmitRequest; //

const { status, data } = await apiInstance.submitProblemReport(
    problemReportSubmitRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **problemReportSubmitRequest** | **ProblemReportSubmitRequest**|  | |


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
|**200** | ✅ 문제 신고 제출 성공 |  -  |
|**404** | 🚨 문제 조회 실패 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

