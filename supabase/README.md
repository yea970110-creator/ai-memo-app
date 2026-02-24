# Supabase 마이그레이션

## 테이블 생성

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 프로젝트 선택
2. **SQL Editor** 메뉴로 이동
3. `migrations/001_create_memos.sql` 파일 내용을 복사하여 실행

## 환경변수 설정

`.env.local`에 Supabase 프로젝트의 URL과 anon key를 설정하세요:

- **Project Settings** > **API**에서 확인
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon public key
