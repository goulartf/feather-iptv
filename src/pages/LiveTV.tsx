import React, {lazy, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import parser, {Playlist, PlaylistItem} from 'iptv-playlist-parser';
import * as _ from 'underscore';
import ReactPlayer from 'react-player';
import {findDOMNode} from 'react-dom';
import screenfull from 'screenfull';
import {DateTime} from "luxon";
import {ScheduleContext} from "../Contexts";
import {
  useFocusable,
  FocusContext,
} from '@noriginmedia/norigin-spatial-navigation';
import LoaderCircle from "./LoaderCircle";
// @ts-ignore
import XMLParser from 'react-xml-parser';

let player: ReactPlayer | null = null;

function Menu({channelCategories, onEnterPress, setMainLoader}: any) {
  const [itemActive, setItemActive] = useState<string | null>(null);

  const {
    ref,
    focusSelf,
    focusKey,
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: true,
    trackChildren: true
  });

  const onFocus = useCallback(
    ({y}: { y: number }) => {

      ref.current.scrollTo({
        top: (y - 200),
      });
    },
    [ref]
  );

  const interceptEnterPress = (title: string) => {
    setItemActive(title);
    return onEnterPress(title);
  };

  useEffect(() => {
    console.log('focus menu1');
    focusSelf();
    setMainLoader(false);
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'overflow-y-auto h-full border-gray-800 border-r-2'}>
        {channelCategories && Object.keys(channelCategories).map((title: string) => (
          <MenuItem key={title} title={title}
                    onEnterPress={() => interceptEnterPress(title)}
                    active={itemActive === title}
                    onFocus={onFocus}/>
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function Menu2({channels, onEnterPress, schedules, setChannelSchedule}: any) {
  const [itemActive, setItemActive] = useState<string | null>(null);

  const {
    ref,
    focusSelf,
    focusKey
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: true,
  });

  const onFocus = useCallback(
    ({y}: { y: number }, channel: any) => {
      ref.current.scrollTo({
        top: (y - 200)
      });

    },
    [ref]
  );

  const interceptEnterPress = (title: string, channel: PlaylistItem) => {
    setItemActive(title);
    return onEnterPress(title, channel);
  };

  useEffect(() => {
    if (ref) {
      ref.current.scrollTo({
        top: (0),
      });
    }

    focusSelf();
  }, [channels]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'overflow-y-auto h-full border-gray-800 border-r-2'}>
        {channels && Object.keys(channels).map((title: any) => (
          <MenuItem2 key={title}
                     title={title}
                     onEnterPress={() => interceptEnterPress(title, {...channels[title][0]})}
                     active={itemActive === title}
                     extraProps={{...channels[title][0]}}
                     onFocus={onFocus}
          />
        ))}
      </div>
    </FocusContext.Provider>
  );
}

function Menu3({channel, onEnterPress, channelSelected, channelSchedule}: any) {
  const {
    ref,
    focusSelf,
    focusKey
  } = useFocusable({
    focusable: true,
  });

  useEffect(() => {
    focusSelf();
  }, [channel]);

  const refSchedule = useRef<HTMLDivElement>(null);

  const onFocus = useCallback(
    ({y}: { y: number }) => {

      refSchedule.current?.scrollTo({
        top: (y - 200),
      });
    },
    [refSchedule]
  );

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'max-h-screen'}>
        <div className={'h-1/2'}>
          <div className={'flex my-4 h-1/6'}>
            {channel && Object.values(channel).map((channel: any) => (
              <ResolutionButton key={channel.name}
                                active={channelSelected && channelSelected.name === channel.name}
                                title={channel.name}
                                onEnterPress={() => onEnterPress(channel)}/>
            ))}

            <ButtonTest onEnterPress={() => handleClickFullscreen(player)}/>
          </div>
          {channelSelected && (
            <div>
              <ReactPlayer
                ref={(refPlayer) => player = refPlayer}
                playing={true}
                config={{file: {forceHLS: true}}}
                height='100%'
                width='100%'
                url={channelSelected.url}/>
            </div>
          )}
        </div>
        <div ref={refSchedule} className={'h-1/2 overflow-y-scroll pb-3'}>
          {channelSchedule && channelSchedule.map((item: any) => (
            <MenuItem key={item.attributes.start}
                      title={`${DateTime.fromFormat(item.attributes.start, "yyyyMMddHHmmss ZZZ", {locale: "pt-br"}).toFormat('ccc dd T')}
              -
              ${DateTime.fromFormat(item.attributes.stop, "yyyyMMddHHmmss ZZZ", {locale: "pt-br"}).toLocaleString(DateTime.TIME_24_SIMPLE)}
              ${item.children[0].value}`}
                      onFocus={onFocus}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
}

const handleClickFullscreen = (player: any) => {
  const node = findDOMNode(player);
  if (!node) {
    return;
  }

  // @ts-ignore
  screenfull.request(node);
}

function ResolutionButton({title, onEnterPress, onFocus, active}: any) {

  const {ref, focused} = useFocusable({
    onEnterPress,
    onFocus
  });

  let name = title;
  if (name.indexOf('SD') > 0) {
    name = name.substring(name.indexOf('SD'), name.length);
  }
  if (name.indexOf('FHD') > 0) {
    name = name.substring(name.indexOf('FHD'), name.length);
  }
  if (name.indexOf('HD') > 0) {
    name = name.substring(name.indexOf('HD'), name.length);
  }
  if (name.indexOf('[4K]') > 0) {
    name = name.substring(name.indexOf('[4K]'), name.length);
  }
  if (name.indexOf('4K') > 0) {
    name = name.substring(name.indexOf('4K'), name.length);
  }

  let styleClassName = 'border-gray-800 rounded-full p-2 h-10';
  styleClassName += focused ? ' bg-gray-700' : '';
  styleClassName += active ? ' bg-gray-300 text-primary-600' : ' text-white';

  return <div ref={ref} className={`${styleClassName}`}>
    {name}
  </div>;
}

function ButtonTest({player, onEnterPress}: any) {

  const {ref, focused} = useFocusable({
    onEnterPress,
  });

  let styleClassName = 'text-white border-gray-800 rounded-full p-2';
  styleClassName += focused ? ' bg-gray-700' : '';

  return <div ref={ref} className={styleClassName}>
    Fullscrenn
  </div>;
}

function MenuItem({title, onEnterPress, onFocus, extraProps, onBlur, active}: any) {

  const {ref, focused} = useFocusable({
    onEnterPress,
    onFocus,
    onBlur,
    saveLastFocusedChild: true,
    extraProps: {extraProps}
  });

  let styleClassName = 'border-gray-800 border-b-2 p-2';
  styleClassName += focused ? ' bg-gray-700' : '';
  styleClassName += active ? ' bg-gray-300 text-primary-600' : ' text-white';

  return <div ref={ref} className={`${styleClassName}`}>
    {title}
  </div>;
}

const ActiveSchedule = lazy(() => import('./ActiveSchedule'));

function MenuItem2({title, onEnterPress, onFocus, extraProps, active}: any) {
  const {ref, focused} = useFocusable({
    onEnterPress,
    onFocus,
    extraProps: extraProps
  });

  let styleClassName = 'border-gray-800 border-b-2 p-2';
  styleClassName += focused ? ' bg-gray-700' : '';
  styleClassName += active ? ' bg-gray-300 text-primary-600' : ' text-white';

  return <div ref={ref} className={`${styleClassName}`}>
    {title}
    <Suspense fallback={<h1>Still Loading…</h1>}>
      <ActiveSchedule channelId={extraProps.tvg.id}/>
    </Suspense>
  </div>;
}

function LiveTV() {
  const [channelCategories, setChannelCategories] = useState<any>(null);
  const [channels, setChannels] = useState<any>(null);
  const [channel, setChannel] = useState<PlaylistItem[] | null>(null);
  const [channelSelected, setChannelSelected] = useState<PlaylistItem | null>(null);
  const [schedules, setSchedules] = useState<any | null>(null);

  const [channelSchedule, setChannelSchedule] = useState<any | null>(null);
  const [mainLoader, setMainLoader] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      // fetch(process.env.PUBLIC_URL + '/list/playlist_half.txt')
      fetch(process.env.PUBLIC_URL + '/list/playlist_half.txt')
        .then(res => res.text())
        .then(data => {

          fetch(process.env.PUBLIC_URL + '/list/epg_full.xml')
            //   fetch('http://epg.pfsv.io')
            .then(res => res.text())
            .then(dataXML => {
              const xml = new XMLParser().parseFromString(dataXML);
              const schedules = _.groupBy(
                xml.getElementsByTagName('programme'),
                (item) => {
                  return item.attributes.channel
                });

              setSchedules(schedules);

              /*********** finm********/

              const playlist: Playlist = parser.parse(data);

              const channelList: PlaylistItem[] = Object.values(playlist.items)
                .filter((item: PlaylistItem) => {
                  return item.url.indexOf('.m3u8') > 0;
                });

              let channelCategories: any = _.groupBy(channelList, (item: any) => {
                if(item.group.title.indexOf('|') === -1){
                  return item.group.title;
                }

                return item.group.title.split('|')[1]?.trim();
              });

              Object.keys(channelCategories).forEach((channelCategory: string) => {

                channelCategories[channelCategory] = _.groupBy(channelCategories[channelCategory], (channel: any) => {

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
              });

              setChannelCategories(channelCategories);

              setMainLoader(false);
            });
        });
    };

    fetchData();
  }, []);

  const onChannelCategoryPress = useCallback((channelCategory: any) => {
    setChannels(channelCategories[channelCategory]);
  }, [channelCategories]);

  const onChannelPress = useCallback((channelCategory: string, channel: PlaylistItem) => {
    setChannel(channels[channelCategory]);
    setChannelSelected(channel);

    // setChannelSchedule(schedules[channel.tvg.id]);
    setChannelSchedule(schedules[channel.tvg.id] && schedules[channel.tvg.id].filter((item: any) => {
      const dateStart = DateTime.fromFormat(item.attributes.start, "yyyyMMddHHmmss ZZZ").toMillis()
      const dateStop = DateTime.fromFormat(item.attributes.stop, "yyyyMMddHHmmss ZZZ").toMillis()
      const dateNow = DateTime.local().toMillis();
      return dateNow <= dateStart || (dateNow >= dateStart && dateNow <= dateStop);
    }));


  }, [channels]);

  const onChannelResolutionPress = useCallback((_channel: any) => {
    if(_channel.name === channelSelected?.name){
      handleClickFullscreen(player);
    }

    setChannelSelected(_channel);
  }, [channelSelected]);

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if(event.keyCode === 1009 || event.keyCode === 8){
      screenfull.exit();
    }
  });

  return (
    <ScheduleContext.Provider value={{schedules, setSchedules}}>
      <div className={'w-full h-full'}>
        {mainLoader && <div className={'w-full h-full flex justify-center items-center'}>
            <LoaderCircle/>
        </div>}

        {!mainLoader && <div className="grid grid-cols-3 gap-0 h-full">
          {channelCategories &&
              <Menu channelCategories={channelCategories}
                    onEnterPress={onChannelCategoryPress}
                    setMainLoader={setMainLoader}/>}
          {channels &&
              <Menu2 channels={channels}
                     onEnterPress={onChannelPress}
                     setChannelSchedule={setChannelSchedule}
                     schedules={schedules}/>}
          {channel &&
              <Menu3 channel={channel}
                     onEnterPress={onChannelResolutionPress}
                     channelSelected={channelSelected}
                     channelSchedule={channelSchedule}/>}
        </div>}
      </div>
    </ScheduleContext.Provider>
  )
}

export default LiveTV;
