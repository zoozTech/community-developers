import React, { Component } from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
const ContainerLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export default () => (
  <ContainerLoading>
    <ReactLoading type={"spin"} color={"black"} />
  </ContainerLoading>
);
