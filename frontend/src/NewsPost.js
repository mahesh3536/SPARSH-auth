import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

function NewsPost() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  const fetchedData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKENDURL}api/news-api/get-news`
    );
    setData((prev) => [...res.data.data]);
  };

  useEffect(() => {
    fetchedData();
  }, []);

  const handleSubmit = async (e) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "30px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "30px",
          width: "90%",
        }}
      >
        <label>
          Title:
          <br />
          <input type={"text"} name="title" style={{ width: "90%" }} />
        </label>
        <label>
          Image:
          <br />
          <input type="file" name="image" accept="image/*" />
        </label>
        <label>
          Content:
          <br />
          <textarea
            name="content"
            style={{ width: "90%", height: "200px" }}
          ></textarea>
        </label>
        <label>
          <button style={{ width: "90%", height: "40px" }} disabled={isLoading}>
            {isLoading && <ClipLoader size={20} />} Add Post
          </button>
        </label>
      </form>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "15px",
          width: "90%",
        }}
      >
        {data.map((item, index) => (
          <div style={{ backgroundColor: "#ccc", padding: "5px" }}>
            <img
              src={item.imageURL}
              style={{ width: "250px", height: "250px" }}
            />
            <p style={{ fontSize: "20px" }}>{item.title}</p>
            <p style={{ maxWidth: "250px" }}>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsPost;
