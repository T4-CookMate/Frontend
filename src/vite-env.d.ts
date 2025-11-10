import 'styled-components'
import type { AppTheme } from './styles/theme'

// styled-components의 DefaultTheme 인터페이스를 만든 AppTheme으로 확장
declare module 'styled-components' {
    export interface DefaultTheme extends AppTheme {}
}