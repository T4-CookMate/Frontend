// src/data/recipes.ts
export type Recipe = {
  id: number
  name: string
  tags: string[]
  thumbnail?: string
}

export const RECIPES: Recipe[] = [
  { id: 1, name: '계란말이', tags: ['계란', '반찬', '간단'] },
  { id: 2, name: '스크램블에그', tags: ['계란', '아침', '간단'] },
  { id: 3, name: '달걀프라이', tags: ['계란', '기본', '아침'] },
  { id: 4, name: '에그인헬', tags: ['계란', '토마토', '양식'] },
  { id: 5, name: '계란장조림', tags: ['계란', '반찬', '한식'] },
  { id: 6, name: '계란볶음밥', tags: ['계란', '밥', '간단'] },
  { id: 7, name: '달걀국', tags: ['계란', '국물', '한식'] },
  { id: 8, name: '계란덮밥', tags: ['계란', '밥', '아침'] },
  { id: 9, name: '오믈렛', tags: ['계란', '양식', '아침'] },
  { id: 10, name: '계란찜', tags: ['계란', '부드러운식감', '한식'] },
]
