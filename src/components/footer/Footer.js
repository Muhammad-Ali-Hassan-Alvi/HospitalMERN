import React from 'react'

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <footer className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 footer-copyright text-center">
                            <p className="mb-0">Copyright {currentYear}{" "}© Complaint Management System  </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
