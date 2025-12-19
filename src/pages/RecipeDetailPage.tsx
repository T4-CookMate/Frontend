// src/pages/RecipeDetailPage.tsx
import { useRef, useEffect, useMemo, useState, type RefObject } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Clock, Star, Play, Volume2 } from 'lucide-react'
import { BackButton } from '@components/search/BackButton'
import { unlockAudioOnce } from 'lib/audio/unlockAudio'

type RouteParams = {
  recipeId: string
}

// SearchPage에서 넘겨준 요약 정보 (없어도 동작하게)
type RecipeSummaryState = {
  name?: string
  time?: number
  level?: number
}

// 백엔드 상세 타입
type RecipeDetail = {
  recipeId: number
  name: string
  totalMinutes: number
  level: number
  tools: { id: number; name: string }[]
  ingredients: { id: number; name: string }[]
  steps: { id: number; stepIndex: number; instruction: string }[]
}

const Wrap = styled.main<{ scrolled: boolean }>`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;

  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 200px;
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #1B1B1B;
  padding: 0px 0px 16px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
`

const BackArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 16px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 700;
`

/** ✅ 스크린리더 전용 텍스트 */
const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

/** ✅ 바로가기(스킵 링크) 영역 */
const JumpRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 16px 12px;
`

const JumpButton = styled.button`
  border: 2px solid rgba(242, 201, 76, 0.7);
  background: transparent;
  color: #f2c94c;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`

const Section = styled.section``

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 16px;
`

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const InfoText = styled.span`
  font-size: 20px;
  font-weight: 600;
`

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #f2c94c;
  padding: 0 16px;
`

const PillList = styled.ul`
  list-style: none;
  margin: 0 0 16px;
  padding: 0 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const Pill = styled.li`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 14px;
`

const IngredientList = styled.ul`
  list-style: none;
  padding: 0 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const IngredientItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 12px 16px;
  font-size: 18px;
`

const StepList = styled.ol`
  list-style: none;
  padding: 0 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

/** ✅ StepItem을 실제로 포커스 가능하게 해서(탭/VO 탐색) 더 안정적으로 읽힘 */
const StepItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(242, 201, 76, 0.4);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:focus {
    outline: 3px solid rgba(242, 201, 76, 0.8);
    outline-offset: 2px;
  }
`

const StepNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #f2c94c;
`

const StepText = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.6;
`

const BottomBar = styled.section`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 375px;
  background: #1B1B1B;
  padding: 16px 24px 24px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const PrimaryButton = styled.button`
  width: 100%;
  min-height: 64px;
  border-radius: 20px;
  border: none;
  background: #f2c94c;
  color: #1B1B1B;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const SecondaryButton = styled.button`
  width: 100%;
  min-height: 64px;
  border-radius: 20px;
  border: 3px solid #f2c94c;
  background: #1B1B1B;
  color: #f2c94c;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
`

const MessageText = styled.p`
  margin: 8px 24px 0;
  font-size: 16px;
