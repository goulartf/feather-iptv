import React, {useCallback, useEffect, useState} from 'react';
import parser from 'iptv-playlist-parser';
import * as _ from 'underscore';
import ReactPlayer from 'react-player';
import {
  useFocusable,
  init,
  FocusContext,
  FocusDetails,
  FocusableComponentLayout,
  KeyPressDetails
} from '@noriginmedia/norigin-spatial-navigation';

function LiveTV({focusKey, onEnterPress}: any) {
  const [list, setList] = useState<any>(null);

  const [groups, setGroups] = useState<any>({});
  const [channelGroups, setChannelGroups] = useState<any>(null);
  const [channels, setChannels] = useState<any>(null);
  const [channel, setChannel] = useState<any>({});
  const [play, setPlay] = useState<boolean>(false);

  // init();

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/list/playlist.txt')
      .then(res => res.text())
      .then(data => {
        const list: any = parser.parse(data);
        console.log(list);

        const groupedList: any = _.groupBy(list.items, (item: any) => {
          return item.group.title.split('|')[0].trim();
        });

        const groupedChannels = _.groupBy(groupedList.Canais, (channel: any) => {

          let name = channel.name;
          if (name.indexOf('SD') > 0) {
            name = name.substring(0, name.indexOf('SD'));
          }
          if (name.indexOf('FHD') > 0) {
            name = name.substring(0, name.indexOf('FHD'));
          }
          if (name.indexOf('HD') > 0) {
            name = name.substring(0, name.indexOf('HD'));
          }
          if (name.indexOf('[4K]') > 0) {
            name = name.substring(0, name.indexOf('[4K]'));
          }
          if (name.indexOf('4K') > 0) {
            name = name.substring(0, name.indexOf('4K'));
          }

          return name.trim();
        })

        setGroups(groupedList);
        setChannelGroups(groupedChannels);

        // console.log(groupedList);
        // console.log(groupedChannels);
      });

  }, []);


  const onGroupPress = useCallback((title: any) => {
    setList(channelGroups);
  }, [groups]);

  function Menu({focusKey: focusKeyParam}: any) {
    const {
      ref,
      focusSelf,
      focusKey,
    } = useFocusable({
      focusable: true
    });

    useEffect(() => {
      focusSelf();
    }, [focusSelf]);

    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={ref}>
          {groups && Object.keys(groups).map((title: string) => (
            <MenuItem key={title} title={title} onEnterPress={() => onGroupPress(title)}/>
          ))}
        </div>
      </FocusContext.Provider>
    );
  }

  function Menu2({focusKey: focusKeyParam}: any) {
    const {
      ref,
      focusSelf,
      focusKey
    } = useFocusable({
      focusable: true
    });

    useEffect(() => {
      focusSelf();
    }, [focusSelf]);

    const onFocus = useCallback(
      ({ y }: { y: number }) => {

        const startScoll = (window.screen.height / 2) - 100;

        console.log(y, startScoll);

        if(y < startScoll) {
          return;
        }

        ref.current.scrollTo({
          top: (y-200),
          behavior: 'smooth'
        });
      },
      [ref]
    );

    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={ref} className={'overflow-y-auto h-full'}>
          {list && Object.keys(list).map((item: any) => (
            <MenuItem key={item}
                      title={item}
                      onEnterPress={() => setChannels(channelGroups[item])}
                      onFocus={onFocus}
            />
          ))}
        </div>
      </FocusContext.Provider>
    );
  }

  function Menu3({focusKey: focusKeyParam}: any) {
    const {
      ref,
      focusSelf,
      focusKey
    } = useFocusable({
      focusable: true,
    });

    useEffect(() => {
      focusSelf();
    }, [focusSelf]);

    return (
      <FocusContext.Provider value={focusKey}>
        <div ref={ref}>
          {channels && Object.values(channels).map((channel: any) => (
            <MenuItem key={channel.name} title={channel.name} onEnterPress={() => {
              setChannel(channel)
            }}/>
          ))}

          {channel && (
            <div>
              <h1>Channel active: {channel.name}</h1>
              <div>
                <ReactPlayer
                  controls={true}
                  playing={true}
                  width='100%'
                  url={channel.url}/>

                <button onClick={() => setPlay(true)}>Play</button>
                <button onClick={() => setPlay(false)}>Stop</button>
              </div>
            </div>
          )}
        </div>
      </FocusContext.Provider>
    );
  }

  function MenuItem(props: { title: any, onEnterPress: any, onFocus?: any }) {
    const {title, onEnterPress, onFocus} = props;

    const {ref, focused} = useFocusable({
      onEnterPress,
      onFocus
    });

    let test = focused ? 'border-2 border-solid border-red-500' : 'bg-white';

    return <div ref={ref} className={test} style={{display: 'block'}}>
      {title}
    </div>;
  }

  return (
    <div className={'w-full container h-full'}>
      <div className="grid grid-cols-3 gap-4 h-full">
        <Menu focusKey="menu"/>
        { list && <Menu2 focusKey="menu2"/> }
        { channels && <Menu3 focusKey="menu3"/> }
      </div>
    </div>
  )
}

export default LiveTV;
