-- memos 테이블 생성 (Memo 인터페이스 매핑)
CREATE TABLE IF NOT EXISTS memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  summary TEXT
);

-- RLS 활성화 (개발 단계: 인증 없이 모든 작업 허용)
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 CRUD 허용 (anon 키로 접근 가능)
CREATE POLICY "Allow all operations for anon" ON memos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- created_at 기준 내림차순 인덱스 (목록 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_memos_created_at ON memos (created_at DESC);
