import { useDispatch, useSelector } from "react-redux";
import { settingsActions } from "../state";
import { useState } from "react";

function TimeRange({ options, current, setCurrent }) {
  const getCurrentValue = (value) =>
    options.find((option) => option.value === value).inputValue;
  const findNewValue = (inputValue) =>
    options.find((option) => option.inputValue === inputValue).value;
  const [value, setValue] = useState(getCurrentValue(current));
  const handleChange = (e) => {
    setValue(e.target.value);
    setCurrent(findNewValue(e.target.value));
  };
  return (
    <div>
      <div className="text-current opacity-70">Expire reservation in</div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="range"
        step="25"
        onChange={handleChange}
      />
      <div className="w-full flex justify-between text-xs px-2">
        {options.map((option, index) => (
          <span key={index}>{option.text}</span>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const expiresInOptions = [
    { text: "1 min", inputValue: "0", value: 1 },
    { text: "5 min", inputValue: "25", value: 5 },
    { text: "10 min", inputValue: "50", value: 10 },
    { text: "15 min", inputValue: "75", value: 15 },
    { text: "20 min", inputValue: "100", value: 20 },
  ];
  const { theme, expiresIn } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const isLightMode = () => theme === "light";
  const toggleTheme = () =>
    dispatch({
      type: isLightMode()
        ? settingsActions.turnDarkTheme
        : settingsActions.turnLightTheme,
    });

  const setExpiresIn = (value) =>
    dispatch({ type: settingsActions.setExpiresIn, payload: value });
  return (
    <div>
      {/* Setting model button */}
      <button
        className="btn btn-circle btn-ghost absolute bottom-0 left-0 m-4 z-10"
        onClick={() => window.my_modal_2.showModal()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <dialog id="my_modal_2" className="modal">
        <div method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Settings</h3>
          {/* THEME BUTTON */}

          <div className="flex flex-col gap-4">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={toggleTheme}
            >
              {isLightMode() ? (
                <div className="flex gap-2 justify-center items-center">
                  <span>Dark Mode</span>
                  {/* moon icon */}
                  <svg
                    className=" join-item  fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </div>
              ) : (
                <div className="flex gap-2 justify-center items-center">
                  <span>Light Mode</span>

                  {/* sun icon */}
                  <svg
                    className="join-item fill-current w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                </div>
              )}
            </button>

            {/* notify me before */}
            <div>
              <div className="text-current opacity-70"> Notify me before</div>
              <input
                type="range"
                min={0}
                max="100"
                // value="25"
                className="range"
                step="25"
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>5 mins</span>
                <span>10 mins</span>
                <span>15 mins</span>
                <span>20 mins</span>
                <span>30 mins</span>
              </div>
            </div>
            <TimeRange
              options={expiresInOptions}
              current={expiresIn}
              setCurrent={setExpiresIn}
            />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
