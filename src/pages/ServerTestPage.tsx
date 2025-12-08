import { useEffect, useState } from "react";
import { pingServer } from "../api/test";

export default function ServerTestPage() {
    const [status, setStatus] = useState("서버 확인 중...");

    useEffect(() => {
        pingServer()
        .then((data) => setStatus("🟢 서버 연결 성공: " + JSON.stringify(data)))
        .catch((err) => setStatus("🔴 서버 연결 실패: " + err.message));
    }, []);

    return (
        <div style={{ padding: 20, fontSize: "18px" }}>
        {status}
        </div>
    );
}
