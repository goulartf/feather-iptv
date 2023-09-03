import {useFocusable} from "@noriginmedia/norigin-spatial-navigation";
import React, {useContext, useState} from "react";
import {UserContext} from "../Contexts";
import User from "../interfaces/User";

function Input({type = 'text', name, required, value, placeholder}: {
  type?: string,
  name: string,
  required?: boolean,
  value?: string
  placeholder?: string
}) {
  const {ref, focused} = useFocusable({
    focusable: true,
    onEnterPress: () => {
      ref.current.focus();
    }
  });

  return <input ref={ref}
                required={required}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                className={`form-input w-full text-white bg-gray-700 ${focused ? 'outline outline-offset-2 outline-1' : ''}`}/>;
}

function Button({text = '', type = 'button', onEnterPress, className, focusClassName}: {
  text?: string,
  type?:  "button" | "reset" | "submit" | undefined,
  onEnterPress?: () => void,
  className?: string
  focusClassName?: string
}) {
  if(type === 'submit'){
    onEnterPress = () => {
      ref.current.click();
    }
  }

  const {ref, focused} = useFocusable({
    focusable: true,
    onEnterPress
  });

  return <button
    ref={ref}
    className={`${className} ${focused ? focusClassName : ''}` }
    type={type}
  >
    {text}
  </button>;
}

function UserForm({cancelAction}: { cancelAction: () => void }) {
  const [setItem, getItem] = useContext(UserContext);
  const [isSuccess, setIsSuccess] = useState<boolean|null>(null);
  const [isDeleted, setIsDeleted] = useState<boolean|null>(null);
  const [user, setUser] = useState<User|null>(getItem());

  function handleSubmit(e: { preventDefault: () => void; target: any; }) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    setItem(formJson);
    setIsSuccess(true);
  }

  function deleteUser() {
    setItem(null);
    setUser(null);
    setIsDeleted(true);
  }

  return (
    <div
      className="border-0 rounded-lg shadow-lg relative flex flex-col w-96 bg-gray-800 outline-none focus:outline-none">
      {/*header*/}
      <div className="flex items-start justify-between p-5 border-b border-solid border-gray-700 rounded-t">
        <h3 className="text-3xl text-white font-semibold">
          User
        </h3>
        <button
          className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
        >
          <span
            className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
        </button>
      </div>
      {/*body*/}
      <form method="post" onSubmit={handleSubmit}>
        <div className="relative p-6 flex flex-col w-full">

          {isSuccess &&
          <div
            className="mb-4 rounded-lg bg-emerald-900 px-6 py-5 text-base text-slate-300"
            role="alert">
            User saved successfully!
          </div>
          }

          {isDeleted &&
          <div
            className="mb-4 rounded-lg bg-emerald-900 px-6 py-5 text-base text-slate-300"
            role="alert">
            User deleted successfully!
          </div>
          }

          <label className="block mb-4">
            <span className="text-white">Host URL</span>
            <br/>
            <Input placeholder={'https://host.com'} name={'host'} value={user?.host} required={true}/>
          </label>
          <label className="block mb-4">
            <span className="text-white">Username</span>
            <br/>
            <Input name={'username'} value={user?.username} required={true}/>
          </label>
          <label className="block mb-4">
            <span className="text-white">Password</span>
            <br/>
            <Input type={'password'} value={user?.password} name={'password'} required={true}/>
          </label>
          <label className="block">
            <span className="text-white">EPG URL (optional)</span>
            <br/>
            <Input name={'epgUrl'} placeholder={'https://epg.host.com'} value={user?.epgUrl}/>
          </label>
        </div>
        {/*footer*/}
        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-700 rounded-b">
          <Button text={'Close'}
                  type={'button'}
                  focusClassName={'!bg-gray-700'}
                  className={'text-slate-300 bg-gray-900 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'}
                  onEnterPress={cancelAction}
          />
          <Button text={'Delete'}
                  type={'button'}
                  focusClassName={'!bg-rose-700'}
                  className={'text-red-200 bg-rose-950 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'}
                  onEnterPress={deleteUser}
          />
          <Button text={'Save'}
                  type={'submit'}
                  focusClassName={'!bg-emerald-700'}
                  className={'text-slate-300 bg-emerald-900 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'}
          />
        </div>
      </form>
    </div>
  );
}

export default UserForm;
