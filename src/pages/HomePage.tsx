// src/pages/HomePage.tsx
import { Button } from '@components/home/Button'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import FontSizeBUtton from '@components/home/FontSizeButton'
import { Mic, Search, Heart, FileText } from 'lucide-react'

export default function HomePage() {
  const nav = useNavigate()

  return (
    <Wrap>
      {/* 상단 폰트 크기 토글 */}
      <TopRow>
        <FontSizeBUtton />
      </TopRow>

      {/* 메인 음성 버튼 */}
      <VoiceButton
        type="button"
        aria-label="쿡짝꿍 음성으로 시작하기"
        onClick={() => {
          // TODO: 음성 인식 시작 로직 연결
          console.log('쿡짝꿍 시작하기')
        }}
      >
        <Mic size={28} strokeWidth={3} aria-hidden="true" />
        <VoiceButtonText>쿡짝꿍 시작하기</VoiceButtonText>
      </VoiceButton>

      <VoiceHelperText>음성으로 쿡짝꿍에게 물어보세요</VoiceHelperText>

      {/* 하단 버튼 3개 */}
      <MenuButtons>
        <HomeSubButton onClick={() => nav('/search')}>
          <IconWrapper aria-hidden="true">
            <Search size={22} strokeWidth={2.5} />
          </IconWrapper>
          <SubButtonText>레시피 검색하기</SubButtonText>
        </HomeSubButton>

        <HomeSubButton onClick={() => nav('/favorites')}>
          <IconWrapper aria-hidden="true">
            <Heart size={22} strokeWidth={2.5} />
          </IconWrapper>
          <SubButtonText >즐겨찾기 보기</SubButtonText>
        </HomeSubButton>

        <HomeSubButton
          type="button"
          onClick={() => {
            // TODO: AI 레포트 페이지로 이동
            console.log('AI 레포트 보기')
          }}
        >
          <IconWrapper aria-hidden="true">
            <FileText size={22} strokeWidth={2.5} />
          </IconWrapper>
          <SubButtonText>AI 레포트 보기</SubButtonText>
        </HomeSubButton>
      </MenuButtons>

      {/* 쿠킹 레벨 카드 */}
      <LevelCard aria-label="쿠킹 레벨 정보">
        <LevelTitle>OO님의 쿠킹 레벨</LevelTitle>
        <LevelSubtitle>오늘의 추천 요리: 간장계란밥</LevelSubtitle>
        <LevelDescription>꾸준히 요리하고 있어요!</LevelDescription>
      </LevelCard>
    </Wrap>
  )
}


const Wrap = styled.main`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  /* padding: 24px 16px 40px; */
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

// 큰 노란 "쿡짝꿍 시작하기" 버튼
const VoiceButton = styled.button`
  display: flex;
  width: 100%;
  height: 88px;
  padding: 28px 58px 28px 57px; /* 피그마 값 */
  justify-content: center;
  align-items: center;
  gap: 12px;

  border: none;
  border-radius: 24px;
  background: #f3c11b;
  color: #1a1a1a;
`

const VoiceButtonText = styled.span`
  font-family: 'KoddiUD OnGothic';
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
`

const VoiceHelperText = styled.p`
  margin: 0;
  color: #ffffff;
  font-family: 'KoddiUD OnGothic';
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  text-align: center;
  opacity: 0.85;
  margin-bottom: 6px;
`

// 하단 3개 버튼 영역
const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 16px;
`

const HomeSubButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: flex-start;
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const SubButtonText = styled.span`
  font-family: 'KoddiUD OnGothic';
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.4px;
`

// 쿠킹 레벨 카드
const LevelCard = styled.section`
  width: 100%;
  padding: 16px 18px;
  border-radius: 20px;
  border: 2px solid rgba(243, 193, 27, 0.7);
  background: #111111;

  display: flex;
  flex-direction: column;
  gap: 4px;
`

const LevelTitle = styled.p`
  margin: 0;
  color: #f3c11b;
  font-family: 'KoddiUD OnGothic';
  font-size: 18px;
  font-weight: 800;
  line-height: 150%;
  letter-spacing: -0.48px;
`

const LevelSubtitle = styled.p`
  margin: 0;
  color: #ffffff;
  font-family: 'KoddiUD OnGothic';
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.36px;
`

const LevelDescription = styled.p`
  margin: 0;
  color: #c4c4c4;
  font-family: 'KoddiUD OnGothic';
  font-size: 13px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.36px;
`
