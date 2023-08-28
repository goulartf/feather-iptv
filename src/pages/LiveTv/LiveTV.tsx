import React, {lazy, Suspense, useCallback, useEffect, useRef, useState} from 'react';
import parser, {Playlist, PlaylistItem} from 'iptv-playlist-parser';
import * as _ from 'underscore';
import ReactPlayer from 'react-player';
import {findDOMNode} from 'react-dom';
import screenfull from 'screenfull';
import {DateTime} from "luxon";
import {ScheduleContext} from "../../Contexts";
import LoaderCircle from "../LoaderCircle";
// @ts-ignore
import XMLParser from 'react-xml-parser';
import ListLeft from "./ListLeft";
import ListCenter from "./ListCenter";
import ListRight from "./ListRight";

function LiveTV() {
  const [channelCategories, setChannelCategories] = useState<any>(null);
  const [channels, setChannels] = useState<PlaylistItem[][] | null>(null);
  const [channel, setChannel] = useState<PlaylistItem[] | null>(null);
  const [schedules, setSchedules] = useState<any | null>(null);
  const [channelSchedule, setChannelSchedule] = useState<any | null>(null);
  const [mainLoader, setMainLoader] = useState<boolean>(true);
  let playerRef: ReactPlayer | null = null;


  useEffect(() => {
    const fetchData = async () => {
      fetch(process.env.PUBLIC_URL + '/list/playlist_half.txt')
      // fetch(`http://pfsv.io/get.php?username=xxx&password=xxx&type=m3u_plus&output=hls`)
        .then(res => res.text())
        .then(data => {

          fetch(process.env.PUBLIC_URL + '/list/epg_full.xml')
          // fetch('http://epg.pfsv.io')
            .then(res => res.text())
            .then(dataXML => {
              const xml = new XMLParser().parseFromString(dataXML);
              const schedules = _.groupBy(
                xml.getElementsByTagName('programme'),
                (item) => {
                  return item.attributes.channel
                });

              setSchedules(schedules);

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
    setChannel(null);
    if (channels) {
      // @ts-ignore
      setChannel(channels[channelCategory]);
    }
    setChannelSchedule(schedules[channel.tvg.id] && schedules[channel.tvg.id].filter((item: any) => {
      const dateStart = DateTime.fromFormat(item.attributes.start, "yyyyMMddHHmmss ZZZ").toMillis()
      const dateStop = DateTime.fromFormat(item.attributes.stop, "yyyyMMddHHmmss ZZZ").toMillis()
      const dateNow = DateTime.local().toMillis();
      return dateNow <= dateStart || (dateNow >= dateStart && dateNow <= dateStop);
    }));

  }, [channels]);

  return (
    <ScheduleContext.Provider value={{schedules, setSchedules}}>
      <div className={'w-full h-full'}>
        {mainLoader && <div className={'w-full h-full flex justify-center items-center'}>
            <LoaderCircle/>
        </div>}

        {!mainLoader && <div className="grid grid-cols-3 gap-0 h-full">
          {channelCategories &&
              <ListLeft channelCategories={channelCategories}
                    onEnterPress={onChannelCategoryPress}
                    setMainLoader={setMainLoader} />}
          {channels &&
              <ListCenter channels={channels}
                     onEnterPress={onChannelPress} />}
          {channel &&
              <ListRight channel={channel}
                     channelSchedule={channelSchedule}
                     playerRef={playerRef}/>}
        </div>}
      </div>
    </ScheduleContext.Provider>
  )
}

export default LiveTV;
