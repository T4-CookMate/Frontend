import { AppLayout } from '@components/layout/AppLayout'
import { Button } from '@components/home/Button'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import FontSizeBUtton from '@components/home/FontSizeButton'
import CookMateLogo from 'assets/logo_cookmate.png'

export default function HomePage() {
  const nav = useNavigate()
  return (
      <Wrap>
        <FontSizeBUtton/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button onClick={()=>nav('/search')}>
              레시피 검색하러 가기
            </Button>
            <Button>
              즐겨찾기 레시피 보러가기
            </Button>
            <Button>
              AI가 작성한 요리 레포트 보기
            </Button>
          </div>

          {/* 쿠킹 레벨 디자인만 */}
          <LevelContainer>
            <LevelText>OO님의 쿠킹 LEVEL</LevelText>
            <Logo src={CookMateLogo} alt="CookMate 로고" />
          </LevelContainer>
      </Wrap>
  )
}

const Wrap = styled.main`
  /* flex: 1;
  display: grid;
  place-items: center;
  padding: 24px; */

  display: flex;
  width: 349px;
  /* height: 232px; */
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 26px;
  flex-shrink: 0;
`

const LevelContainer = styled.div`
  width: 236px;
  height: 245px;
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-inline: auto;
`

const LevelText = styled.div`
  color: #F3C11B;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 800;
  line-height: 150%; /* 36px */
  letter-spacing: -0.48px;
`

const Logo = styled.img`
  width: 204.609px;
  height: 204.609px;
  transform: rotate(9.646deg);
  flex-shrink: 0;
  aspect-ratio: 204.61/204.61;
`