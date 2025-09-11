# Gravit Web V2 Frontend Style Guide
## Vite + TypeScript + React + TanStack Router + TanStack Query + Zustand + Tailwind CSS (AI 코드리뷰 최적화)

# Introduction
이 스타일 가이드는 Gravit Web V2 프로젝트에서 사용하는 프론트엔드 코드의 규칙을 정의합니다. Feature-Sliced Design(FSD) 아키텍처와 AI 코드리뷰 도구, 특히 한국어 리뷰에 최적화되어 있습니다.

# Key Principles
* **Type Safety:** TypeScript의 타입 시스템을 최대한 활용
* **Feature-Sliced Design:** 기능별로 구조화된 아키텍처
* **Component Reusability:** 재사용 가능한 컴포넌트 설계
* **Performance:** 번들 크기와 렌더링 성능 최적화
* **Maintainability:** 유지보수하기 쉬운 코드 작성
* **AI-Friendly:** AI 리뷰어가 이해하기 쉬운 구조와 주석

# AI 코드리뷰 최적화 지침

## 한국어 리뷰를 위한 가이드라인
* **비즈니스 로직 설명:** 복잡한 상태 관리나 비즈니스 규칙은 한국어 주석으로 설명
* **컴포넌트 의도 명시:** 컴포넌트의 역할과 책임을 JSDoc으로 명확히 기술
* **API 연동 로직:** 외부 API 호출 시 예상 응답과 에러 처리 방식 설명
* **성능 고려사항:** 메모이제이션이나 지연 로딩 등의 최적화 이유 명시

# Project Structure (Feature-Sliced Design)

## FSD 아키텍처 개요
Feature-Sliced Design은 계층(Layer), 슬라이스(Slice), 세그먼트(Segment) 구조로 구성됩니다.

```
src/
├── shared/             # 공통 계층 (재사용 가능한 코드)
│   ├── ui/            # 기본 UI 컴포넌트 (Button, Input, Modal 등)
│   ├── lib/           # 외부 라이브러리 설정 및 유틸리티
│   ├── api/           # API 기본 설정 (axios instance 등)
│   ├── config/        # 앱 설정 (환경변수, 상수)
│   └── types/         # 공통 TypeScript 타입 정의
│
├── entities/           # 엔티티 계층 (비즈니스 엔티티)
│   ├── user/          # 사용자 엔티티
│   │   ├── model/     # 상태 관리 (zustand store)
│   │   ├── api/       # API 호출 함수
│   │   ├── lib/       # 비즈니스 로직
│   │   └── types/     # 타입 정의
│   └── product/       # 상품 엔티티 (예시)
│
├── features/           # 기능 계층 (사용자 시나리오)
│   ├── auth/          # 인증 관련 기능
│   │   ├── login/     # 로그인 기능
│   │   │   ├── ui/    # 로그인 폼 컴포넌트
│   │   │   ├── model/ # 로그인 상태 관리
│   │   │   └── lib/   # 로그인 로직
│   │   └── logout/    # 로그아웃 기능
│   └── profile/       # 프로필 관련 기능
│
├── widgets/            # 위젯 계층 (완전한 UI 블록)
│   ├── header/        # 헤더 위젯
│   ├── sidebar/       # 사이드바 위젯
│   └── footer/        # 푸터 위젯
│
├── pages/              # 페이지 계층
│   ├── home/          # 홈 페이지
│   ├── profile/       # 프로필 페이지
│   └── login/         # 로그인 페이지
│
├── app/                # 앱 계층 (앱 설정 및 프로바이더)
│   ├── providers/     # Context Providers (TanStack Query, Router 등)
│   ├── store/         # 전역 상태 설정
│   ├── router/        # TanStack Router 설정
│   └── styles/        # 글로벌 스타일 (Tailwind CSS 설정)
│
└── vite-env.d.ts      # Vite 환경 타입 정의
```

## FSD 계층별 규칙



### 핵심 원칙
#### 의존성 방향
- **상위 → 하위**: App → Pages → Widgets → Features → Entities → Shared
- **금지**: 하위 계층이 상위 계층을 참조하는 것
- **같은 계층 간**: 직접적인 의존성 금지

#### 관심사 분리
- **Entities**: "무엇을" - 데이터 자체의 표현
- **Features**: "어떻게/왜" - 특정 맥락에서의 행동과 흐름  
- **Widgets**: "어디에/어떤 구조로" - 화면 구획의 구성과 배치

---

### 1. Shared Layer
#### 목적
프로젝트 전반에서 재사용되는 범용적이고 비즈니스 로직이 없는 코드

#### 규칙
- ✅ **모든 계층에서 사용 가능**
- ✅ **비즈니스 로직 완전 금지**
- ✅ **프로젝트 독립적인 코드만 포함**
- ✅ **외부 의존성 없음** (다른 FSD 계층 참조 금지)

