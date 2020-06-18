import { useState, useEffect } from "react";
import {
  Form,
  Input,
  TextArea,
  Button,
  Image,
  Message,
  Header,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: "",
};

function CreateProduct() {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const isProduct = Object.values(product).every((el) => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  const handleImageUpload = async () => {
    try {
      const data = new FormData();
      data.append("file", product.media);
      data.append("upload_preset", "reserve");
      const response = await axios.post(process.env.CLOUDINARY_URL, data);
      const mediaUrl = response.data.url;
      return mediaUrl;
    } catch (error) {
      catchErrors(error, setError);
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "media") {
      setProduct((prevState) => ({ ...prevState, media: files[0] }));
      setMediaPreview(window.URL.createObjectURL(files[0]));
    } else {
      setProduct((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const payload = { ...product, mediaUrl };
      await axios.post(url, payload);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Message error header="Oops!" content={error} />
        <Form.Group widths="equal">
          <Form.Field
            required
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            required
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Field
            required
            control={Input}
            name="media"
            label="Media"
            content="Select Image"
            accept="image/*"
            type="file"
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          required
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}
          color="blue"
          icon="pencil alternate"
          content="submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
