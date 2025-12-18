// src/pages/LoginPage.tsx
import styled from "styled-components";
import logo from "../assets/logo_cookmate.png";
import googleLogo from "../assets/google_logo.png";
import { useEffect, useRef } from "react";

const Page = styled.main`
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
  color: #ffffff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -2.477px;
`;

const Title = styled.h1`
  margin: 0;
  color: #f3c11b;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 40px;
  font-weight: 800;
  line-height: 120%;
  letter-spacing: -2.4px;
`;

const GoogleButton = styled.button`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  width: 260px;
  height: 56px;
  border: none;
  border-radius: 999px;

  background-color: #f3c11b;
  cursor: pointer;

  font-family: "KoddiUD OnGothic";
  font-size: 18px;
  font-weight: 700;
  color: #1f1f1f;

  &:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 3px;
  }
  
`;

const GoogleIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  border: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};


export default function LoginPage() {
  const srRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      srRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const GOOGLE_AUTH_URL = (() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    const scope = encodeURIComponent("openid email profile");

    return (
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent`
    );
  })();

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <Page>
      <p style={srOnlyStyle} tabIndex={-1} ref={srRef}>쿡짝꿍 로그인 화면입니다. 구글로 시작하기 버튼을 눌러 로그인하세요.</p>

      <Content>
        <LogoImage src={logo} alt="" aria-hidden="true" />
        <Subtitle aria-hidden="true">시각장애인 요리 보조 서비스</Subtitle>

        <Title>
          쿡짝꿍 로그인
        </Title>

        <GoogleButton
          onClick={handleGoogleLogin}
          aria-label="구글 계정으로 로그인하기"
        >
          <GoogleIcon src={googleLogo} alt="" aria-hidden="true" />
          <span>구글로 시작하기</span>
        </GoogleButton>
      </Content>
    </Page>
  );
}