#### 포함 요소
```typescript
// UI 컴포넌트 (순수 UI)
<Button>, <Input>, <Modal>

// 유틸리티 함수
formatDate(), debounce(), validateEmail()

// 공통 상수
API_ENDPOINTS, VALIDATION_RULES

// 타입 정의
ApiResponse<T>, BaseEntity
```

---

### 2. Entities Layer
#### 목적
비즈니스 엔티티의 순수한 데이터 표현과 기본 연산

#### 규칙
- ✅ **데이터 중심의 순수한 표현에 집중**
- ✅ **엔티티 간 직접 의존성 금지** (User → Product ❌)
- ✅ **기본 CRUD와 데이터 변환 로직만 포함**
- ✅ **비즈니스 플로우나 사용자 시나리오 로직 금지**
- ✅ **DTO ↔ Entity 변환 담당**

#### 책임 범위
```typescript
// ✅ 적절한 예시
interface Product {
  id: string;
  name: string;
  price: number;
}

const toProduct = (dto: ProductDTO): Product => { ... }
const calculateDiscountedPrice = (product: Product, rate: number) => { ... }

// ❌ 부적절한 예시 - 비즈니스 플로우
const addProductToCart = (product: Product, cart: Cart) => { ... } // → Features로
```

---

### 3. Features Layer
#### 목적
사용자의 완전한 행동 시나리오를 한 곳에서 관리

### 규칙
- ✅ **사용자 행동의 완전한 흐름 담당** (입력 → 처리 → 결과)
- ✅ **Features 간 직접 의존성 엄격 금지**
- ✅ **특정 맥락에서의 엔티티 활용**
- ✅ **독립적인 기능 단위로 개발 및 테스트 가능**
- ✅ **재사용 가능한 비즈니스 로직 제공**

#### 상호작용 규칙
```typescript
// ❌ Feature 간 직접 의존
import { searchProducts } from '../product-search'

// ✅ 이벤트나 상태를 통한 간접 통신
eventBus.emit('product-selected', productId)
// 또는 상위 계층(Widget/Page)에서 조율
```

#### 내부 구조
```
/features/product-search/
  ├── ui/           # 기능별 UI 컴포넌트
  ├── model/        # 상태 관리 및 비즈니스 로직
  ├── api/          # 해당 기능의 API 호출
  └── index.ts      # 공개 인터페이스
```

---

### 4. Widgets Layer
#### 목적
페이지 내 의미있는 화면 구획을 독립적인 컴포넌트로 구성

#### 규칙
- ✅ **화면 구획의 구성과 배치에 집중**
- ✅ **여러 Features를 조합하여 응집력 있는 UI 블록 제공**
- ✅ **페이지 간 재사용 가능한 화면 단위**
- ✅ **독립적인 데이터 로딩 및 상태 관리**
- ✅ **Features 간 상호작용 조율 역할**

#### 책임 범위
```typescript
// ✅ 적절한 Widget 예시
function ProductShowcase({ title, productIds }) {
  // 여러 기능을 조합하여 하나의 화면 구획 완성
  return (
    <section>
      <ShowcaseHeader title={title} />
      <ProductGrid productIds={productIds} />
      <ViewMoreButton />
    </section>
  );
}
```

---

### 5. Pages Layer
#### 목적
라우팅 진입점이자 Widgets와 Features의 최종 조합체

#### 규칙
- ✅ **라우팅과 직접 연결되는 컴포넌트**
- ✅ **페이지 레벨의 레이아웃과 템플릿 구성**
- ✅ **Widgets 조합을 통한 페이지 구성**
- ✅ **라우팅 파라미터 처리 및 전달**
- ✅ **페이지별 SEO 및 메타데이터 관리**

#### 역할
```typescript
function ProductDetailPage() {
  const { productId } = useParams();
  
  return (
    <PageLayout>
      <ProductImageGallery productId={productId} />
      <ProductInfoBoard productId={productId} />
      <ReviewListSection productId={productId} />
    </PageLayout>
  );
}
```

---

### 6. App Layer
#### 목적
애플리케이션 전체의 초기화와 글로벌 설정

#### 규칙
- ✅ **앱 레벨 프로바이더 설정** (Theme, Auth, Store)
- ✅ **라우터 구성 및 설정**
- ✅ **글로벌 에러 바운더리**
- ✅ **앱 초기화 로직**
- ✅ **환경 설정 및 외부 서비스 연결**



# TypeScript 가이드라인

## 타입 정의
* **인터페이스 우선:** `interface` 사용을 기본으로, 확장이 불가능한 경우만 `type` 사용
* **제네릭 활용:** 재사용성을 위해 적절한 제네릭 사용
* **Strict Mode:** `tsconfig.json`에서 strict 모드 활성화

