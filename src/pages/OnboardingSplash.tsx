// src/pages/OnboardingSplash.tsx
import { useEffect, useRef } from 'react'
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
  transform: translateY(-40px);
`;

const LogoImage = styled.img`
  width: 230px;
  height: 230px;
  object-fit: contain;
`;

const Subtitle = styled.p`
  margin: -20px 0 0 0;
  color: #fff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -2.477px;
`;

const Title = styled.h1`
  margin: 0;
  color: #F3C11B;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 40px;
  font-weight: 800;
  line-height: 120%;
  letter-spacing: -2.4px;
`;

const VisuallyHiddenFocus = styled.p`
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
  const nav = useNavigate();
  const srRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // ✅ 스플래시 진입 시 "한 문장"만 읽히게 포커스 고정
    const t0 = window.setTimeout(() => {
      srRef.current?.focus();
    }, 0);

    // ✅ 자동 이동
    const t1 = window.setTimeout(() => nav('/login'), 1200);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [nav]);

  return (
    <SplashWrapper>
      <VisuallyHiddenFocus
        ref={srRef}
        tabIndex={-1}
        aria-live="polite"
      >
        시각장애인 요리 보조 서비스, 쿡짝꿍 페이지 로딩 중입니다. 잠시 후 로그인 화면으로 이동합니다.
      </VisuallyHiddenFocus>

      <Content aria-hidden="true">
        <LogoImage src={logo} alt="" />
        <Subtitle>시각장애인 요리 보조 서비스</Subtitle>
        <Title>쿡짝꿍</Title>
      </Content>
    </SplashWrapper>
  );
}
