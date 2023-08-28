import {FocusableComponentLayout, FocusDetails, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React from "react";

interface Props {
  title: string;
  onEnterPress?: () => void;
  onFocus?: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
  extraProps?: any;
  onBlur?: (
    layout: FocusableComponentLayout,
    props: object,
    details: FocusDetails
  ) => void;
  active?: boolean;
}

export default function ListItem({title, onEnterPress, onFocus, extraProps, onBlur, active}: Props) {

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
