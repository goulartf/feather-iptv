import React, {useCallback, useEffect, useState} from "react";
import {FocusContext, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import {PlaylistItem} from 'iptv-playlist-parser';
import ListCenterItem from "./ListCenterItem";

interface Props {
  channels: PlaylistItem[][];
  onEnterPress: (title: string, channel: PlaylistItem) => void;
}
export default function ListCenter({channels, onEnterPress}: Props) {
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
          <ListCenterItem key={title}
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
