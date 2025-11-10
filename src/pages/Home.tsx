import styled from "styled-components"

export default function Home() {
    return (
        <Wrap>
            <Card aria-labelledby = "title">
                <Title id="title">Cook-Mate 시작화면</Title>
                <p>시작화면 만들기 시작하기</p>
            </Card>
        </Wrap>
    )
}

const Wrap = styled.main`
    min-height: calc(100vh - 48px);
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.text};
    display: grid;
    place-items: center;
    padding: 24px;
`

const Card = styled.section`
    width: 100%;
    max-width: 720px;
    border-radius: ${({ theme }) => theme.radius};
    border: 1px solid #222;
    padding: 24px;
    background: #111;
`

const Title = styled.h1`
    margin: 0 0 8px;
    line-height: 1.2;
    color: ${({ theme }) => theme.color.primary};
`