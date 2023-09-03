import {FocusContext, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React, {useEffect} from "react";
import MenuCard from "./MenuCard";
import {Feather, Power, Settings, User as UserIcon} from 'react-feather';
import Modal from "../componentes/Modal";
import UserForm from "./UserForm";


function UserAction({onEnterPress}: any) {
  const {ref, focused} = useFocusable({
    focusable: true,
    onEnterPress
  });

  return <div ref={ref}>
    <UserIcon color={'white'} size={focused ? 44 : 36} className={'ml-3'}/>
  </div>;
};

function SettingsAction({onEnterPress}: any) {
  const {ref, focused} = useFocusable({
    focusable: true
  });

  return <div ref={ref}>
    <Settings color={'white'} size={focused ? 44 : 36} className={'ml-3'}/>
  </div>;
};

function PowerAction({onEnterPress}: any) {
  const {ref, focused} = useFocusable({
    focusable: true
  });

  return <div ref={ref}>
    <Power color={'white'} size={focused ? 44 : 36} className={'ml-3'}/>
  </div>;
};

function Menu({onEnterPress}: any) {
  const [showModalUserForm, setShowModalUserForm] = React.useState(false);

  const {
    ref,
    focusSelf,
    focusKey,
  } = useFocusable({
    focusable: true
  });

  const MODULE_TV_LIVE = 'TV_LIVE';
  const MODULE_SERIES = 'SERIES';
  const MODULE_MOVIES = 'MOVIES';

  const menu = [
    {
      title: 'Tv Live',
      module: MODULE_TV_LIVE,
      icon: 'tv'
    },
    {
      title: 'Series',
      module: MODULE_SERIES,
      icon: 'series'
    },
    {
      title: 'Movies',
      module: MODULE_MOVIES,
      icon: 'movies'
    },
  ];

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  const UserActionEnterPress = () => {
    setShowModalUserForm(true);
  }

  const closeModal = () => {
    setShowModalUserForm(false);
  }

  return (
    <FocusContext.Provider value={focusKey}>
      { showModalUserForm && <Modal> <UserForm  cancelAction={closeModal} /> </Modal>}
      <div className={'flex justify-between mx-6 pt-10 mb-4'}>
        <div className={`flex`}>
          <Feather color={'white'} size={36}/>
          <h1 className={'text-white pl-4'}>Feather IPTV</h1>
        </div>
        <div className={`flex`}>
          <PowerAction/>
          <UserAction onEnterPress={UserActionEnterPress}/>
          <SettingsAction/>
        </div>
      </div>
      <div ref={ref} className={'flex flex-row h-full justify-center content-center align-middle'}>
        {menu && menu.map((menuItem) => (
          <MenuCard key={menuItem.title} title={menuItem.title} onEnterPress={() => onEnterPress(menuItem.module)}/>
        ))}
      </div>
    </FocusContext.Provider>
  );
}

export default Menu;
