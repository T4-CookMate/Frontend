export type Recipe = {
  id: number
  name: string
  tags: string[]
  thumbnail?: string
  time: number
  level: number
  isPrefer?: boolean
}

// export const RECIPES: Recipe[] = [
//   { id: 1, name: '계란말이', tags: ['계란', '반찬', '간단'], time: 12, level: "보통" },
//   { id: 2, name: '스크램블에그', tags: ['계란', '아침', '간단'], time: 5, level: "쉬움" },
//   { id: 3, name: '달걀프라이', tags: ['계란', '기본', '아침'], time: 3, level: "쉬움" },
//   { id: 4, name: '에그인헬', tags: ['계란', '토마토', '양식'], time: 18, level: "어려움" },
//   { id: 5, name: '계란장조림', tags: ['계란', '반찬', '한식'], time: 22, level: "어려움" },
//   { id: 6, name: '계란볶음밥', tags: ['계란', '밥', '간단'], time: 10, level: "쉬움" },
//   { id: 7, name: '달걀국', tags: ['계란', '국물', '한식'], time: 15, level: "보통" },
//   { id: 8, name: '계란덮밥', tags: ['계란', '밥', '아침'], time: 8, level: "쉬움" },
//   { id: 9, name: '오믈렛', tags: ['계란', '양식', '아침'], time: 12, level: "보통" },
//   { id: 10, name: '계란찜', tags: ['계란', '부드러운식감', '한식'], time: 20, level: "어려움" },
// ]
