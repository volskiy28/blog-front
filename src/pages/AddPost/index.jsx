import React, { useRef, useState, useCallback, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { isAuthSelect } from "../../Redux/slices/auth";
import { useParams } from "react-router-dom";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const isAuth = useSelector(isAuthSelect);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        text,
        tags,
      };
      const { data } = await axios.post("/posts", fields);
      const id = data._id;
      navigate(`/posts/${id}`);
    } catch (err) {
      console.warn("Can't create post");
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
  });

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        style={{ marginRight: 20 }}
        onClick={() => inputRef.current.click()}
        variant="outlined"
        size="large"
      >
        Upload preview
      </Button>
      <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Publish
        </Button>
        <a href="/">
          <Button size="large">Decline</Button>
        </a>
      </div>
    </Paper>
  );
};
