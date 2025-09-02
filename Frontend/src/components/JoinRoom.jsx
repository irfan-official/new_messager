import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function JoinRoom() {
  const Navigate = useNavigate();

  let [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || ""
  );

  useEffect(() => {
    const check = JSON.parse(localStorage.getItem("user"));
    if (!check) {
      return Navigate("/login");
    }
    if (!userData) {
      setUserData(check);
    }
  }, []);

  let [groupTypes, setGroupTypes] = useState("");
  let [groupID, setGroupID] = useState("");
  let [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!groupTypes || !groupID) {
      alert("please submit form data");
      return;
    }
    // if (
    //   groupTypes != "Public" ||
    //   groupTypes != "Private" ||
    //   groupTypes != "ProtectedPrivate" ||
    //   groupTypes != "ProtectedPublic"
    // ) {
    //   alert(
    //     " groupTypes only be Public or Private or ProtectedPrivate or ProtectedPublic"
    //   );
    // }

    try {
      let obj = {
        userID: userData.userID,
        groupID,
        groupTypes,
        password: password || "",
      };

      let response = await axios.post(
        "http://localhost:3000/api/v1/joinroom",
        obj,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success) {
        alert(response.data.error);
        Navigate("/login");
      } else {
        Navigate("/");
      }
    } catch (err) {
      console.log("Login error =>", err);
      alert("Can not create group this time");
      Navigate("/login");
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="border border-violet-500 rounded-lg p-5 w-6/12 flex flex-col items-center gap-10">
        <h1 className="text-center text-6xl text-slate-600">Join Group</h1>
        <form
          onSubmit={handleSubmit}
          className=" w-full flex flex-col gap-3 p-3 rounded-md items-center justify-center"
        >
          <input
            onChange={(e) => setGroupID(e.target.value)}
            value={groupID}
            className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
            type="text"
            placeholder="groupID"
          />
          <select
            name="groupTypes"
            required
            value={groupTypes}
            onChange={(e) => setGroupTypes(e.target.value)}
            className="peer w-7/12 h-10 p-2 mt-1 border-b bg-slate-900 rounded-md border-violet-500 px-0 py-1  focus:outline-none text-white "
          >
            <option
              value=""
              disabled
              className="text-violet-300 bg-slate-600 font-semibold"
            >
              Group Types
            </option>
            <option className="bg-slate-600 " value="Public">
              Public
            </option>
            <option className="bg-slate-600" value="Private">
              Private
            </option>
            <option className="bg-slate-600" value="ProtectedPrivate">
              ProtectedPrivate
            </option>
            <option className="bg-slate-600" value="ProtectedPublic">
              ProtectedPublic
            </option>
          </select>

          {groupTypes === "ProtectedPrivate" ||
          groupTypes === "ProtectedPublic" ? (
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="px-3 py-3 rounded-md bg-slate-900 w-7/12"
              type="text"
              placeholder="password"
            />
          ) : (
            <></>
          )}

          <button
            type="submit"
            className="border mt-6 px-10 py-2 rounded-lg bg-violet-950 border-violet-700 text-slate-400 font-semibold hover:bg-violet-500 hover:text-slate-900"
          >
            Join
          </button>
        </form>
        <NavLink
          className={"text-violet-500 hover:text-violet-800"}
          to={"/create"}
        >
          want to create a Group
        </NavLink>
      </div>
    </div>
  );
}

export default JoinRoom;
