// src/pages/OnboardingSplash.tsx
import { useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo_cookmate.png";

const SplashWrapper = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 12px; */
  transform: translateY(-40px);
`;

const LogoImage = styled.img`
  width: 230px;
  height: 230px;
  object-fit: contain;
`;

const Subtitle = styled.p`
  margin: -20px 0 0 0;
  color: var(--White, #FFF);
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  /* line-height: 120%; 27.027px */
  letter-spacing: -2.477px;
`;

const Title = styled.h1`
  margin: 0;
  color: #F3C11B;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 40px;
  font-style: normal;
  font-weight: 800;
  line-height: 120%; /* 48px */
  letter-spacing: -2.4px;
`;

// VoiceOver용 숨김 텍스트
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`;

export default function OnboardingSplash() {
  const nav = useNavigate()
  useEffect(()=> {
    const t = setTimeout(()=> nav('/login'), 1200)
    return ()=> clearTimeout(t)
  }, [nav])

  return (
    <SplashWrapper aria-label="쿡짝꿍 시작 화면">
      <VisuallyHidden>
        시각장애인 요리 보조 서비스, 쿡짝꿍입니다. 잠시 후 메인 화면으로 이동합니다.
      </VisuallyHidden>

      <Content>
        <LogoImage src={logo} alt="선글라스를 낀 셰프 모자 로고" />
        <Subtitle>시각장애인 요리 보조 서비스</Subtitle>
        <Title>쿡짝꿍</Title>
      </Content>
    </SplashWrapper>
  );
}
