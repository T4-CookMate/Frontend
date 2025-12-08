// src/pages/LoginPage.tsx
import styled from 'styled-components'
import { Button } from '@components/SelectButton'

const Wrap = styled.main`
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const Title = styled.h1`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.color.primary};
`

export default function LoginPage() {
  const GOOGLE_AUTH_URL = (() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI)
    const scope = encodeURIComponent("openid email profile")

    return (
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`
    )
  })()

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL
  }

  return (
    <Wrap>
      <Title>로그인</Title>

      {/*구글 로그인 버튼 */}
      <Button
        variant="primary"
        size="md"
        fullWidth
        onClick={handleGoogleLogin}
      >
        Google로 계속하기
      </Button>

    </Wrap>
  )
}
