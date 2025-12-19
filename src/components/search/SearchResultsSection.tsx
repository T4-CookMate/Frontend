// src/components/search/SearchResultsSection.tsx
import styled from 'styled-components'
import { Button } from '@components/SelectButton'
import { RecipeCard } from '@components/RecipeCard'
import type { Recipe } from 'data/recipes'

const SummaryWrap = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const MainText = styled.p`
  margin: 0;
  color: #fff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
`

const SubText = styled.p`
  margin: 0;
  color: #fff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`

const ResetRow = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 12px;
//   margin-top: 8px;
// `

const Grid = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Item = styled.li`
  margin: 0;
`;

const MoreWrap = styled.div`
  margin-top: 12px;
`

const SrOnly = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

type Props = {
  confirmed: string
  totalCount: number
  pagedRecipes: Recipe[]
  hasMore: boolean
  onMore: () => void
  onReset: () => void
  onSelectRecipe: (recipe: Recipe) => void
}

export function SearchResultsSection({
  confirmed,
  totalCount,
  pagedRecipes,
  hasMore,
  onMore,
  onReset,
  onSelectRecipe,
}: Props) {
  if (!confirmed) return null

  const summaryText = `현재 ${totalCount}개의 검색 결과가 있어요! 쿡짝꿍이 4개씩 보여줄게요.`

  return (
    <>
      {/* 스크린리더는 이 문장만 “한 번에” 읽음 */}
      <SrOnly aria-live="polite">{summaryText}</SrOnly>

      {/* 화면용 문장은 스크린리더에서 숨김 */}
      <SummaryWrap aria-hidden="true">
        <MainText>현재 {totalCount}개의 검색 결과가 있어요!</MainText>
        <SubText>쿡짝꿍이 4개씩 보여줄게요</SubText>
      </SummaryWrap>

      <ResetRow>
        <Button size="sm" onClick={onReset}>
          초기화
        </Button>
      </ResetRow>

      <Grid aria-label={`${confirmed} 검색 결과`}>
        {pagedRecipes.map(r => (
          <Item key={r.id}>
            <RecipeCard
              title={r.name}
              tags={r.tags}
              time={r.time}
              level={r.level}
              onClick={() => onSelectRecipe(r)}
              // 카드가 한 번에 읽히도록 요약 라벨 추가(RecipeCard가 받게)
              ariaLabel={`${r.name}, ${r.time}분, 난이도 ${r.level}. 선택하면 상세 화면으로 이동`}
            />
          </Item>
        ))}
      </Grid>


      {hasMore && (
        <MoreWrap>
          <Button size="md" fullWidth onClick={onMore}>
            더보기
          </Button>
        </MoreWrap>
      )}
    </>
  )
}
