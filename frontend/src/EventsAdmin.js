import React, { useRef, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

function EventsAdmin() {
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", e.target?.event_name.value);
    data.append("description", e.target?.event_desc.value);
    data.append("date", e.target?.event_date.value);
    data.append("image", e.target?.event_image.files[0]);
    data.append("rulebook", e.target?.event_rulebook.value);
    data.append("color", e.target?.color.value);
    data.append("categories", e.target?.categories.value);
    data.append("participants", e.target?.participants.value);
    data.append("googleFormSvnitian", e.target?.categories.value);
    data.append("googleFormNonSvnitian", e.target?.participants.value);
    setStatus(true);
    const res = await axios.post(
      `${process.env.REACT_APP_BACKENDURL}api/events-admin/add-events`,
      data,
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
    setStatus(false);
    setMessage(res.data.message);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Event Add</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "500px",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column" }}>
          Event Name:
          <input
            type="text"
            name="event_name"
            placeholder="Enter the name of the event"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Event Description:
          <input
            type="text"
            name="event_desc"
            placeholder="Enter the description of the event"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Date:
          <input type="date" name="event_date" placeholder="Enter date time" />
        </label>
        <label>
          Event Image:
          <br />
          <input type="file" name="event_image" accept="image/*" />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Rulebook url:
          <input
            type="url"
            name="event_rulebook"
            placeholder="Enter rulebook url"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Color:
          <input type="text" name="color" placeholder="Enter Color" />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Categories:
          <select name="categories">
            <option value={null}>--- Select Option ---</option>
            <option value="proshows">Proshows</option>
            <option value="design_and_digital_arts">
              Design and dgital arts
            </option>
            <option value="speaking_arts">Speaking art</option>
            <option value="school_events">School Events</option>
            <option value="creative_thinking_and_personality">
              Creative thinking and personality
            </option>
            <option value="grooming">Grooming</option>
            <option value="singing">Singing</option>
            <option value="dancing">Dancing</option>
            <option value="art_of_color">Art of Color</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          googleFormSvnitian:
          <input
            type="text"
            name="googleFormSvnitian"
            placeholder="Enter googleFormSvnitian"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          googleFormNonSvnitian:
          <input
            type="text"
            name="googleFormNonSvnitian"
            placeholder="Enter googleFormNonSvnitian"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Number of participants:
          <label>
            <input type="radio" value="solo" name="participants" />
            Solo:
          </label>
          <label>
            <input type="radio" value="duo" name="participants" />
            Duo:
          </label>
          <label>
            <input type="radio" value="group" name="participants" />
            Group:
          </label>
        </label>
        <label>
          <button style={{ width: "100%", height: "50px" }}>
            {status ? <ClipLoader size={20} /> : "Add Event"}
          </button>
        </label>
        {message && (
          <h5
            style={{
              color: "#fff",
              backgroundColor: "#ff0330",
              padding: "5px",
            }}
          >
            {message}
          </h5>
        )}
      </form>
    </div>
  );
}

export default EventsAdmin;
