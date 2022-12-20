import "./newKamar.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { kamarInputs } from "../../formSource";
import axios from "axios";
import { addKamar } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import { userRequest } from "../../requestMethods";

const NewKamar = () => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        try {
            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/sardor-s-company/image/upload",
                data
            );

            const { url } = uploadRes.data;

            const newKamar = {
                ...info,
                img: url,
            };

            addKamar(newKamar, dispatch);
            navigate("/kamars");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="new">
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Add New Kamar</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img src={
                            file
                                ? URL.createObjectURL(file)
                                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                        }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form >
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    multiple
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {kamarInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                    />
                                </div>
                            ))}

                            <div className="formInput">
                                <label>In Dollar</label>
                                <input
                                    id="price_in_dollar"
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="In Dollar"
                                    min="0" step="any"
                                />
                            </div>

                            <button onClick={handleClick}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewKamar;