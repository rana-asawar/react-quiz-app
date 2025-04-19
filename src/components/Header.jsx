function Header() {
  const headerStyle = {
    backgroundColor: "#5b1180",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
  };

  const h1_style ={
    fontFamily: "system-ui, BlinkMacSystemFont,  Roboto, Oxygen",
  }
  return (
    <header style={headerStyle}>
      <h1 style={h1_style} >Quiz App</h1>
    </header>
  );
}

export default Header;
