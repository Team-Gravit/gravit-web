# FriendSearchAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**search**](#search) | **GET** /api/v1/friends/search | 핸들&amp;닉네임 검색|

# **search**
> SliceResponse search()

사용자 핸들&닉네임 으로 팔로우 대상 검색을 수행합니다.<br> - (핸들의 경우) <br> - 입력이 \'@\' 부터 시작하면 handle 기반 조회를 시도합니다. <br> - 입력은 정규화됩니다: 선두 \'@\' 제거, 유니코드 정규화(NFKC), 소문자화, 허용 문자만 유지(소문자,숫자).<br> - 매칭 우선순위: 정확 일치 > 접두 일치 > 부분 일치.<br> - (닉네임의 경우) <br> - 입력이 문자(알파벳, 한글) 이나 숫자로 시작하면 nickname 기반 조회를 시도합니다 <br> - 입력은 정규화 됩니다. 유니코드 정규화(NFKC), 소문자화, 허용 문자만 유지(소문자, 한글, 숫자).<br> - 매칭 우선순위: 정확 일치 > 접두 일치 > 부분 일치.<br> 🔐 <strong>Jwt 필요</strong><br> 🔐 <strong>다음 페이지가 존재하면 hasNextPage 가 true, 없으면 false</strong><br> 

### Example

```typescript
import {
    FriendSearchAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendSearchAPIApi(configuration);

let queryText: string; //검색할 핸들 문자열 (선두 \'@\' 허용, 대소문자 무시) (default to undefined)
let page: number; //0부터 시작하는 페이지 인덱스 (optional) (default to 0)

const { status, data } = await apiInstance.search(
    queryText,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **queryText** | [**string**] | 검색할 핸들 문자열 (선두 \&#39;@\&#39; 허용, 대소문자 무시) | defaults to undefined|
| **page** | [**number**] | 0부터 시작하는 페이지 인덱스 | (optional) defaults to 0|


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
|**200** | ✅ 검색 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

