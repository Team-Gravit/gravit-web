# MyPageAPIApi

All URIs are relative to *https://grav-it-dev.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getMyPageBanner**](#getmypagebanner) | **GET** /api/v1/my-pages/banners | 마이페이지 배너 조회|
|[**getMyPageLearning**](#getmypagelearning) | **GET** /api/v1/my-pages/learning | 마이페이지 학습 정보 조회|
|[**getMyPageLearningHistory**](#getmypagelearninghistory) | **GET** /api/v1/my-pages/learning/history | 마이페이지 학습 이력 조회|
|[**getMyPageSummary**](#getmypagesummary) | **GET** /api/v1/my-pages/summaries | 마이페이지 학습 요약 조회|

# **getMyPageBanner**
> MyPageBannerResponse getMyPageBanner()

마이페이지 상단 배너 정보(프로필, 닉네임, 핸들, 레벨, 리그, 연속 학습일)를 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    MyPageAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MyPageAPIApi(configuration);

const { status, data } = await apiInstance.getMyPageBanner();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyPageBannerResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 마이페이지 배너 조회 성공 |  -  |
|**404** | 🚨 학습 정보 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyPageLearning**
> MyPageLearningResponse getMyPageLearning()

마이페이지 주간 리포트, TOP 챕터, 취약 개념을 한 번에 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    MyPageAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MyPageAPIApi(configuration);

const { status, data } = await apiInstance.getMyPageLearning();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyPageLearningResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 마이페이지 학습 정보 조회 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyPageLearningHistory**
> LearningHistoryResponse getMyPageLearningHistory()

지정한 연도의 일별 풀이 수와 피크 학습 시간을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    MyPageAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MyPageAPIApi(configuration);

let year: number; //조회할 연도 (default to undefined)

const { status, data } = await apiInstance.getMyPageLearningHistory(
    year
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **year** | [**number**] | 조회할 연도 | defaults to undefined|


### Return type

**LearningHistoryResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 마이페이지 학습 이력 조회 성공 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyPageSummary**
> MyPageSummaryResponse getMyPageSummary()

마이페이지 학습 요약, 올해 일별 학습 이력, 가입 연도부터 현재 연도까지의 조회 가능 연도 목록을 조회합니다<br>🔐 <strong>Jwt 필요</strong><br>

### Example

```typescript
import {
    MyPageAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MyPageAPIApi(configuration);

const { status, data } = await apiInstance.getMyPageSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**MyPageSummaryResponse**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | ✅ 마이페이지 학습 요약 조회 성공 |  -  |
|**404** | 🚨 유저 조회 실패 |  -  |
|**500** | 🚨 예기치 못한 예외 발생 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

