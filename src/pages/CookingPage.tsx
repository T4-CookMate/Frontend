import TtsTestButton from '@components/TtsTestButton'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type LocationState = {
  recipeId: number
  recipeName: string
}

export default function CookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null

  const recipeId = state?.recipeId
  const recipeName = state?.recipeName ?? '요리'

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  // state 없이 직접 들어온 경우 대비
  useEffect(() => {
    if (!recipeId) {
      alert('레시피 정보가 없습니다. 다시 검색 화면에서 진입해주세요.')
      navigate('/search')
    }
  }, [recipeId, navigate])

  // 1) 카메라 켜기
  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,  // 나중에 외부 웹캠으로 바꿔도 이 부분은 같음
          audio: true,
        })
        if (cancelled) return
        setStream(s)
        if (videoRef.current) {
          videoRef.current.srcObject = s
        }
      } catch (err) {
        console.error('카메라/마이크 권한 요청 실패', err)
        alert('카메라/마이크 권한이 필요합니다.')
      }
    }

    startCamera()

    return () => {
      cancelled = true
      // 정리: 카메라 끄기
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 최초 1번

  // 2) WebSocket 연결
    useEffect(() => {
    if (!recipeId) return

    const rawToken = localStorage.getItem('accessToken')
    if (!rawToken) {
        alert('로그인이 필요합니다.')
        return
    }

    const token = rawToken.trim()
    console.log('WS token:', token)

    const wsUrl = `ws://43.200.235.175:8080/ws/voice?recipeId=${recipeId}&token=${encodeURIComponent(token)}`
    console.log('WS URL:', wsUrl)

    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        console.log('✅ WebSocket 연결 성공')
        setWsConnected(true)
    }

    ws.onmessage = (event) => {
        console.log('📩 서버 메시지:', event.data)
    }

    ws.onerror = (event) => {
        console.error('❌ WebSocket 에러', event)
    }

    ws.onclose = (event) => {
        console.log('🔚 WebSocket 종료', event.code, event.reason)
        setWsConnected(false)
    }

    socketRef.current = ws

    return () => ws.close()
    }, [recipeId])


  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <button onClick={handleBack}>← 뒤로</button>

      <h2>{recipeName} 요리 중</h2>

      {/* 카메라 영상 */}
      <div
        style={{
          flex: 1,
          borderRadius: 16,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted   // 에코 방지용 (필요시 해제)
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* 연결 상태 표시 */}
      <div>
        <p>웹소켓 상태: {wsConnected ? '연결됨 ✅' : '연결 안 됨 ❌'}</p>
        <p>카메라 상태: {stream ? 'ON 🎥' : 'OFF'}</p>
      </div>

      <TtsTestButton />
    </div>
  )
}
