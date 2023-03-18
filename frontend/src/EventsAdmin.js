import React, { useRef } from "react";
import axios from "axios";

function EventsAdmin() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", e.target?.event_name.value);
    data.append("description", e.target?.event_desc.value);
    data.append("date", e.target?.event_date.value);
    data.append("image", e.target?.event_image.files[0]);
    data.append("rulebook", e.target?.event_rulebook.value);
    data.append("day", e.target?.event_day.value);
    data.append("type", e.target?.event_abc.value);
    data.append("participants", e.target?.participants.value);
    data.append("categories", e.target?.event_categories.value);

    const res = await axios.post(
      `${process.env.REACT_APP_BACKENDURL}api/events-admin/add-events`,
      data,
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Event Name:
        <input
          type="text"
          name="event_name"
          placeholder="Enter the name of the event"
        />
      </label>
      <br />
      <label>
        Event Description:
        <input
          type="text"
          name="event_desc"
          placeholder="Enter the description of the event"
        />
      </label>
      <br />
      <label>
        Date:
        <input type="date" name="event_date" placeholder="Enter date time" />
      </label>
      <br />
      <label>
        Event Image:
        <input type="file" name="event_image" accept="image/*" />
      </label>
      <br />
      <label>
        Rulebook url:
        <input
          type="url"
          name="event_rulebook"
          placeholder="Enter rulebook url"
        />
      </label>
      <br />
      <label>
        Sparsh Day:
        <label>
          1:
          <input type="radio" value="one" name="event_day" />
        </label>
        <label>
          2:
          <input type="radio" value="two" name="event_day" />
        </label>
        <label>
          3:
          <input type="radio" value="three" name="event_day" />
        </label>
      </label>
      <br />
      <label>
        Main Event
        <input type="radio" value="main" name="event_abc" />
      </label>
      <label>
        Normal Event:
        <input type="radio" value="normal" name="event_abc" />
      </label>
      <br />
      <label>
        Number of participants:
        <label>
          Solo:
          <input type="radio" value="solo" name="participants" />
        </label>
        <label>
          Duo:
          <input type="radio" value="duo" name="participants" />
        </label>
        <label>
          Group:
          <input type="radio" value="group" name="participants" />
        </label>
      </label>
      <br />
      <label>
        Categories (Enter categories in comma separated):
        <input
          type="text"
          name="event_categories"
          placeholder="Enter category"
        />
      </label>
      <br />
      <label>
        <input type="submit" value="Add the event" />
      </label>
    </form>
  );
}

export default EventsAdmin;
