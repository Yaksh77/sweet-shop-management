import ToggleTheme from "../components/ThemeToggle.jsx";
import SweetForm from "../components/SweetForm.jsx";
import SweetList from "../components/SweetList.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <ToggleTheme />
      <h1 className="text-center text-5xl mb-2">
        🍭 Sweet Shop Management System
      </h1>
      <SweetForm onAdd={() => window.location.reload()} />
      <SweetList />
    </div>
  );
}
