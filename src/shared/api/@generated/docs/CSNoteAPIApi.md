# CSNoteAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getNote**](#getnote) | **GET** /api/v1/cs-notes/{unitId} | 개념 노트 조회|

# **getNote**
> File getNote()

챕터와 유닛 정보로 Markdown 형식의 개념 노트를 조회합니다. <br>응답 본문은 Markdown 텍스트 데이터입니다. <br><br>unitId 를 입력하면 unit에 해당하는 개념노트를 응답합니다.

### Example

```typescript
import {
    CSNoteAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CSNoteAPIApi(configuration);

let unitId: number; // (default to undefined)

const { status, data } = await apiInstance.getNote(
    unitId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **unitId** | [**number**] |  | defaults to undefined|


### Return type

**File**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/markdown, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 개념 노트 조회 성공 |  -  |
|**404** | 유닛을 찾을 수 없거나 해당 개념 노트 파일이 존재하지 않습니다. |  -  |
|**500** | 서버 내부 오류가 발생했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

