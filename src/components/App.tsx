import mubiLogo from "/logo.svg";

const App = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src={mubiLogo}
      style={{
        width: "30vw",
        minWidth: "200px",
      }}
    />
  </div>
);

export default App;
