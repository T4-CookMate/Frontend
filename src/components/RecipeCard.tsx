// src/components/RecipeCard.tsx
import React, { useState } from "react"
import styled from "styled-components"
import clockIcon from "../assets/clock-icon.png"
import levelIcon from "../assets/star-level-icon.png"
import heartOffIcon from "../assets/heart-non.png"
import heartOnIcon from "../assets/heart-fill.png"

const CardWrapper = styled.div`
  position: relative;
  width: 162px;
  height: 174px;
`;

const CardButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: #ffffff;
  border: 0;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 14px;
`;

const HeartButton = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;

  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
`;


// const Card = styled.button`
//   width: 162px;
//   height: 174px;
//   border-radius: 20px;
//   background: #ffffff;
//   color: #1b1b1b;
//   border: 0;
//   cursor: pointer;

//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   padding: 16px 14px;
// `

const Title = styled.div`
  color: #1b1b1b;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 27px */
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
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

/** 시간 + 난이도 세로로 배치되는 영역 */
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
  justify-content: flex-start;  /* 왼쪽 정렬 */
  align-items: center;          /* 세로 가운데 정렬 */
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

// const HeartButton = styled.button`
//   border: none;
//   padding: 0;
//   margin: 0;
//   background: transparent;
//   cursor: pointer;

//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

const HeartIcon = styled.img`
  width: 24px;
  height: 24px;
`

const TagContainer = styled.div`
  display: flex;
  gap: 6px;
  align-self: center;
`

type RecipeCardProps = {
  title: string
  tags?: string[]
  time: number        // 분 단위
  level: number
  onClick?: () => void
  ariaLabel?: string
}

// export function RecipeCard({ title, tags, time, level, onClick }: RecipeCardProps) {
//   const [liked, setLiked] = useState(false)

//   const toggleLike = (e: React.MouseEvent) => {
//     e.stopPropagation() // 카드 onClick이랑 분리
//     setLiked(prev => !prev)
//   }

//   const label =
//     ariaLabel ??
//     `${title}, ${time}분, 난이도 ${level}. 선택하면 상세 화면으로 이동`


//   return (
//     <Card type="button" onClick={onClick}>
//       <Title>{title}</Title>

//       {tags && (
//         <TagContainer>
//           {tags.slice(0, 2).map((t, i) => (
//             <TagPill key={i}>{t}</TagPill>
//           ))}
//         </TagContainer>
//       )}


//       <BottomRow>
//         {/* 시간 + 난이도 세로 컬럼 */}
//         <InfoColumn>
//           <InfoRow>
//             <InfoIcon src={clockIcon} alt="조리 시간" />
//             <InfoText>{time}분</InfoText>
//           </InfoRow>
//           <InfoRow>
//             <InfoIcon src={levelIcon} alt="난이도" />
//             <InfoText>{level}</InfoText>
//           </InfoRow>
//         </InfoColumn>

//         {/* 하트 버튼 */}
//         <HeartButton
//           type="button"
//           onClick={toggleLike}
//           aria-pressed={liked}
//         >
//           <HeartIcon
//             src={liked ? heartOnIcon : heartOffIcon}
//             alt={liked ? "즐겨찾기 취소" : "즐겨찾기에 추가"}
//           />
//         </HeartButton>
//       </BottomRow>
//     </Card>
//   )
// }

export function RecipeCard({
  title,
  tags,
  time,
  level,
  onClick,
  ariaLabel,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false)

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => !prev)
  }

  const label =
    ariaLabel ??
    `${title}, ${time}분, 난이도 ${level}. 선택하면 상세 화면으로 이동`

  return (
    <CardWrapper>
      {/* 카드 전체 클릭 영역 */}
      <CardButton
        type="button"
        onClick={onClick}
        aria-label={label}
      >
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

          <BottomRow>
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
          </BottomRow>
        </div>
      </CardButton>

      {/* ✅ 하트는 별도 버튼 */}
      <HeartButton
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={liked ? "즐겨찾기 취소" : "즐겨찾기에 추가"}
      >
        <HeartIcon
          src={liked ? heartOnIcon : heartOffIcon}
          alt=""
        />
      </HeartButton>
    </CardWrapper>
  )
}

