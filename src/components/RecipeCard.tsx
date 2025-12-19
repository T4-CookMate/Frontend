// src/components/RecipeCard.tsx
import styled from "styled-components"
import clockIcon from "../assets/clock-icon.png"
import levelIcon from "../assets/star-level-icon.png"
import heartOffIcon from "../assets/heart-non.png"

const CardWrapper = styled.div`
  width: 162px;
  height: 174px;
`

const CardButton = styled.button`
  width: 162px;
  height: 174px;
  border-radius: 20px;
  background: #ffffff;
  border: 0;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 14px;
`

const Title = styled.div`
  color: #1b1b1b;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.36px;
`

const TagPill = styled.div`
  width: 58px;
  height: 26px;
  border-radius: 15px;
  background: #f3c11b;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1b1b1b;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.32px;
`

const TagContainer = styled.div`
  display: flex;
  gap: 6px;
  align-self: center;
  justify-content: center;
  margin-top: 10px;
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const InfoColumn = styled.div`
  display: flex;
  width: 62px;
  height: 55px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 7px;
`

const InfoRow = styled.div`
  display: flex;
  width: 70px;
  height: 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`

const InfoIcon = styled.img`
  width: 24px;
  height: 24px;
`

const InfoText = styled.span`
  color: #1b1b1b;
  font-family: "KoddiUD OnGothic";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.28px;
`

// 하트 “자리”를 BottomRow 안에 다시 만들기 (원래 레이아웃 복구 핵심)
const HeartSlot = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HeartIcon = styled.img`
  width: 24px;
  height: 24px;
`

type RecipeCardProps = {
  title: string
  tags?: string[]
  time: number
  level: number
  onClick?: () => void
  ariaLabel?: string
}

export function RecipeCard({
  title,
  tags,
  time,
  level,
  onClick,
  ariaLabel,
}: RecipeCardProps) {
  const label =
    ariaLabel ??
    `${title}, ${time}분, 난이도 ${level}. 선택하면 상세 화면으로 이동`

  return (
    <CardWrapper>
      <CardButton type="button" onClick={onClick} aria-label={label}>
        {/* 시각용 요소는 스크린리더에서 숨김 */}
        <div aria-hidden="true">
          <Title>{title}</Title>

          {tags && (
            <TagContainer>
              {tags.slice(0, 2).map((t, i) => (
                <TagPill key={i}>{t}</TagPill>
              ))}
            </TagContainer>
          )}
        </div>

        <BottomRow aria-hidden="true">
          <InfoColumn>
            <InfoRow>
              <InfoIcon src={clockIcon} alt="" />
              <InfoText>{time}분</InfoText>
            </InfoRow>
            <InfoRow>
              <InfoIcon src={levelIcon} alt="" />
              <InfoText>{level}</InfoText>
            </InfoRow>
          </InfoColumn>

          {/* 하트는 “그림”만: 기능 없으니 안 읽히게 */}
          <HeartSlot>
            <HeartIcon src={heartOffIcon} alt="" aria-hidden="true" />
          </HeartSlot>
        </BottomRow>
      </CardButton>
    </CardWrapper>
  )
}