`

const SrOnlyTitle = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

export default function RecipeDetailPage() {
  const { recipeId } = useParams<RouteParams>()
  const navigate = useNavigate()

  const location = useLocation()
  const summary = (location.state ?? {}) as RecipeSummaryState

  const [detail, setDetail] = useState<RecipeDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [scrolled, setScrolled] = useState(false)

  const entryRef = useRef<HTMLHeadingElement>(null)

  /** ✅ 섹션 포커스 이동용 ref */
  const ingredientsRef = useRef<HTMLHeadingElement>(null)
  const stepsRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      entryRef.current?.focus()
    }, 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!recipeId) return

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
          `https://43.200.235.175.nip.io/recipes/${recipeId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (!res.data.isSuccess) {
          setError(res.data.message ?? '레시피 상세 조회에 실패했습니다.')
          return
        }

        setDetail(res.data.result as RecipeDetail)
      } catch (e: any) {
        console.error('레시피 상세 조회 오류:', e)
        setError(
          e?.response?.data?.message ?? '레시피 상세 조회 중 오류가 발생했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [recipeId])

  const displayName = detail?.name ?? summary.name ?? '레시피'
  const displayMinutes = detail?.totalMinutes ?? summary.time
  const displayLevel = detail?.level ?? summary.level

  const sortedSteps = useMemo(
    () =>
      detail?.steps?.slice().sort((a, b) => a.stepIndex - b.stepIndex) ?? [],
    [detail],
  )

  const handleStartCooking = async () => {
    await unlockAudioOnce()
    navigate('/cook', {
      state: { recipeId: Number(recipeId), recipeName: displayName },
    })
  }

  const jumpTo = (ref: RefObject<HTMLElement> | { current: HTMLElement | null }) => {
  const el = ref.current
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // iOS에서 포커스 씹히는 경우 대비
    setTimeout(() => el.focus(), 200)
    setTimeout(() => el.focus(), 600)
  }


  return (
    <Wrap scrolled={scrolled} aria-labelledby="recipe-entry-title">
      <SrOnlyTitle id="recipe-entry-title" ref={entryRef} tabIndex={-1}>
        {displayName} 레시피 상세 화면입니다.
      </SrOnlyTitle>

      {/* Header */}
      <Header>
        <HeaderRow>
          <BackArea>
            <BackButton label="뒤로가기" onClick={() => navigate(-1)} />
          </BackArea>
        </HeaderRow>
        <Title>{displayName}</Title>

        {/* 섹션 바로가기 */}
        <JumpRow aria-label="섹션 바로가기">
          <JumpButton type="button" onClick={() => jumpTo(ingredientsRef)}>
            재료로 이동
          </JumpButton>
          <JumpButton type="button" onClick={() => jumpTo(stepsRef)}>
            조리 순서로 이동
          </JumpButton>
        </JumpRow>
      </Header>

      {/* 기본 정보 */}
      <Section
        role="group"
        aria-label={`조리 시간 ${displayMinutes ?? '정보 없음'}분, 난이도 ${displayLevel ?? '정보 없음'}`}
      >
        {/* 시각 표현용은 숨기되, 그룹 aria-label로 한 번에 읽히게 */}
        <InfoRow aria-hidden="true">
          {displayMinutes != null && (
            <InfoItem>
              <Clock aria-hidden="true" />
              <InfoText>{displayMinutes}분</InfoText>
            </InfoItem>
          )}
          {displayLevel != null && (
            <InfoItem>
              <Star aria-hidden="true" />
              <InfoText>{displayLevel}</InfoText>
            </InfoItem>
          )}
        </InfoRow>
      </Section>

      {/* 로딩 / 에러 */}
      {loading && (
        <MessageText aria-live="polite">레시피를 불러오는 중이에요...</MessageText>
      )}

      {error && (
        <MessageText aria-live="assertive" style={{ color: 'tomato' }}>
          {error}
        </MessageText>
      )}

      {/* 상세 정보 */}
      {detail && !loading && !error && (
        <>
          {detail.tools && detail.tools.length > 0 && (
            <Section aria-labelledby="tools-title">
              <SectionTitle id="tools-title">필요 도구</SectionTitle>
              <PillList>
                {detail.tools.map(tool => (
                  <Pill key={tool.id}>{tool.name}</Pill>
                ))}
              </PillList>
            </Section>
          )}

          {/* ✅ 재료 섹션 */}
          <Section aria-labelledby="ingredients-title" aria-describedby="ingredients-count">
            <SrOnly id="ingredients-count">
              총 {detail.ingredients?.length ?? 0}개 재료가 있습니다.
            </SrOnly>

            <SectionTitle
              id="ingredients-title"
              ref={ingredientsRef}
              tabIndex={-1}
            >
              재료
            </SectionTitle>

            <IngredientList>
              {detail.ingredients.length > 0 ? (
                detail.ingredients.map(ing => (
                  <IngredientItem key={ing.id}>{ing.name}</IngredientItem>
                ))
              ) : (
                <IngredientItem>등록된 재료가 없습니다.</IngredientItem>
              )}
            </IngredientList>
          </Section>

          {/* ✅ 조리 순서 섹션 */}
          <Section aria-labelledby="steps-title" aria-describedby="steps-count">
            <SrOnly id="steps-count">총 {sortedSteps.length}단계입니다.</SrOnly>

            <SectionTitle
              id="steps-title"
              ref={stepsRef}
              tabIndex={-1}
            >
              조리 순서
            </SectionTitle>

            <StepList>
              {sortedSteps.length > 0 ? (
                sortedSteps.map(step => (
                  <StepItem
                    key={step.id}
                    tabIndex={0}  // ✅ 포커스 가능 → VO 탐색/터치 안정
                    aria-label={`${step.stepIndex}단계. ${step.instruction}`}
                  >
                    {/* ✅ 이제 숨기지 말고 그대로 보여/읽히게 */}
                    <StepNumber>{step.stepIndex}단계</StepNumber>
                    <StepText>{step.instruction}</StepText>
                  </StepItem>
                ))
              ) : (
                <StepItem tabIndex={0} aria-label="등록된 조리 순서가 없습니다.">
                  <StepText>등록된 조리 순서가 없습니다.</StepText>
                </StepItem>
              )}
            </StepList>
          </Section>
        </>
      )}

      {/* 하단 액션 */}
      <BottomBar aria-label="레시피 액션">
        <PrimaryButton aria-label="해당 레시피로 요리 시작하기" onClick={handleStartCooking}>
          <Play size={28} strokeWidth={3} aria-hidden="true" />
          <span>요리 시작하기</span>
        </PrimaryButton>

        <SecondaryButton
          type="button"
          aria-label="음성으로 조리 순서 듣기"
          onClick={() => console.log('음성으로 조리 순서 듣기')}
        >
          <Volume2 size={28} strokeWidth={3} aria-hidden="true" />
          <span>음성으로 조리 순서 듣기</span>
        </SecondaryButton>
      </BottomBar>
    </Wrap>
  )
}
