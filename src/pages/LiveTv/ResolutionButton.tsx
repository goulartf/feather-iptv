import {useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React from "react";

export default function ResolutionButton({title, onEnterPress, onFocus, active}: any) {

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
