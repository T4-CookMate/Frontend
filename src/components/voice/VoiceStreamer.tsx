// src/components/voice/VoiceStreamer.tsx
import { useEffect, useRef } from 'react'

type Props = {
  ws: WebSocket | null
  active: boolean // WS 연결 여부 같은 걸 넘겨주면 됨
  sampleRate?: number // 기본 16k
}

function float32ToInt16(buffer: Float32Array): Int16Array {
  const l = buffer.length
  const result = new Int16Array(l)
  for (let i = 0; i < l; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]))
    result[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return result
}

export function VoiceStreamer({ ws, active, sampleRate = 16000 }: Props) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopMicStream = () => {
    processorRef.current?.disconnect()
    sourceRef.current?.disconnect()
    processorRef.current = null
    sourceRef.current = null

    audioContextRef.current?.close()
    audioContextRef.current = null

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    console.log('🎙 VoiceStreamer: 마이크 스트리밍 종료')
  }

  useEffect(() => {
    if (!active || !ws || ws.readyState !== WebSocket.OPEN) {
      // 비활성 또는 WS 미연결이면 정리
      stopMicStream()
      return
    }

    let cancelled = false

    const startMicStream = async () => {
      try {
        console.log('🎙 VoiceStreamer: 마이크 스트리밍 시작 시도')
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          // useEffect cleanup 중이면 바로 정리
          stream.getTracks().forEach(t => t.stop())
          return
        }

        streamRef.current = stream

        const audioContext = new AudioContext({ sampleRate })
        audioContextRef.current = audioContext

        const source = audioContext.createMediaStreamSource(stream)
        sourceRef.current = source

        const processor = audioContext.createScriptProcessor(4096, 1, 1)
        processorRef.current = processor

        processor.onaudioprocess = e => {
          if (!ws || ws.readyState !== WebSocket.OPEN) return
          const input = e.inputBuffer.getChannelData(0)
          const pcm16 = float32ToInt16(input)
          ws.send(pcm16.buffer) // 🔥 실시간 PCM 전송
        }

        source.connect(processor)
        // processor.connect(audioContext.destination) // 필요 없으면 주석 유지

        console.log('🎙 VoiceStreamer: 마이크 스트리밍 시작 완료')
      } catch (err) {
        console.error('VoiceStreamer: 마이크 권한 실패', err)
        alert('마이크 권한을 허용해 주세요.')
      }
    }

    startMicStream()

    return () => {
      cancelled = true
      stopMicStream()
    }
    // ws, active, sampleRate 바뀔 때마다 다시 평가
  }, [ws, active, sampleRate])

  // UI 없는 “동작만 하는” 컴포넌트라 null 리턴
  return null
}
