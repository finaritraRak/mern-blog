import React from 'react';
import '../../Css/Footer.css'

const Footer = () => {
    const year = new Date();
    return (
        <div>
            <div className="footer">
            </div>
            <div className=" text-white">
                <p className="copyright-blog">© {year.getFullYear()} Aina finaritra. All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer;
