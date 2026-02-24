import { test, expect } from '@playwright/test'

test.describe('메모 앱 주요 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('페이지 로드 및 헤더 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /메모 앱/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /새 메모/ })).toBeVisible()
  })

  test('메모 생성 (Create)', async ({ page }) => {
    await page.getByRole('button', { name: /새 메모/ }).click()

    await expect(page.getByText('새 메모 작성')).toBeVisible()

    await page.getByPlaceholder('메모 제목을 입력하세요').fill('E2E 테스트 메모')
    await page.locator('.w-md-editor-text-input').fill('마크다운 내용\n- 항목1\n- 항목2')
    await page.getByLabel('카테고리').selectOption('work')

    await page.getByRole('button', { name: '저장하기' }).click()

    await expect(page.getByText('E2E 테스트 메모')).toBeVisible()
    await expect(page.getByText('마크다운 내용')).toBeVisible()
  })

  test('메모 상세 보기 (Read)', async ({ page }) => {
    const firstMemoCard = page.locator('[class*="shadow-md"]').first()
    await firstMemoCard.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: '편집' })).toBeVisible()
    await expect(dialog.getByRole('button', { name: '삭제' })).toBeVisible()
  })

  test('상세 모달 - ESC로 닫기', async ({ page }) => {
    const firstMemoCard = page.locator('[class*="shadow-md"]').first()
    await firstMemoCard.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('상세 모달 - 배경 클릭으로 닫기', async ({ page }) => {
    const firstMemoCard = page.locator('[class*="shadow-md"]').first()
    await firstMemoCard.click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('메모 검색', async ({ page }) => {
    await page.getByPlaceholder('메모 검색...').fill('테스트')
    await page.waitForTimeout(300)
    const memos = page.locator('[class*="shadow-md"]')
    const count = await memos.count()
    if (count > 0) {
      await expect(memos.first()).toContainText('테스트')
    }
  })

  test('카테고리 필터', async ({ page }) => {
    await page.locator('select').filter({ has: page.locator('option[value="work"]') }).selectOption('work')
    await page.waitForTimeout(300)
    const memos = page.locator('[class*="shadow-md"]')
    const count = await memos.count()
    if (count > 0) {
      await expect(memos.first()).toContainText('업무')
    }
  })

  test('메모 편집 (Update)', async ({ page }) => {
    const firstMemoCard = page.locator('[class*="shadow-md"]').first()
    await firstMemoCard.click()

    await page.getByRole('dialog').getByRole('button', { name: '편집' }).click()

    await expect(page.getByText('메모 편집')).toBeVisible()
    const titleInput = page.getByPlaceholder('메모 제목을 입력하세요')
    await titleInput.clear()
    await titleInput.fill('수정된 제목')

    await page.getByRole('button', { name: '수정하기' }).click()

    await expect(page.getByText('수정된 제목')).toBeVisible()
  })

  test('메모 삭제 (Delete)', async ({ page }) => {
    page.on('dialog', dialog => dialog.accept())

    const firstMemoCard = page.locator('[class*="shadow-md"]').first()
    const memoTitle = await firstMemoCard.locator('h3').first().textContent()
    await firstMemoCard.click()

    await page.getByRole('dialog').getByRole('button', { name: '삭제' }).click()

    await expect(page.getByText(memoTitle || '')).not.toBeVisible()
  })
})
