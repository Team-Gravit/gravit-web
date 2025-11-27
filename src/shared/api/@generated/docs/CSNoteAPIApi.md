# CSNoteAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getNote**](#getnote) | **GET** /api/v1/cs-notes/{chapter}/{unit} | 개념 노트 조회|

# **getNote**
> File getNote()

챕터와 유닛 정보로 Markdown 형식의 개념 노트를 조회합니다. <br>응답 본문은 Markdown 텍스트 데이터입니다. <br><br>**파일 구조**: static/notes/{chapter}/{unit}.md <br>**예시**: /api/v1/notes/algorithm/unit01 → static/notes/algorithm/unit01.md <br>**챕터 리스트** : [algorithm, data-structure, network] <br>**알고리즘 유닛 리스트** : unit01 ~ unit17 <br>**자료구조 유닛 리스트** : unit01 ~ unit10 <br>**네트워크 유닛 리스트** : unit01 ~ unit14

### Example

```typescript
import {
    CSNoteAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CSNoteAPIApi(configuration);

let chapter: string; // (default to undefined)
let unit: string; // (default to undefined)

const { status, data } = await apiInstance.getNote(
    chapter,
    unit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chapter** | [**string**] |  | defaults to undefined|
| **unit** | [**string**] |  | defaults to undefined|


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
|**404** | 요청한 개념 노트를 찾을 수 없습니다. |  -  |
|**500** | 서버 내부 오류가 발생했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

