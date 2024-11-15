import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AppContext from '../../lib/app-context';

export default function PostInfo() {
  const { user, handleMessage } = useContext(AppContext);
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/boardGamePosts/${postId}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!user) return <Navigate to="/sign-in" replace />;
  if (!post) return null;

  return (
    <>
      <div className="row">
        <div className="col-1 post-info-game shadow">
          <h1 className="text-shadow orange">{post.gameName}</h1>
        </div>
      </div>
      <div className="row row-2">
        <div className="col-2 post-info-left">
          <div className="col-1 image-post">
            <img src={post.image} alt={post.gameName} />
          </div>
          <div className="col-1 post-info-block-container">
            <div className="post-info-block">
              <div className="post-info-block-title">
                <h3 className="orange">Players:</h3>
              </div>
              <div className="post-info-block-value">
                <h3 className="lora">{post.minPlayers === post.maxPlayers ? `${post.maxPlayers}` : `${post.minPlayers} - ${post.maxPlayers}`}</h3>
              </div>
            </div>
            <div className="post-info-block">
              <div className="post-info-block-title">
                <h3 className="orange">Play Time:</h3>
              </div>
              <div className="post-info-block-value">
                <h3 className="lora">{post.minPlayTime === post.maxPlayTime ? `${post.maxPlayTime} min` : `${post.minPlayTime} - ${post.maxPlayTime} min`}</h3>
              </div>
            </div>
            <div className="post-info-block">
              <div className="post-info-block-title">
                <h3 className="orange">Ages:</h3>
              </div>
              <div className="post-info-block-value">
                <h3 className="lora">{`${post.ageLimit}+`}</h3>
              </div>
            </div>
            <div className="post-info-block">
              <div className="post-info-block-title">
                <h3 className="orange">Year:</h3>
              </div>
              <div className="post-info-block-value">
                <h3 className="lora">{`${post.yearPublished}`}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2 post-info-right">
          <div className="col-1 post-info-text">
            <div className="shadow post-info-text-title">
              <h3 className="orange">Description:</h3>
            </div>
            <div className="col-1 post-info-text-value-long">
              <h3 dangerouslySetInnerHTML={{ __html: post.description }} className="lora"></h3>
            </div>
          </div>
          <div className="col-1 post-info-text">
            <div className="shadow post-info-text-title">
              <h3 className="orange">Lender:</h3>
            </div>
            <div className="col-1 post-info-text-value">
              <h3 className="lora">{post.lenderName}</h3>
            </div>
          </div>
          <div className="col-1 post-info-text">
            <div className="shadow post-info-text-title">
              <h3 className="orange">Lender&apos;s Comments:</h3>
            </div>
            <div className="col-1 post-info-text-value-long">
              <h3 className="lora">{post.lenderComments}</h3>
            </div>
          </div>
        </div>
        <div className="row post-info-button">
          <button className="shadow text-shadow" onClick={handleMessage} >Message Lender</button>
        </div>
      </div>
    </>
  );
}