```typescript
// ✅ 좋은 예시
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ✅ 비즈니스 로직이 복잡한 경우 한국어 설명 추가
interface OrderCalculation {
  basePrice: number;        // 기본 가격
  discountAmount: number;   // 할인 금액 (쿠폰, 적립금 등)
  taxAmount: number;        // 세금
  shippingFee: number;      // 배송비
  finalPrice: number;       // 최종 결제 금액
}
```

## 네이밍 컨벤션

* **컴포넌트:** PascalCase (`UserProfile`, `ProductCard`)
* **함수/변수:** camelCase (`getUserData`, `isLoading`)
* **상수:** UPPER_SNAKE_CASE (`API_ENDPOINTS`, `DEFAULT_TIMEOUT`)
* **타입/인터페이스:** PascalCase (`User`, `ApiResponse`)
* **파일명:** kebab-case (`user-profile.tsx`, `api-client.ts`)

# React 컴포넌트 가이드라인

## 함수형 컴포넌트
* **함수 선언식 사용:** `function` 키워드 사용 권장
* **Props 타입 정의:** 모든 컴포넌트에 Props 인터페이스 정의
* **기본값 설정:** 선택적 props에 대한 기본값 명시

```typescript
/**
 * 사용자 프로필 카드 컴포넌트
 * 
 * 사용자 기본 정보와 상태를 표시하며, 프로필 수정 모달을 열 수 있습니다.
 * 관리자 권한이 있는 경우 추가 액션 버튼이 표시됩니다.
 */
interface UserProfileCardProps {
  user: User;
  isEditable?: boolean;
  onEdit?: (userId: string) => void;
  className?: string;
}

function UserProfileCard({ 
  user, 
  isEditable = false, 
  onEdit,
  className = '' 
}: UserProfileCardProps) {
  // 컴포넌트 로직...
  
  return (
    <div className={`user-profile-card ${className}`}>
      {/* JSX 내용 */}
    </div>
  );
}

export default UserProfileCard;
```

## 훅 사용 가이드라인
* **커스텀 훅:** `use` 접두사 사용
* **의존성 배열:** useEffect, useMemo 등에서 의존성 명시적 관리
* **에러 처리:** 비동기 작업에서 에러 상태 관리

```typescript
/**
 * 사용자 데이터를 가져오고 관리하는 커스텀 훅
 * 
 * 사용자 정보 조회, 업데이트, 삭제 기능을 제공하며
 * 로딩 상태와 에러 처리를 포함합니다.
 */
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await userService.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError('사용자 정보를 불러오는데 실패했습니다.');
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId, fetchUser]);

  return { user, isLoading, error, refetch: fetchUser };
}
```

# 상태 관리
* **로컬 상태:** `useState` 사용
* **복잡한 로컬 상태:** `useReducer` 고려
* **전역 상태:** Zustand (설치된 상태)
* **서버 상태:** TanStack Query (설치된 상태)
* **라우팅 상태:** TanStack Router (설치된 상태)

```typescript
// Zustand 스토어 예시
interface UserStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      localStorage.setItem('accessToken', token);
      
      set({ 
        currentUser: user, 
        isAuthenticated: true 
      });
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ currentUser: null, isAuthenticated: false });
  },
}));
```

# API 호출 및 에러 처리

<!-- * **axios 인스턴스:** 기본 설정과 인터셉터 활용
* **에러 타입 정의:** API 에러에 대한 타입 정의
* **로딩 상태 관리:** 일관된 로딩 상태 처리

```typescript
// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터 - 인증 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 시 자동 로그아웃 처리
    if (error.response?.status === 401) {
      useUserStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API 서비스 예시
export const userService = {
  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },
};
``` -->

# 스타일링 가이드라인 (Tailwind CSS)
* **Tailwind CSS:** 메인 스타일링 프레임워크 (설치된 상태)
* **유틸리티 클래스:** 일관성 있는 클래스명 사용
* **반응형 디자인:** 모바일 우선 접근법
* **커스텀 테마:** 프로젝트에 맞는 테마 변수 활용

```typescript
// Tailwind CSS 사용 예시
interface CardProps {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

function Card({ variant = 'primary', className = '', children }: CardProps) {
  const baseClasses = 'p-4 rounded-lg shadow-sm md:p-6';
  const variantClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-white border border-gray-200 text-gray-900'
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
```

<!-- # 테스팅 가이드라인
* **Vitest:** 단위 테스트 프레임워크
* **React Testing Library:** 컴포넌트 테스트
* **테스트 네이밍:** `describe`와 `it`에 한국어 사용 가능

