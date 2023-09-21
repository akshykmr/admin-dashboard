import React,{useContext}  from "react";
import './Eventcard.css'
import img from './../../21788.png'
import { MdDateRange} from 'react-icons/md'
import { ThemeContext } from "../../context/Themes";



export default function EventCard({ events, type }) {

  const { theme } = useContext(ThemeContext);

  return (
    <>
      <div className={`eventCard ${theme === "dark_mode" ? "eventCard_dark" : "eventCard_light"}`}>
        {type === "Ongoing_Events" &&
        <div class="confetti">
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
      </div>}
        <div className="imgbody">
        
            <img src="https://i.pinimg.com/originals/14/a6/3a/14a63a51c6da4e4ec6bea98d908043b3.jpg" alt="" />
        </div>

         <div className="text">
        <p className="h3">{events.Event_Name}</p>
        <span className="subheading">
          <MdDateRange />
          <p className="p">{events.Event_Date}, </p>
          <p className="p">{events.Event_Start_Time}</p>
        </span>
      </div>
      </div>
    </>
  );
}
