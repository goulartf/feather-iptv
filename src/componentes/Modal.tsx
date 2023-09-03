import React, {useEffect} from 'react';
import {useFocusable, FocusContext} from '@noriginmedia/norigin-spatial-navigation';

interface Props {
  children: any;
  close?: () => void;
}

export default function Modal({close, children}: Props) {
  const {ref, focusKey, focusSelf} = useFocusable({
    isFocusBoundary: true,
    focusable: true,
  });

  useEffect(() => {
    focusSelf();
  }, [focusSelf]);

  return (
    <FocusContext.Provider value={focusKey}>
      <div ref={ref}>
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              { children }
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      </div>
    </FocusContext.Provider>
  );
}
