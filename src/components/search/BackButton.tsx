import styled from "styled-components"
import backIcon from "../../assets/back-icon.png"  // 경로 맞춰 수정

const BackWrap = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;

  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  color: #FFF;
  font-family: "KoddiUD OnGothic";
  font-size: 16px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.48px;
`

const Icon = styled.img`
  width: 24px;
  height: 24px;
`

type Props = {
  label?: string
  onClick?: () => void
}

export function BackButton({ label = "홈으로", onClick }: Props) {
  return (
    <BackWrap onClick={onClick}>
      <Icon src={backIcon} alt="뒤로가기" />
      <span>{label}</span>
    </BackWrap>
  )
}
