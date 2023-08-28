import React, {useCallback, useEffect, useState} from "react";
import {FocusContext, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import ListItem from "./ListItem";
import {PlaylistItem} from 'iptv-playlist-parser';

interface Props {
  channelCategories: PlaylistItem[];
  onEnterPress: (categoryChannel: string) => void;
  setMainLoader: (loading: boolean) => void
}

export default function ListLeft({channelCategories, onEnterPress, setMainLoader}: Props) {
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
    focusSelf();
    setMainLoader(false);
  }, [focusSelf, setMainLoader]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref} className={'overflow-y-auto h-full border-gray-800 border-r-2'}>
        {channelCategories && Object.keys(channelCategories).map((title: string) => (
          <ListItem key={title}
                    title={title}
                    onEnterPress={() => interceptEnterPress(title)}
                    active={itemActive === title}
                    onFocus={onFocus}/>
        ))}
      </div>
    </FocusContext.Provider>
  );
}
