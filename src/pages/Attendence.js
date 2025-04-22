import React, {useEffect, useState} from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar';

export default function Attendence() {
    const [loading, setLoading] = useState(true);

    const loadScript = (src) => {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script')
            script.src = src
            script.addEventListener('load', function () {
                resolve()
            })
            script.addEventListener('error', function (e) {
                reject(e)
            })
            document.body.appendChild(script)
            document.body.removeChild(script)
        })
    }
        
    useEffect(() => {
        loadScript(`${process.env.PUBLIC_URL + "/assets/js/datatable/datatables/jquery.dataTables.min.js"}`)
        setTimeout(() => {
            setTimeout(() => {
            setLoading(false)
            }, 500)
            loadScript(`${process.env.PUBLIC_URL + "/assets/js/datatable/datatables/datatable.custom.js"}`)
        }, 200)
    }, []);

    return (
        <>
            <Helmet>
                <link rel="stylesheet" type="text/css" href={process.env.PUBLIC_URL + "/assets/css/vendors/datatables.css"} />
            </Helmet>

            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                <Header />
                <div className="page-body-wrapper">
                    <Sidebar />
                    <div className="page-body">
                        <div className="container-fluid">
                            <div className="page-title">
                                <div className="row">
                                <div className="col-6">
                                    <h4>Attendence</h4>
                                </div>
                                <div className="col-6">
                                    <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard">
                                        <svg className="stroke-icon">
                                            <use href="../assets/svg/icon-sprite.svg#stroke-home" />
                                        </svg>
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item active"> Attendence</li>
                                    </ol>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div class="card-header">
                                            <h4>Check Attendence</h4>
                                        </div>
                                        <div className="card-body">
                                            <form className="row g-3 needs-validation custom-input" noValidate="">
                                                <div className="col-md-6 position-relative">
                                                    <label className="form-label" htmlFor="validationTooltip01">Name</label>
                                                    <input className="form-control" id="validationTooltip01" type="text" placeholder="Mark" required=""/>
                                                </div>
                                                <div className="col-md-6 position-relative">
                                                    <label className="form-label" htmlFor="validationTooltip01">Email</label>
                                                    <input className="form-control" id="validationTooltip01" type="text" placeholder="mark@gmail.com" required=""/>
                                                </div>
                                                <div className="col-md-6 position-relative">
                                                    <label className="form-label" htmlFor="validationTooltip01">Phone Number</label>
                                                    <input className="form-control" id="validationTooltip01" type="text" placeholder="9874563210" required=""/>
                                                </div>
                                                <div className="col-md-6 position-relative">
                                                    <label className="form-label" htmlFor="validationTooltip01">Designation</label>
                                                    <input className="form-control" id="validationTooltip01" type="text" placeholder="Employee" required=""/>
                                                </div>
                                                <div className="container-fluid"></div>

                                                <div className="col-12">
                                                    <button className="btn btn-primary" type="submit">
                                                        View Attendence
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div class="card-header">
                                            <h4>Attendance Details</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <div id="data-source-1_wrapper" className="dataTables_wrapper" >
                                                <div className="dataTables_length" id="data-source-1_length"></div>
                                                <div id="data-source-1_filter" className="dataTables_filter"></div>
                                                <table className="display dataTable" id="data-source-1" style={{ width: "100%" }} role="grid" aria-describedby="data-source-1_info">
                                                    <thead>
                                                        <tr role="row">
                                                            <th className="sorting_asc" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style={{ width: "168px" }}>
                                                                Date
                                                            </th>
                                                            <th className="sorting_asc" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style={{ width: "168px" }}>
                                                                Start Time
                                                            </th>
                                                            <th className="sorting" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style={{ width: "264px" }} >
                                                                End Time
                                                            </th>
                                                            <th className="sorting" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style={{ width: "97px" }} >
                                                                Short Fall Time
                                                            </th>
                                                            <th className="sorting" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style={{ width: "126px" }} >
                                                                Total Working Time
                                                            </th>
                                                            <th className="sorting" tabindex="0" aria-controls="data-source-1" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style={{ width: "126px" }} >
                                                            Action
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                    {" "}
                                                                    <a href="#">
                                                                        <i className="icon-pencil-alt"></i>
                                                                    </a>
                                                                </li>
                                                                <li className="delete">
                                                                    <a href="#">
                                                                        <i className="icon-trash"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                        <tr role="row" className="odd">
                                                            <td className="sorting_1">10 Aug 2023</td>
                                                            <td className="sorting_1">09:30</td>
                                                            <td>19:00</td>
                                                            <td>00:00</td>
                                                            <td>08:30</td>
                                                            <td>
                                                            <ul className="action">
                                                                <li className="edit">
                                                                {" "}
                                                                <a href="#">
                                                                    <i className="icon-pencil-alt"></i>
                                                                </a>
                                                                </li>
                                                                <li className="delete">
                                                                <a href="#">
                                                                    <i className="icon-trash"></i>
                                                                </a>
                                                                </li>
                                                            </ul>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
