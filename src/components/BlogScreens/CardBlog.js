import React from 'react';
import { Link } from 'react-router-dom';

const Blog = ({ blog }) => {

    const editDate = (createdAt) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(createdAt);
        var datestring = d.getDate() + " " +monthNames[d.getMonth()] + " ," + d.getFullYear() 
        return datestring
    }

    const truncateContent = (content) => {
        const trimmedString = content.substr(0, 73);
        return trimmedString
    }
    const truncateTitle= (title) => {
        const trimmedString = title.substr(0, 69);
        return trimmedString
    }
    
    return (

        <div className="story-card">
            <Link to={`/blog/${blog.slug}`} className="story-link">

                <img className=" story-image" src={`/blogImages/${blog.image}`} alt={blog.title} />
                <div className="story-content-wrapper">

                    <h5 className="story-title">
                        
                    {blog.title.length > 76 ? truncateTitle(blog.title)+"..." : blog.title
                    
                    }
                    </h5>


                    <p className="story-text"dangerouslySetInnerHTML={{__html : truncateContent( blog.content) +"..."}}>
                        </p>
                    <p className="story-createdAt">{editDate(blog.createdAt)} 
                    </p>
                </div>
            </Link>
        </div>

    )
}

export default Blog;
