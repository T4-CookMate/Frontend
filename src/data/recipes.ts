// src/data/recipes.ts
export type Recipe = {
  id: number
  name: string
  tags: string[]
  thumbnail?: string
}

export const RECIPES: Recipe[] = [
  { id: 1, name: '김치볶음밥', tags: ['밥', '볶음', '간단'] },
  { id: 2, name: '계란말이', tags: ['계란', '반찬', '간단'] },
  { id: 3, name: '된장찌개', tags: ['찌개', '국물', '한식'] },
  { id: 4, name: '파스타', tags: ['면', '양식'] },
  { id: 5, name: '샐러드', tags: ['야채', '간단', '다이어트'] },
  { id: 6, name: '불고기', tags: ['고기', '한식'] },
  { id: 7, name: '비빔국수', tags: ['면', '매운맛'] },
  { id: 8, name: '카레라이스', tags: ['밥', '일식'] },
  { id: 9, name: '라자냐', tags: ['면', '오븐'] },
  { id: 10, name: '닭갈비', tags: ['고기', '매운맛'] },
]
