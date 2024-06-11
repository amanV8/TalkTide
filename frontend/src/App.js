
import './App.css';
import { Route } from "react-router-dom";
import Homepage from './Pages/Homepage';
import chatPage from './Pages/chatPage';

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={chatPage} />
    </div>
  );
}

export default App;
