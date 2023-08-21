import React from "react";
import {KeyPressDetails, useFocusable} from "@noriginmedia/norigin-spatial-navigation";

interface MenuCardInterface {
  title: string;
  onEnterPress?: (props: object, details: KeyPressDetails) => void;
  onFocus?: (props: object, details: KeyPressDetails) => void
}

function MenuCard({title, onEnterPress, onFocus}: MenuCardInterface) {

  const {ref, focused} = useFocusable({
    onEnterPress,
    onFocus
  });

  let styleClasses = `block w-1/3 h-3/3 p-6 m-6`;
  styleClasses += focused ? ' bg-gray-700' : ' bg-gray-800';
  styleClasses += ` border-gray-700 hover:bg-gray-700`;

  return <div ref={ref} className={styleClasses} style={{display: 'block'}}>
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
      {title}
    </h5>
  </div>;
}

export default MenuCard;
