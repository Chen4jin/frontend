import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { BACKEND, API_VERSION } from "../common/common";

const Upload = () => {
    const [fileCollections, updateFileCollections] = useState([]);

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            updateFileCollections([
                ...fileCollections,
                {
                    id: uuidv4(),
                    data: event.target.files[0],
                    state: "pending",
                },
            ]);
        }
        //
    };
    const handleUpload = async () => {

        const collections = [...fileCollections];
        for (let i = 0; i < collections.length; i++) {
            const formData = new FormData();
            formData.append("files", collections[i].data);
            try {
                const responseData = (await axios.put(BACKEND + API_VERSION + "images")).data["data"]
                const signedURL = responseData["url"];
                const imageID = responseData["imageID"];
                const response = await axios.put(signedURL, collections[i].data, {
                    headers: {
                        "Content-Type": "image/jpeg",
                    },
                });
                let item = {};
                if (response && response.status === 200) {
                    item = {
                        ...collections[i],
                        state: "success",

                    };
                    await axios.post(BACKEND + API_VERSION + "images", {
                        imageID: imageID,
                        fileName: collections[i].data.name,
                        sizeBytes: collections[i].data.size,
                        });
                } else {
                    item = {
                        ...collections[i],
                        state: "server side error",
                    };
                }
                collections[i] = item;
                updateFileCollections(collections);
            } catch (error) {
                let item = {
                    ...collections[i],
                    state: "client side error",
                };
                collections[i] = item;
                updateFileCollections(collections);
            }
        }
    };
    const resetFileCollections = () => {
        updateFileCollections([]);
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                file Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                state
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {fileCollections.map((file) => (
                            <tr key={file.id || file.data.name} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {file.data.name}
                                </th>
                                <td className="px-6 py-4">{file.state}</td>
                            </tr>
                        ))}
                        {3 - fileCollections.length > 0 &&
                            [...Array(3 - fileCollections.length)].map((_, i) => (
                                <tr key={i} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                    <th
                                        scope="row"
                                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    ></th>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="text-right">
                <button
                    type="button"
                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2 "
                    onClick={resetFileCollections}
                >
                    Reset
                </button>
                <button
                    type="button"
                    className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2"
                    onClick={handleUpload}
                >
                    Upload Files
                </button>
            </div>
        </div>
    );
};

export default Upload;
