import React, { useMemo } from "react";
import { Row, Col, Button, Typography } from "antd";
import "../../design/ css/map.address.style.css";

const { Text } = Typography;
type Props = {
  name: string;
  address1: string;
  address2: string;
  deadline: string;
  route: string;
  count: number;
  onGetRoute: (dest: any) => void;
};
const MapAddressComponent = (props: Props) => {
  const {
    name,
    address1,
    address2,
    deadline,
    route,
    count,
    onGetRoute,
  } = props;
  const earn = useMemo(() => count * 2500, [count]);
  const onClick = () => {
    onGetRoute && onGetRoute(props);
  };
  console.log("destination", name, route, count);
  return (
    <Col className={"container"}>
      <Row className={"row"}>
        <Text className={"name"}>{name}</Text>
        <Text className={"deadline"}>{deadline}</Text>
      </Row>
      <Col className={"addressContainer"}>
        <Text className={"address1"}>{address1}</Text>
        <Text className={"address2"}>{address2}</Text>
        <Text className={"route"}>{route}</Text>
      </Col>
      <Row className={"row"}>
        <Button className={"button"} onClick={onClick}>
          경로보기
        </Button>
        {/*<Text className={"count"}>{count}건</Text>*/}
        {/*<Text className={"earn"}>{earn}원</Text>*/}
      </Row>
    </Col>
  );
};

export default MapAddressComponent;
