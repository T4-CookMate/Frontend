import styled from "styled-components";

export const Button = styled.button`
    width: 345px;
    min-height: 60px;
    flex-shrink: 0;
    border-radius: 28px;
    /* padding: 16px 20px; // */
    background: #f3c11b;
    border: none;
    cursor: pointer;

    justify-content: center;          /* 텍스트 가운데 정렬 */
    text-align: center;               /* 여러 줄일 때 중앙 정렬 */
    word-break: keep-all;
    white-space: normal; 
    

    color: #000;
    text-align: center;
    font-family: "KoddiUD OnGothic", sans-serif;
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 150%; /* 27px */
    letter-spacing: -0.36px;

    transition: background 0.2s ease;

    &:hover {
        background: #f0b800; /* 살짝 어두운 노란색 */
    }

    &:active {
        background: #d9a800;
    }
`;
