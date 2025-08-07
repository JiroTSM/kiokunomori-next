function InputForm({ name, onNameChange }) {
  return (
    <input
      type="text"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      placeholder="名前を入力してください"
    />
  );
}

export default InputForm;
