import styled from 'styled-components';

const CommentMessageContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;

    .comment-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 5px;
        border-radius: 5px;
        background: #ff99ee;
        width: 70%;

        p {
            color: black;
            width: 100%;
        }
        
        div {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            font-size: 90%;

            span {
                color: purple;
                width: 100%;
            }

            p {
                color: black;      
            }
        }
    }
`;

const CommentComponent = (props) => {
    const { data, user } = props;
    
    return (
        <CommentMessageContainer style={{ justifyContent: data.senderId === user.id ? 'flex-end' : 'flex-start' }}>
            <div className='comment-content'>
                <p>{data.message}</p>
                <div>
                    <p>{data.senderName}</p>
                    <span>{new Date(data.addDate).toLocaleString()}</span>
                </div>
            </div>
        </CommentMessageContainer>
  )
}

export default CommentComponent