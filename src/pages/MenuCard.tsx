import React from "react";
import {KeyPressDetails, useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import {Tv, Film, Youtube} from "react-feather";


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


  let styleClasses = `block w-1/3 h-2/3 p-6 m-6 flex flex-col justify-center items-center`;
  styleClasses += focused ? ' bg-gray-700' : ' bg-gray-800';
  styleClasses += ` border-gray-700 hover:bg-gray-700`;

  return <div ref={ref} className={styleClasses}>
    <h5 className="mb-2 text-6xl font-bold tracking-tight text-white">
      {title}
    </h5>
    { title === 'Tv Live' && <Tv color={'white'} size={72}/> }
    { title === 'Series' && <Youtube color={'white'} size={72}/> }
    { title === 'Movies' && <Film color={'white'} size={72}/> }
  </div>;
}

export default MenuCard;
