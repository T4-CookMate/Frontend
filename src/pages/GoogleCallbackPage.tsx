// src/pages/GoogleCallbackPage.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";

const GoogleCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (!code) {
      console.error("구글 로그인 code 없음");
      return;
    }

    api
      .post("/auth/google", { code }) // baseURL은 43.200.235.175:8080
      .then((res) => {
        console.log("로그인 성공:", res.data);

        // 응답 구조 맞춰서 꺼내기
        const { result } = res.data;
        const {
          userId,
          email,
          name,
          profileImageUrl,
          accessToken,
          refreshToken,
        } = result;

        // 토큰이나 유저 정보 저장 (예시)
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        localStorage.setItem("profileImageUrl", profileImageUrl);

        // 메인 페이지로 보내기
        navigate("/home");
      })
      .catch((err) => {
        console.error("백엔드 로그인 연동 실패:", err);
        navigate("/login");
      });
  }, [location.search, navigate]);

  return <div>구글 로그인 처리중입니다...</div>;
};

export default GoogleCallbackPage;
