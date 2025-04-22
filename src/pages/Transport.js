import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import AWS from "../AWS/aws-config";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUberLyftDocument,
  uploadUberLyftDocuments,
} from "../store/slice/billingSlice";
import { leadByID } from "../store/slice/leadSlice";
import { ErrorAlert, SuccessAlert } from "../Common/Alert";

const Transport = (props) => {
  const LeadIData = useSelector((state) => state.lead.leadByIDGet.data.data);
  const dispatch = useDispatch();
  const [getLoading, setLoading] = useState(false);
  const s3 = new AWS.S3();
  const [randomName, setRandomName] = useState([]);
  const [dataUploaded, setDataUploaded] = useState(false);

  const AdminRole = useSelector(
    (state) => state?.admindata?.adminData?.data?.role
  );
  
  const [files, setFiles] = useState([]);
  const removeFile = (indexToRemove) => {
    // Create a copy of the files array
    const updatedFiles = [...files];

    // Remove the element at the specified index
    updatedFiles.splice(indexToRemove, 1);

    // Update the state with the new array
    setFiles(updatedFiles);
  };

  useEffect(() => {
    if (props.data && !dataUploaded) {
      UploadData();
      setDataUploaded(true);
    }
  }, [props]);

  const UploadData = async () => {
    try {
      setLoading(true);
      const uploadPromises = files.map((file) => {
        let a = file.name.replace(" ", "_").replace("'", "");

        const newFileName = new Date().getTime() + "_" + a;

        const params = {
          Bucket: "ihcms/uber_lyft",
          Key: newFileName,
          Body: file,
          ACL: "public-read",
        };

        return new Promise((resolve, reject) => {
          s3.putObject(params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              randomName.push(newFileName);

              resolve(newFileName);
            }
          });
        });
      });

      await Promise.all(uploadPromises);

      const res = await dispatch(
        uploadUberLyftDocuments({
          lead_id: LeadIData?.id,
          documents: randomName,
        })
      );
      dispatch(leadByID({ lead_id: LeadIData?.id }));
      setRandomName([]);
      setFiles([]);
      setLoading(false);

      // navigate(-1);
    } catch (error) {}
  };

  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter(
      (file) =>
        file.type === "application/msword" || // for .doc
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // for .docx
        file.type === "application/pdf"
    );
    setFiles([...files, ...filteredFiles]);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".doc, .docx, .pdf", // Allow only specified file types
  });
  return (
    <div className="customdrop">
      <h5>Transportation File Uploader</h5>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <div className="file-list">
        <p>Uploaded Files:</p>
        <ul>
          {LeadIData?.uberLyftDocument?.map((file, index) => {
            return (
              <div className="d-flex">
                <li
                  key={index}
                  onClick={() => window.open(file?.document, "_blank")}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                  }}
                >
                  {
                    file.document.split("/")[
                      file.document.split("/").length - 1
                    ]
                  }{" "}
                </li>
                {AdminRole === "Admin" ? (
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => {
                      dispatch(
                        deleteUberLyftDocument({
                          document_id: file?.id,
                          lead_id: file?.lead_id,
                        })
                      ).then((res) => {
                        if (res.payload.code == 1) {
                          SuccessAlert(res.payload.message);
                          dispatch(
                            leadByID({
                              lead_id: LeadIData?.id,
                            })
                          );
                        } else {
                          ErrorAlert(res.payload.message);
                        }
                      });
                    }}
                  ></button>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
          {files?.map((file, index) => (
            <li key={index}>
              {file.name}{" "}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => {
                  removeFile(index);
                }}
              ></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transport;