```typescript
describe('UserProfileCard 컴포넌트', () => {
  it('사용자 정보를 올바르게 표시해야 한다', () => {
    const mockUser = {
      id: '1',
      name: '홍길동',
      email: 'hong@example.com',
      createdAt: new Date(),
    };

    render(<UserProfileCard user={mockUser} />);
    
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
  });

  it('편집 가능한 경우 수정 버튼이 표시되어야 한다', () => {
    const mockUser = { /* ... */ };
    const onEdit = vi.fn();

    render(<UserProfileCard user={mockUser} isEditable onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /수정/ });
    expect(editButton).toBeInTheDocument();
  });
});
``` -->

# 성능 최적화
* **React.memo:** 불필요한 리렌더링 방지
* **useMemo/useCallback:** 계산 비용이 높은 연산 메모이제이션
* **코드 스플리팅:** `React.lazy`와 `Suspense` 활용
* **번들 최적화:** Vite의 번들 분석 활용

```typescript
// 메모이제이션 예시
const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({ data, filters }) => {
  // 복잡한 필터링 로직 - 메모이제이션으로 최적화
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 복잡한 필터링 로직...
      return filters.every(filter => filter.apply(item));
    });
  }, [data, filters]);

  const handleItemClick = useCallback((itemId: string) => {
    // 클릭 핸들러 로직...
  }, []);

  return (
    <div>
      {filteredData.map(item => (
        <Item 
          key={item.id} 
          data={item} 
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

// 지연 로딩 예시
const LazyAdminPanel = React.lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={<div>관리자 페이지 로딩 중...</div>}>
              <LazyAdminPanel />
            </Suspense>
          } 
        />
      </Routes>
    </Router>
  );
}
```

<!-- # 보안 고려사항
* **XSS 방지:** `dangerouslySetInnerHTML` 사용 시 주의
* **CSRF 토큰:** API 요청에 CSRF 보호 적용
* **환경변수:** 민감한 정보는 서버사이드에서만 처리

```typescript
// 환경변수 타입 정의
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_VERSION: string;
  // 주의: VITE_ 접두사가 있는 환경변수는 클라이언트에 노출됩니다
  // 민감한 정보는 서버사이드에서만 사용하세요
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

# TanStack Router 라우팅 가이드라인

```typescript
// 라우트 정의 예시 (src/app/router/routes.tsx)
import { createRoute, createRootRoute } from '@tanstack/react-router';
import { HomePage } from '../../pages/home';
import { ProfilePage } from '../../pages/profile';

const rootRoute = createRootRoute({
  component: () => <div>Root Layout</div>
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: ProfilePage,
  loader: ({ params }) => {
    // 페이지 로드 전 데이터 준비
    return { userId: params.userId };
  }
});

export const routeTree = rootRoute.addChildren([homeRoute, profileRoute]);
``` -->

# TanStack Query 서버 상태 관리

```typescript
// API 쿼리 훅 예시 (entities/user/api/useUserQuery.ts)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../../shared/api';

export const userQueryKeys = {
  all: ['users'] as const,
  byId: (id: string) => [...userQueryKeys.all, id] as const,
};

export function useUser(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.byId(userId),
    queryFn: () => userService.getUser(userId),
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!userId
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userService.updateUser,
    onSuccess: (updatedUser) => {
      // 캐시 업데이트
      queryClient.setQueryData(
        userQueryKeys.byId(updatedUser.id),
        updatedUser
      );
      
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.all
      });
    }
  });
}
```

# 코드 품질 도구 설정 (Biome)

프로젝트에서 사용하는 Biome 설정에 맞춰 코드를 작성합니다:
<!-- 
```json
// biome.json 설정 예시
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "style": {
        "useConst": "error",
        "useTemplate": "error"
      },
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

사용 가능한 스크립트: -->
- `pnpm format`: Biome으로 코드 포맷팅
- `pnpm lint`: Biome 및 ESLint로 린팅 검사
- `pnpm ci`: CI 환경에서 코드 검사

# 파일 네이밍 규칙

## FSD 구조에서의 파일 네이밍
```
entities/user/
├── index.ts              # Public API 노출
├── model/
│   └── user-store.ts     # Zustand 스토어
├── api/
│   └── user-service.ts   # API 호출 함수
├── lib/
│   └── user-utils.ts     # 비즈니스 로직 유틸리티
└── types/
    └── user-types.ts     # 타입 정의

features/auth/login/
├── index.ts              # 기능 Export
├── ui/
│   ├── login-form.tsx    # 로그인 폼 컴포넌트
│   └── login-button.tsx  # 로그인 버튼
├── model/
│   └── login-store.ts    # 로그인 상태 관리
└── lib/
    └── login-validation.ts # 로그인 검증 로직
```

## 컴포넌트 Export 패턴
```typescript
// index.ts에서 Public API 정의
export { LoginForm } from './ui/login-form';
export { useLogin } from './model/login-store';
export type { LoginCredentials } from './types';

// 사용하는 곳에서
import { LoginForm, useLogin } from '~/features/auth/login';
```