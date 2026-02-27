# Melbourne Cafe Map

## Project Overview
멜버른 카페를 카드 리스트 + Google Maps로 보여주는 웹앱.
메인(`/`)은 카드 그리드 리스트, `/map`은 전체화면 지도.
카드 클릭 시 상세 모달(사진, 이름, 주소, 태그, 노트, 링크) 표시.
향후 레스토랑 등 카테고리 확장 가능.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **DB & Storage**: Supabase (Postgres + Storage)
- **Map**: Google Maps (`@vis.gl/react-google-maps`)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deployment**: Vercel

## Key Architecture
- **No auth** — Public read, admin writes via `service_role` key
- **Admin pages** (`/admin/*`) — localhost에서만 접근 가능 (서버사이드 host 체크)
- **Supabase RLS**: SELECT은 `is_public = true`로 누구나, INSERT/UPDATE/DELETE는 service_role만
- **Multiple addresses**: 한 place가 여러 지점(주소)을 가질 수 있음 (`addresses` JSONB array)
- **Google/Instagram 링크**: DB에 저장 안 함, `name + address`로 프론트에서 동적 생성
- **next/image**: `next.config.ts`에 `**.supabase.co` remotePatterns 설정됨

## Route Structure
```
/              → 카드 그리드 리스트 (public, 카드 클릭 → 상세 모달)
/map           → 전체화면 지도 (public, 마커 + InfoWindow)
/admin         → 카페 관리 리스트 (localhost only)
/admin/new     → 새 카페 등록
/admin/[id]    → 카페 수정
```

## Key Components
```
components/
├── place-card.tsx              → 카드 컴포넌트 (이미지, 이름, 대표주소, +N locations 뱃지)
├── place-detail-modal.tsx      → 상세 모달 (사진, 전체 주소 리스트, 링크 버튼, View on Map)
├── search-filter-bar.tsx       → 검색 + 필터 (도시, 태그, 원두, 카테고리) — 모든 주소 검색
├── map/
│   ├── cafe-map.tsx            → 전체화면 지도 (place당 addresses 수만큼 마커 생성)
│   └── place-info-window.tsx   → 지도 InfoWindow 팝업 (마커별 주소 표시)
└── admin/
    ├── address-autocomplete.tsx → Google Places Autocomplete (APIProvider + useMapsLibrary 래핑)
    └── place-form.tsx           → 카페 등록/수정 폼 (복수 주소 입력 UI)
```

## Database: `places` Table
| Column | Type | Note |
|--------|------|------|
| id | UUID | PK, auto-generated |
| category | TEXT | 'cafe' (default), 'restaurant' 등 |
| city | TEXT | 'melbourne' (default), 'sydney', 'brisbane' |
| name | TEXT | 필수 |
| addresses | JSONB | `[{address, latitude, longitude}, ...]` — 복수 지점 지원 |
| image_url | TEXT | Supabase Storage public URL |
| instagram_url | TEXT | 선택 |
| reels_url | TEXT | 선택 |
| tiktok_url | TEXT | 선택 |
| coffee_by | TEXT | 로스터 이름 (선택) |
| tags | TEXT[] | e.g. ['cozy', 'filter-coffee', 'wifi'] |
| note_en | TEXT | 영문 메모 |
| note_ko | TEXT | 한국어 메모 |
| is_public | BOOLEAN | default true |

### `addresses` JSONB 구조
```typescript
type PlaceAddress = { address: string; latitude: number; longitude: number };
// addresses: PlaceAddress[] — 최소 1개 필수, addresses[0]이 대표 주소
```

## Supabase Clients
- `lib/supabase/client.ts` — 브라우저 (anon key, public read)
- `lib/supabase/server.ts` — 서버 컴포넌트 (anon key)
- `lib/supabase/admin.ts` — Admin 전용 (service_role key, 서버사이드만)

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY          # 서버사이드만, 절대 클라이언트 노출 금지
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY    # Maps JS API + Places API 활성화 필요
```

## Conventions
- Supabase `service_role` key는 `lib/supabase/admin.ts`에서만 사용
- Admin 페이지는 반드시 localhost 가드 적용 (`headers().get('host')` 체크)
- 이미지는 Supabase Storage `places` 버킷 (public)에 업로드
- Google Places Autocomplete는 Admin 주소 입력에서만 사용 (API 호출 최소화)
- `address-autocomplete.tsx`는 자체 `APIProvider`로 래핑 — `useMapsLibrary("places")`로 API 로드 대기
- 복수 주소: `place-form.tsx`에서 `AddressAutocomplete`를 주소 개수만큼 렌더, JSON.stringify로 전송
- 지도 마커: `cafe-map.tsx`에서 `places.flatMap(addresses)` → 개별 `MarkerData`로 변환
- 검색: `search-filter-bar.tsx`에서 `p.addresses.some(a => a.address.includes(q))`로 모든 주소 검색
- 데이터 수십 개 규모 — 페이지네이션/서버사이드 필터 불필요

---

## Development Checklist

### Phase 1: 프로젝트 초기화
- [x] Next.js 프로젝트 생성 (Tailwind v4)
- [x] shadcn/ui 초기화
- [x] 필요 패키지 설치 (supabase, google-maps)
- [x] 환경변수 템플릿 (.env.local.example)
- [x] Supabase 클라이언트 파일 생성
- [x] TypeScript 타입 정의
- [x] SQL 마이그레이션 파일 작성

### Phase 2: Supabase 세팅
- [ ] Supabase 프로젝트 생성
- [ ] places 테이블 생성 (마이그레이션 실행)
- [ ] RLS 정책 적용
- [ ] Storage 버킷 `places` 생성 (public)
- [ ] .env.local에 실제 키 입력

### Phase 3: Admin 페이지
- [x] Admin layout (localhost 가드)
- [ ] Admin 메인 — 카페 리스트 테이블
- [x] 카페 등록 폼 (이름, 주소, 사진, 인스타, 태그, 노트, 카테고리)
- [x] Google Places Autocomplete 연동 (주소 → lat/lng 자동 추출, APIProvider 래핑)
- [ ] 이미지 업로드 → Supabase Storage
- [ ] 카페 수정 페이지
- [ ] 카페 삭제 기능

### Phase 4: 메인 페이지 + 지도
- [x] 카드 그리드 리스트 메인 (`/`) — 반응형 1→2→3 col
- [x] 카드 클릭 → 상세 모달 (사진, 정보, 태그, 노트, 링크 버튼)
- [x] `/map` 전체화면 지도 페이지 분리
- [x] Google Maps 전체화면 렌더링
- [x] Supabase에서 places 데이터 fetch
- [x] 마커 표시 + InfoWindow 팝업
- [x] localhost일 때 "+ Admin" 버튼 → /admin
- [x] "View Map" / "Back to List" 네비게이션

### Phase 5: 마무리
- [ ] 반응형 대응 (모바일)
- [ ] Vercel 배포
- [ ] Google Maps API 키 제한 설정
