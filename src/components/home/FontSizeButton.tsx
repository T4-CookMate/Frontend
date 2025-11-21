import { useA11yStore } from "@store/a11yStore";
import styled from "styled-components";

const Button = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    align-self: flex-end;

    background: none;
    border: none;
    cursor: pointer;

    color: #f3c11b;
    font-family: "KoddiUD OnGothic", sans-serif;
    font-size: 1.125rem; /* 18px 기준 (rem 권장) */
    font-weight: 700;
    line-height: 150%;
    letter-spacing: -0.36px;

    &:focus-visible {
        outline: 2px solid #f3c11b;
        border-radius: 8px;
    }
`;

export default function FontSizeButton() {
    const { fontScale, toggleLarge } = useA11yStore();

    return (
        <Button
            onClick={toggleLarge}
            aria-pressed={fontScale !== 1}
            aria-label={fontScale === 1 ? "글씨 크게" : "글씨 보통으로"}
        >
            <span>{fontScale === 1 ? "크게" : "보통"}</span>
        </Button>
    );
}