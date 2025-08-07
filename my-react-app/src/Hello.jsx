function Hello(props) {
  return (
    <p>
      こんにちは、{props.name}さん！<br />
      {props.message}
    </p>
  );
}

export default Hello;
