// src/pages/LoginPage.tsx
import styled from 'styled-components'
import { Button } from '@components/SelectButton'
import { useNavigate } from 'react-router-dom'

const Wrap = styled.main`flex:1; padding:24px; display:flex; flex-direction:column; gap:16px;`
const Title = styled.h1`margin:0 0 8px; color:${({theme})=>theme.color.primary};`
const Field = styled.input`
  height: 48px; border-radius: 12px; border:1px solid #222; background:#111; color:#fff; padding:0 12px;
`

export default function LoginPage() {
  const nav = useNavigate()
  return (
    <Wrap>
      <Title>로그인</Title>
      <Field placeholder="이메일" />
      <Field placeholder="비밀번호" type="password" />
      <Button variant="primary" size="md" fullWidth onClick={()=>nav('/home')}>로그인</Button>
      <Button variant="secondary" size="md" fullWidth>회원가입</Button>
    </Wrap>
  )
}
