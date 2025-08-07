import Hello from "./Hello";

function HelloList({ name }) {
  return (
    <>
      <Hello name="太郎" message="ようこそReactへ" />
      <Hello name="花子" message="元気ですか？" />
      <Hello name={name} message="これは入力からの表示です" />
    </>
  );
}

export default HelloList;
