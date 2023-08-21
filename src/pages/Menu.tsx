import {FocusContext, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React, {useEffect} from "react";
import MenuCard from "./MenuCard";

function Menu({onEnterPress}: any) {
  const {
    ref,
    focusSelf,
    focusKey,
  } = useFocusable({
    focusable: true
  });

  const MODULE_MENU = 'MENU';
  const MODULE_TV_LIVE = 'TV_LIVE';
  const MODULE_SERIES = 'SERIES';
  const MODULE_MOVIES = 'MOVIES';

  const menu = [
    {
      title: 'Tv Live',
      module: MODULE_TV_LIVE
    },
    {
      title: 'Series',
      module: MODULE_SERIES
    },
    {
      title: 'Movies',
      module: MODULE_MOVIES
    },
  ];

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'flex flex-row h-full justify-center content-center align-middle'}>
        {menu && menu.map((menuItem) => (
          <MenuCard key={menuItem.title} title={menuItem.title} onEnterPress={() => onEnterPress(menuItem.module)}/>
        ))}
      </div>
    </FocusContext.Provider>
  );
}

export default Menu;
