# LeagueRankAPIApi

All URIs are relative to *https://grav-it.inuappcenter.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getLeagueRanking**](#getleagueranking) | **GET** /api/v1/ranking/leagues/{leagueId}/page/{pageNum} | 티어(리그)별 유저 랭킹 조회 (페이지)|
|[**getLeagueRankingByUser**](#getleaguerankingbyuser) | **GET** /api/v1/ranking/user-leagues/page/{pageNum} | 내 리그 기준 유저 랭킹 조회 (페이지)|

# **getLeagueRanking**
> Array<LeagueRankRow> getLeagueRanking()

특정 리그의 랭킹을 페이지 단위로 조회합니다.<br> - `pageNum`은 0부터 시작하는 페이지 번호(0-based)입니다.<br> 🔐 <strong>다음 페이지가 존재하면 hasNextPage 가 true, 없으면 false</strong><br> 

### Example

```typescript
import {
    LeagueRankAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LeagueRankAPIApi(configuration);

let leagueId: number; //리그 ID (default to undefined)
let pageNum: number; //페이지 번호 (0-based) (default to undefined)

const { status, data } = await apiInstance.getLeagueRanking(
    leagueId,
    pageNum
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **leagueId** | [**number**] | 리그 ID | defaults to undefined|
| **pageNum** | [**number**] | 페이지 번호 (0-based) | defaults to undefined|


### Return type

**Array<LeagueRankRow>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |
|**400** | 잘못된 요청 파라미터 |  -  |
|**404** | 리그를 찾을 수 없음 |  -  |
|**500** | 서버 내부 에러 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getLeagueRankingByUser**
> Array<LeagueRankRow> getLeagueRankingByUser()

인증된 사용자의 현재 리그를 기준으로 랭킹을 페이지 단위로 조회합니다. - `pageNum`은 0부터 시작하는 페이지 번호(0-based)입니다. <br> 🔐 <strong>Jwt 필요</strong><br> 🔐 <strong>다음 페이지가 존재하면 hasNextPage 가 true, 없으면 false</strong><br> 

### Example

```typescript
import {
    LeagueRankAPIApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LeagueRankAPIApi(configuration);

let pageNum: number; //페이지 번호 (0-based) (default to undefined)

const { status, data } = await apiInstance.getLeagueRankingByUser(
    pageNum
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNum** | [**number**] | 페이지 번호 (0-based) | defaults to undefined|


### Return type

**Array<LeagueRankRow>**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 조회 성공 |  -  |
|**401** | 인증 실패 |  -  |
|**404** | 사용자 또는 리그를 찾을 수 없음 |  -  |
|**500** | 서버 내부 에러 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

