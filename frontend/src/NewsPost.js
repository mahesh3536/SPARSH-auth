import axios from "axios";
import React from "react";

function NewsPost() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", e.target?.title.value);
    data.append("image", e.target?.image.files[0]);
    data.append("content", e.target?.content.value);

    const res = await axios.post(
      `${process.env.REACT_APP_BACKENDURL}api/news-api/post-news`,
      data,
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>
          Title:
          <br />
          <input type={"text"} name="title" />
        </label>
        <label>
          Image:
          <br />
          <input type="file" name="image" accept="image/*" />
        </label>
        <label>
          Content:
          <br />
          <textarea name="content"></textarea>
        </label>
        <label>
          <button>Add Post</button>
        </label>
      </form>
    </div>
  );
}

export default NewsPost;
