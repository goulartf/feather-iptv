import {useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React from "react";

function MenuItem(props: { title: any, onEnterPress?: any, onFocus?: any }) {
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

export default MenuItem;
