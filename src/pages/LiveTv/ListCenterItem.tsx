import {useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React, {lazy, Suspense} from "react";
const ActiveSchedule = lazy(() => import('./ActiveSchedule'));

export default function ListCenterItem({title, onEnterPress, onFocus, extraProps, active}: any) {
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
