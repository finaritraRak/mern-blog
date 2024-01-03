import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css"
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { FiEdit, FiArrowLeft } from 'react-icons/fi'
import { FaRegComment } from 'react-icons/fa'
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from 'react-icons/bs'
import CommentSidebar from '../CommentScreens/CommentSidebar';

const DetailBlog = () => {
  const [likeStatus, setLikeStatus] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [activeUser, setActiveUser] = useState({})
  const [blog, setBlog] = useState({})
  const [blogLikeUser, setBlogLikeUser] = useState([])
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false)
  const [loading, setLoading] = useState(true)
  const slug = useParams().slug
  const [blogReadListStatus, setBlogReadListStatus] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {

    const getDetailBlog = async () => {
      setLoading(true)
      var activeUser = {}
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUser = data.user

        setActiveUser(activeUser)

      }
      catch (error) {
        setActiveUser({})
      }

      try {
        const { data } = await axios.post(`/blog/${slug}`, { activeUser })
        setBlog(data.data)
        setLikeStatus(data.likeStatus)
        setLikeCount(data.data.likeCount)
        setBlogLikeUser(data.data.likes)
        setLoading(false)

        const blog_id = data.data._id;

        if (activeUser.readList) {

          if (!activeUser.readList.includes(blog_id)) {
            setBlogReadListStatus(false)
          }
          else {
            setBlogReadListStatus(true)

          }

        }

      }
      catch (error) {
        setBlog({})
        navigate("/not-found")
      }

    }
    getDetailBlog();

  }, [slug, setLoading])



  const handleLike = async () => {
    setTimeout(() => {
      setLikeStatus(!likeStatus)
    }, 1500)

    try {
      const { data } = await axios.post(`/blog/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setLikeCount(data.data.likeCount)
      setBlogLikeUser(data.data.likes)

    }
    catch (error) {
      setBlog({})
      localStorage.removeItem("authToken")
      navigate("/")
    }

  }

  const handleDelete = async () => {

    if (window.confirm("Do you want to delete this post")) {

      try {

        await axios.delete(`/blog/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        navigate("/")

      }
      catch (error) {
        console.log(error)
      }

    }

  }


  const editDate = (createdAt) => {

    const d = new Date(createdAt)
      ;
    var datestring = d.toLocaleString('eng', { month: 'long' }).substring(0, 3) + " " + d.getDate()
    return datestring
  }

  const addBlogToReadList = async () => {

    try {

      const { data } = await axios.post(`/user/${slug}/addBlogToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      setBlogReadListStatus(data.status)

      document.getElementById("readListLength").textContent = data.user.readListLength
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {
        loading ? <Loader /> :
          <>

            <div className='Inclusive-detailStory-page'>

              <div className="top_detail_wrapper">
                <Link to={'/'} >
                  <FiArrowLeft />
                </Link>
                <h5 className='text-white text-center'>{blog.title}</h5>

                <div className='story-general-info'>

                  <ul>
                    {blog.author &&
                      <li className='story-author-info'>
                        <img src={`/userPhotos/${blog.author.photo}`} alt={blog.author.username} />
                        <span className='story-author-username'>{blog.author.username}  </span>
                      </li>
                    }
                    <li className='story-createdAt text-white'>
                      {
                        editDate(blog.createdAt)
                      }
                    </li>
                    <b>-</b>

                    <li className='story-readtime text-white'>
                      {blog.readtime} min read

                    </li>

                  </ul>

                  {
                    !activeUser.username &&
                    <div className='comment-info-wrap'>

                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>


                      <b className='commentCount'>{blog.commentCount}</b>

                    </div>
                  }

                  {activeUser && blog.author &&
                    blog.author._id === activeUser._id ?
                    <div className="top_story_transactions">
                      <Link className='editStoryLink' to={`/blog/${blog.slug}/edit`}>
                        <FiEdit />
                      </Link>
                      <span className='deleteStoryLink' onClick={handleDelete}>
                        <RiDeleteBin6Line />
                      </span>
                    </div> : null
                  }
                </div>

              </div>

              <div className="CommentFieldEmp">

                <CommentSidebar slug={slug} sidebarShowStatus={sidebarShowStatus} setSidebarShowStatus={setSidebarShowStatus}
                  activeUser={activeUser}
                />

              </div>

              <div className='story-content text-white' >

                <div className="story-banner-img">
                  <img src={`/blogImages/${blog.image}`} alt={blog.title} />

                </div>

                <div className='content' dangerouslySetInnerHTML={{ __html: (blog.content) }}>
                </div>

              </div>

              {activeUser.username &&
                <div className='fixed-story-options'>

                  <ul>
                    <li>

                      <i onClick={handleLike} >

                        {likeStatus ? <FaHeart color="#0063a5" /> :
                          <FaRegHeart />
                        }
                      </i>

                      <b className='likecount'
                        style={likeStatus ? { color: "#0063a5" } : { color: "rgb(99, 99, 99)" }}
                      >  {likeCount}
                      </b>

                    </li>


                    <li>
                      <i onClick={(prev) => {
                        setSidebarShowStatus(!sidebarShowStatus)
                      }}>
                        <FaRegComment />
                      </i>

                      <b className='commentCount'>{blog.commentCount}</b>

                    </li>

                  </ul>

                  <ul>
                    <li>
                      <i onClick={addBlogToReadList}>

                        {blogReadListStatus ? <BsBookmarkFill color='#0205b1' /> :
                          <BsBookmarkPlus />
                        }
                      </i>
                    </li>

                    <li className='BsThreeDots_opt'>
                      <i  >
                        <BsThreeDots />
                      </i>

                      {activeUser &&
                        blog.author._id === activeUser._id ?
                        <div className="delete_or_edit_story  ">
                          <Link className='editStoryLink' to={`/blog/${blog.slug}/edit`}>
                            <p>Edit blog</p>
                          </Link>
                          <div className='deleteStoryLink' onClick={handleDelete}>
                            <p>Delete blog</p>
                          </div>
                        </div> : null
                      }

                    </li>

                  </ul>

                </div>
              }

            </div>
          </>
      }
    </>
  )
}

export default DetailBlog;
