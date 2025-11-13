// src/pages/OnboardingSplash.tsx
import { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Box = styled.main`
  flex: 1; display:grid; place-items:center; padding: 24px;
`
const Logo = styled.div`
  width: 180px; height: 180px; border-radius: 24px;
  background: ${({theme})=>theme.color.primary};
  color:#000; display:grid; place-items:center; font-weight:900; font-size:28px;
`

export default function OnboardingSplash() {
  const nav = useNavigate()
  useEffect(()=> {
    const t = setTimeout(()=> nav('/login'), 1200)
    return ()=> clearTimeout(t)
  }, [nav])

  return (
    <Box aria-label="온보딩 화면">
      <Logo>Cook-Mate</Logo>
    </Box>
  )
}
