import React from 'react'
import { useEffect } from 'react';
import styled from 'styled-components';

const CommentMessageContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;

    .comment-content {
        display: flex;
        flex-direction: row;
        gap: 10px;
        padding: 5px;
        border-radius: 5px;
        background: gray;
        
        p {
            color: white;
        }
    
        span {
            color: white;
        }
    }
`;

const CommentComponent = (props) => {
    const { data, user } = props;
    
    return (
        <CommentMessageContainer style={{ justifyContent: data.senderId === user.id ? 'flex-end' : 'flex-start' }}>
            <div className='comment-content'>
                <p>{data.message}</p>
                <span>{new Date(data.addDate).toLocaleString()}</span>
            </div>
        </CommentMessageContainer>
  )
}

export default CommentComponent