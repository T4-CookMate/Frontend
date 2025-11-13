import { AppLayout } from '@components/layout/AppLayout'
import { Button } from '@components/SelectButton'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function HomePage() {
  const nav = useNavigate()
  return (
    <AppLayout>
      <Wrap>
          <Title id="title">Cook-Mate</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button variant="gray" size="lg" fullWidth onClick={()=>nav('/search')}>
              레시피 검색하러 가기
            </Button>
            <Button variant="gray" size="lg" fullWidth>
              즐겨찾기 레시피 보러가기
            </Button>
            <Button variant="gray" size="lg" fullWidth>
              AI가 작성한 요리 레포트 보기
            </Button>
          </div>
      </Wrap>
    </AppLayout>
  )
}

const Wrap = styled.main`
  flex: 1;
  display: grid;
  place-items: center;
  padding: 24px;
`

// const Card = styled.section`
//   width: 100%;
//   max-width: 720px;
//   border-radius: ${({ theme }) => theme.radius};
//   border: 1px solid #222;
//   padding: 24px;
//   background: #111;
// `

const Title = styled.h1`
  margin: 0 0 8px;
  line-height: 1.2;
  color: ${({ theme }) => theme.color.primary};
`
