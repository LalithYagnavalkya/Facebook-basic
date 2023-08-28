import styled from "styled-components";

const Loading = () => {
  return (
    <Loader>
      <div className="load loading"></div>
    </Loader>
  );
};

const Loader = styled.div`
  .load {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
  }

  .load::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: 4px solid #d6d6d6;
    width: 15px;
    height: 15px;
    border-left: 4px solid transparent;
    border-bottom: 4px solid transparent;
    animation: loading1 1s ease infinite;
    z-index: 10;
  }

  @keyframes loading1 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loading;
