import styled, { keyframes } from 'styled-components';

// Shining animation
const shine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const BarContainer = styled.div`
  width: 200px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

export interface BarFillProps {
    progress: number,
    isActive: boolean
}

const BarFill = styled.div<BarFillProps>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.isActive ? 'transparent' : '#4CAF50'};
  transition: width 0.3s ease, background-color 0.3s ease;
  
  ${props => props.isActive && `
    background: linear-gradient(90deg, #333 0%, #4CAF50 50%, #333 100%);
    background-size: 200% 100%;
    animation: ${shine} 1.5s infinite linear;
  `}
`;

export const ShiningBar = ({ progress, isActive }: BarFillProps) => {
    return (
        <BarContainer>
            <BarFill progress={progress} isActive={isActive} />
        </BarContainer>
    );
};