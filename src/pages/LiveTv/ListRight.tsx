import {
  FocusableComponentLayout,
  FocusContext,
  useFocusable
} from "@noriginmedia/norigin-spatial-navigation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactPlayer, {ReactPlayerProps} from "react-player";
import {DateTime} from "luxon";
import ListItem from "./ListItem";
import ResolutionButton from "./ResolutionButton";
import {PlaylistItem} from 'iptv-playlist-parser';
import {findDOMNode} from "react-dom";
import screenfull from "screenfull";
import LoaderCircle from "../LoaderCircle";

interface Props {
  channel: PlaylistItem[];
  channelSchedule?: any;
  playerRef: ReactPlayer | null
}

const handleClickFullscreen = (player: any) => {
  const node = findDOMNode(player);
  if (!node) {
    return;
  }

  // @ts-ignore
  screenfull.request(node);
}

export default function ListRight({channel, channelSchedule, playerRef}: Props) {
  const [channelSelected, setChannelSelected] = useState<PlaylistItem | null>(null);
  const [playerLoading, setPlayerLoading] = useState<boolean>(true);
  const {
    ref,
    focusSelf,
    focusKey
  } = useFocusable({
    focusable: true
  });

  const onChannelResolutionPress = useCallback((_channel: PlaylistItem) => {
    setPlayerLoading(true);
    if(_channel.name === channelSelected?.name){
      handleClickFullscreen(playerRef);
      return;
    }

    if(_channel.name !== channelSelected?.name){
      setChannelSelected(_channel);
    }
  }, [channelSelected]);

  useEffect(() => {
    focusSelf();
    setPlayerLoading(true);
    setChannelSelected(channel[0]);
  }, [channel]);


  const onPlayerPlay = async (): Promise<void> => {
    await new Promise(res => setTimeout(res, 1500));

    setPlayerLoading(false);
  }
  const onPlayerStart = async () => {
    await new Promise(res => setTimeout(res, 1500));

    setPlayerLoading(false);
  }

  const refSchedule = useRef<HTMLDivElement>(null);

  const onFocus = useCallback(
    ({y}: FocusableComponentLayout) => {

      refSchedule.current?.scrollTo({
        top: (y - 200),
      });
    },
    [refSchedule]
  );

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if(event.keyCode === 1009 || event.keyCode === 8){
      screenfull.exit();
    }
  });

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'max-h-screen'}>
        <div className={'h-1/2'}>
          <div className={'flex my-4 h-1/6'}>
            {channel && Object.values(channel).map((channel: any) => (
              <ResolutionButton key={channel.name}
                                active={channelSelected && channelSelected.name === channel.name}
                                title={channel.name}
                                onEnterPress={() => onChannelResolutionPress(channel)}/>
            ))}
          </div>
          {channelSelected && (
            <div className={'relative'}>
              { playerLoading && <div className={'absolute block top-1/3 left-1/3'}><LoaderCircle /></div> }
              <ReactPlayer
                ref={(refPlayer) => playerRef = refPlayer}
                playing={true}
                config={{file: {forceVideo: true}}}
                height='100%'
                width='100%'
                onPlay={onPlayerPlay}
                onStart={onPlayerStart}
                url={channelSelected.url}/>
            </div>
          )}
        </div>
        <div ref={refSchedule} className={'h-1/2 overflow-y-scroll pb-3'}>
          {channelSchedule && channelSchedule.map((item: any) => (
            <ListItem key={item.attributes.start}
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
