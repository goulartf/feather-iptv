import React, {useCallback, useEffect, useState} from 'react';
import parser from 'iptv-playlist-parser';
import * as _ from 'underscore';
import ReactPlayer from 'react-player/lazy';
import './App.css';
import {
  useFocusable,
  init,
  FocusContext,
  FocusDetails,
  FocusableComponentLayout,
  KeyPressDetails
} from '@noriginmedia/norigin-spatial-navigation';
import MenuItem from "./pages/MenuItem";
import Menu from "./pages/Menu";
import LiveTV from "./pages/LiveTV";

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
    <div className={'w-full h-full bg-gray-900'}>
      { module === MODULE_MENU && <Menu focusKey="menu" onEnterPress={onSelectMenu} /> }
      { module === MODULE_TV_LIVE && <LiveTV focusKey="menu"/> }
    </div>
  )
}

export default App;
