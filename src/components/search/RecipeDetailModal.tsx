// src/components/search/RecipeDetailModal.tsx
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Modal } from '@components/Modal'
import type { Recipe } from 'data/recipes'

type Props = {
  recipe: Recipe | null
  related: Recipe[]
  onClose: () => void
  onStartCooking: (recipe: Recipe) => void
}

// 백엔드에서 내려주는 상세 타입
type RecipeDetail = {
  recipeId: number
  name: string
  totalMinutes: number
  level: number
  tools: { id: number; name: string }[]
  ingredients: { id: number; name: string }[]
  steps: { id: number; stepIndex: number; instruction: string }[]
}

// ===== Styled Components =====
const Card = styled.div`
  width: 353px;
  height: 620px;
  border-radius: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 16px;
  box-sizing: border-box;
  position: relative;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #222;
`

const Meta = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #666;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #eee;
  margin: 12px 0;
`

const SectionTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #222;
`

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
`

const TextRow = styled.p`
  margin: 0 0 4px;
  font-size: 13px;
  color: #444;
`

const BottomArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
`

const StartButton = styled.button`
  width: 304px;
  height: 64px;
  border-radius: 20px;
  border: none;
  background: #f3c11b;
  color: #222;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`

export function RecipeDetailModal({
  recipe,
  // related,
  onClose,
  onStartCooking,
}: Props) {
  const [detail, setDetail] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 모달 열릴 때마다 상세 조회
  useEffect(() => {
    if (!recipe) {
      setDetail(null)
      return
    }

    const fetchDetail = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('로그인이 필요합니다.')
        return
      }

      try {
        setLoading(true)
        setError(null)

        const res = await axios.get(
          `http://43.200.235.175:8080/recipes/${recipe.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!res.data.isSuccess) {
          setError(res.data.message ?? '레시피 상세 조회에 실패했습니다.')
          return
        }

        setDetail(res.data.result as RecipeDetail)
      } catch (e: any) {
        console.error('레시피 상세 조회 오류:', e)
        setError(
          e?.response?.data?.message ??
            '레시피 상세 조회 중 오류가 발생했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [recipe])

  if (!recipe) return null

  const display = detail ?? null

  return (
    <Modal onClose={onClose}>
      <Card>
        <HeaderRow>
          <div>
            <Title>{display?.name ?? recipe.name}</Title>
            {display && (
              <Meta>
                ⏱ {display.totalMinutes}분 · 난이도 {display.level}
              </Meta>
            )}
          </div>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </HeaderRow>

        <Divider />

        <ScrollArea>
          {loading && <TextRow>불러오는 중...</TextRow>}
          {error && <TextRow style={{ color: 'red' }}>{error}</TextRow>}

          {display && !loading && !error && (
            <>
              {/* 필요 도구 */}
              {display.tools && display.tools.length > 0 && (
                <>
                  <SectionTitle>필요 도구</SectionTitle>
                  {display.tools.map(tool => (
                    <TextRow key={tool.id}>• {tool.name}</TextRow>
                  ))}
                  <Divider />
                </>
              )}

              {/* 재료 */}
              <SectionTitle>재료</SectionTitle>
              {display.ingredients.length > 0 ? (
                display.ingredients.map(ing => (
                  <TextRow key={ing.id}>• {ing.name}</TextRow>
                ))
              ) : (
                <TextRow>등록된 재료가 없습니다.</TextRow>
              )}

              <Divider />

              {/* 조리 순서 */}
              <SectionTitle>조리 순서</SectionTitle>
              {display.steps
                .slice()
                .sort((a, b) => a.stepIndex - b.stepIndex)
                .map(step => (
                  <TextRow key={step.id}>
                    {step.stepIndex}. {step.instruction}
                  </TextRow>
                ))}
            </>
          )}
        </ScrollArea>

        <BottomArea>
          <StartButton
            onClick={() => {
              if (display) {
                // 필요하면 detail 정보도 같이 넘기는 방향으로 변경 가능
              }
              onStartCooking(recipe)
            }}
          >
            해당 레시피로 요리 시작하기
          </StartButton>
        </BottomArea>
      </Card>
    </Modal>
  )
}
