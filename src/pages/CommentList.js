import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Table } from "antd";
import { useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
export default function CommentList() {
  const location = useLocation();
  const isLoading = useSelector((state) => state.admindata.isLoading);
  const LeadIData = useSelector((state) => state.lead.leadByIDGet.data.data);
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    if (LeadIData?.additionalData?.comments?.length > 0) {
      setComments(LeadIData.additionalData.comments);
    } else if (location.state?.comments) {
      setComments(location.state.comments);
    }
  }, [LeadIData, location.state]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Comment Type",
      dataIndex: "commentType",
      key: "commentType",
      render: (type) => (
        <span
          style={{
            backgroundColor:
              type === "medical"
                ? "lightgreen"
                : type === "attorney"
                ? "lightblue"
                : "white",
            color: "black",
            padding: "5px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          {type?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
      render: (comment) =>
        comment.length > 50 ? `${comment.slice(0, 50)}...` : comment,
    },
  ];

  return (
    <>
    {isLoading && <Loader />}
      <div className="tap-top">
        <i data-feather="chevrons-up"></i>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="page-title">
                <div className="row">
                  <div className="col-6">
                    <h4>Comment Lists</h4>
                  </div>
                  <div className="col-6">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">Comments</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <Table
                columns={columns}
                dataSource={comments.map((comment, index) => ({
                  id: index + 1,
                  commentType: comment.type,
                  comment: comment.comment,
                }))}
                rowKey="id"
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
