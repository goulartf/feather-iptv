import React, {useState} from 'react';
import './App.css';
import {
  init,
} from '@noriginmedia/norigin-spatial-navigation';
import Menu from "./pages/Menu";
import LiveTV from "./pages/LiveTv/LiveTV";
import {UserContextProvider} from "./Contexts";

function App() {

  const MODULE_MENU = 'MENU';
  const MODULE_TV_LIVE = 'TV_LIVE';
  const MODULE_MOVIES = 'MOVIES';

  const [module, setModule] = useState<string>(MODULE_MENU);

  init();

  const onSelectMenu = (module: string) => {
    setModule(module);
  };

  return (
    <UserContextProvider>
      <div className={'w-full h-full bg-gray-900'}>
        {module === MODULE_MENU && <Menu focusKey="menu" onEnterPress={onSelectMenu}/>}
        {module === MODULE_TV_LIVE && <LiveTV/>}
      </div>
    </UserContextProvider>
  )
}

export default App;
