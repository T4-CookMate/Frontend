// src/pages/RecipeDetailPage.tsx
import { useRef, useEffect, useMemo, useState } from 'react'
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
  /* padding: 24px 0px; */
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


const Section = styled.section`
  /* padding: 24px; */
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
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
`

const PillList = styled.ul`
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
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
  padding: 0;
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
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* margin-bottom: 200px; */
`

const StepItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(242, 201, 76, 0.4);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
`;


export default function RecipeDetailPage() {
    const { recipeId } = useParams<RouteParams>()
    const navigate = useNavigate()

    const location = useLocation()
    const summary = (location.state ?? {}) as RecipeSummaryState

    const [detail, setDetail] = useState<RecipeDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [scrolled, setScrolled] = useState(false)

    const entryRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const t = setTimeout(() => {
          entryRef.current?.focus();
        }, 0);
        return () => clearTimeout(t);
      }, []);



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
          {
            headers: { Authorization: `Bearer ${token}` },
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
  }, [recipeId])

  // 화면에 보여줄 값 (detail 없으면 검색 카드에서 받은 값으로)
  const displayName = detail?.name ?? summary.name ?? '레시피'
  const displayMinutes = detail?.totalMinutes ?? summary.time
  const displayLevel = detail?.level ?? summary.level

  const sortedSteps = useMemo(
    () =>
      detail?.steps
        ?.slice()
        .sort((a, b) => a.stepIndex - b.stepIndex) ?? [],
    [detail],
  )

  const handleStartCooking = async () => {
  await unlockAudioOnce(); // 클릭 제스처에서 오디오 권한 확보
  navigate("/cook", {
    state: { 
      recipeId: Number(recipeId), 
      recipeName: displayName },
  });
};


  return (
    <Wrap scrolled={scrolled} aria-labelledby="recipe-entry-title">
      <SrOnlyTitle
        id="recipe-entry-title"
        ref={entryRef}
        tabIndex={-1}
      >
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
      </Header>

      {/* 기본 정보 */}
      <Section
        role="group"
        aria-label={`조리 시간 ${displayMinutes}분, 난이도 ${displayLevel}`}
      >
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
          <MessageText aria-live="polite">
            레시피를 불러오는 중이에요...
          </MessageText>
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

          <Section
            aria-labelledby="steps-title"
            aria-describedby="steps-count"
          >
            <span id="steps-count" className="sr-only">
              총 {sortedSteps.length}단계입니다.
            </span>

            <SectionTitle id="ingredients-title">재료</SectionTitle>
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

          <Section aria-labelledby="steps-title">
            <SectionTitle id="steps-title">조리 순서</SectionTitle>
            <StepList>
              {sortedSteps.length > 0 ? (
                sortedSteps.map(step => (
                  <StepItem
                    key={step.id}
                    role="group"
                    aria-label={`${step.stepIndex}단계. ${step.instruction}`}
                  >
                    <StepNumber aria-hidden="true">{step.stepIndex}단계</StepNumber>
                    <StepText aria-hidden="true">{step.instruction}</StepText>
                  </StepItem>

                ))
              ) : (
                <StepItem>
                  <StepText>등록된 조리 순서가 없습니다.</StepText>
                </StepItem>
              )}
            </StepList>
          </Section>
        </>
      )}

      {/* 하단 액션 */}
      <BottomBar aria-label="레시피 액션">
        <PrimaryButton
          aria-label="해당 레시피로 요리 시작하기"
          onClick={handleStartCooking}
        >
          <Play size={28} strokeWidth={3} aria-hidden="true" />
          <span>요리 시작하기</span>
        </PrimaryButton>

        <SecondaryButton
          type="button"
          aria-label="음성으로 조리 순서 듣기"
          onClick={() => {
            // TODO: TTS 연결
            console.log('음성으로 조리 순서 듣기')
          }}
        >
          <Volume2 size={28} strokeWidth={3} aria-hidden="true" />
          <span>음성으로 조리 순서 듣기</span>
        </SecondaryButton>
      </BottomBar>
    </Wrap>
  )
}
